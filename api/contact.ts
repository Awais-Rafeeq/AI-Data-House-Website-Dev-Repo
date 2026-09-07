import type { IncomingMessage, ServerResponse } from 'node:http';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const CONTACT_ACTION = '786_consultation_booking';
const TURNSTILE_ACTION = 'contact_submit';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;

const SERVICES = new Set([
  'Not sure yet, help me figure it out',
  'Lead Rescue (capture + follow up leads)',
  'Ops Autopilot (workflow automation)',
  'Decision Dashboard (live reporting)',
  'Always-On Agent (AI voice / chat)',
  'Business OS (full build)',
]);

type ApiRequest = IncomingMessage & { body?: unknown };
type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: Record<string, unknown>) => void;
};

type ContactBody = {
  name?: unknown;
  email?: unknown;
  service_type?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
  website?: unknown;
  context?: unknown;
};

type RateEntry = { count: number; resetAt: number };
const rateStore = new Map<string, RateEntry>();

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.trim().replace(/\u0000/g, '');
  return clean.length <= max ? clean : null;
}

export function validateContactBody(body: ContactBody) {
  const name = text(body.name, 120);
  const email = text(body.email, 254);
  const serviceType = text(body.service_type, 120);
  const message = text(body.message, 3000);
  const token = text(body.turnstileToken, 2048);
  const website = text(body.website, 200);
  const emailValid = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  if (name === null || !emailValid || !serviceType || !SERVICES.has(serviceType) || message === null) {
    return { ok: false as const, error: 'Please check the form fields and try again.' };
  }
  if (!token) return { ok: false as const, error: 'Please complete the secure verification and try again.', code: 'turnstile_required' };
  if (website) return { ok: false as const, error: 'We could not submit this request.', code: 'spam_detected' };

  return { ok: true as const, data: { name, email: email!, service_type: serviceType, message, token } };
}

function clientIp(req: ApiRequest) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return raw?.trim() || req.socket.remoteAddress || 'unknown';
}

export function isRateLimited(ip: string, now = Date.now()) {
  const current = rateStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY is not configured');
  if (process.env.NODE_ENV === 'production' && /^([123])x0+AA$/.test(secret)) {
    throw new Error('Cloudflare test credentials are not allowed in production');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ip,
        idempotency_key: crypto.randomUUID(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Siteverify returned ${response.status}`);
    return await response.json() as { success?: boolean; action?: string; hostname?: string; 'error-codes'?: string[] };
  } finally {
    clearTimeout(timeout);
  }
}

function isAllowedHostname(hostname: string | undefined) {
  if (!hostname) return false;
  const allowed = new Set(['aidatahouse.com', 'www.aidatahouse.com']);
  if (process.env.VERCEL_URL) allowed.add(process.env.VERCEL_URL);
  for (const value of (process.env.TURNSTILE_ALLOWED_HOSTNAMES || '').split(',')) {
    if (value.trim()) allowed.add(value.trim());
  }
  if (process.env.NODE_ENV !== 'production') {
    allowed.add('localhost');
    allowed.add('127.0.0.1');
  }
  return allowed.has(hostname);
}

function parseBody(req: ApiRequest): ContactBody | null {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return null;
  return req.body as ContactBody;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const declaredSize = Number(req.headers['content-length'] || 0);
  if (declaredSize > MAX_BODY_BYTES) return res.status(413).json({ success: false, error: 'Request is too large.' });
  if (isRateLimited(clientIp(req))) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ success: false, code: 'rate_limited', error: 'Too many attempts. Please wait a minute and try again.' });
  }

  const body = parseBody(req);
  if (!body || Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
    return res.status(400).json({ success: false, error: 'Invalid request.' });
  }

  const validated = validateContactBody(body);
  if (!validated.ok) return res.status(400).json({ success: false, code: validated.code, error: validated.error });

  let turnstile;
  try {
    turnstile = await verifyTurnstile(validated.data.token, clientIp(req));
  } catch (error) {
    console.error('[contact] Turnstile verification unavailable:', error instanceof Error ? error.message : 'unknown error');
    return res.status(503).json({ success: false, code: 'turnstile_unavailable', error: 'Secure verification is temporarily unavailable. Please try again.' });
  }

  if (!turnstile.success || turnstile.action !== TURNSTILE_ACTION || !isAllowedHostname(turnstile.hostname)) {
    console.warn('[contact] Turnstile rejected request:', turnstile['error-codes'] || ['action-mismatch']);
    return res.status(403).json({ success: false, code: 'turnstile_failed', error: 'Verification expired or was unsuccessful. Please try again.' });
  }

  const context = body.context && typeof body.context === 'object' && !Array.isArray(body.context)
    ? body.context as Record<string, unknown>
    : {};
  const safeContext = {
    source_page: text(context.source_page, 300) || '/contact',
    session_id: text(context.session_id, 160) || 'server_contact',
    referrer: text(context.referrer, 500) || 'direct',
    screen_resolution: text(context.screen_resolution, 40) || 'unknown',
  };

  const payload = {
    action: CONTACT_ACTION,
    source_page: safeContext.source_page,
    timestamp: new Date().toISOString(),
    user_agent: text(req.headers['user-agent'], 500) || 'unknown',
    session_id: safeContext.session_id,
    data: {
      name: validated.data.name,
      email: validated.data.email,
      service_type: validated.data.service_type,
      message: validated.data.message,
      is_qualified: true,
      lead_source: 'Contact page quick form',
    },
    metadata: {
      referrer: safeContext.referrer,
      screen_resolution: safeContext.screen_resolution,
    },
  };

  const n8nEndpoint = process.env.VITE_N8N_WEBHOOK_URL;
  if (!n8nEndpoint) {
    console.error('[contact] VITE_N8N_WEBHOOK_URL is not configured');
    return res.status(503).json({ success: false, code: 'delivery_unavailable', error: 'Message delivery is temporarily unavailable. Please try again.' });
  }

  try {
    const upstream = await fetch(n8nEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) throw new Error(`n8n returned ${upstream.status}`);
  } catch (error) {
    console.error('[contact] Existing n8n workflow failed:', error instanceof Error ? error.message : 'unknown error');
    return res.status(502).json({ success: false, code: 'delivery_failed', error: 'We could not send your message. Please try again or email us directly.' });
  }

  return res.status(200).json({ success: true });
}
