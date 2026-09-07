<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1e-7LGqUTmkmniFUhZeheWfyi6TVgNsUf

## Run Locally

Prerequisites: Node.js

1. Install dependencies:
   `npm install`
2. Set required runtime variables in `.env`.
3. Run the app:
   `npm run dev`

## Contact form security

The Contact page renders Cloudflare Turnstile and sends form submissions to the
Vercel Function at `/api/contact`. That function validates the Turnstile token
before forwarding the existing `786_consultation_booking` payload to n8n.

Configure these variables in `.env` locally and in Vercel for Production and
Preview:

- `VITE_SUPABASE_URL` - public Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - public Supabase anon key
- `VITE_TURNSTILE_SITE_KEY` - public Turnstile site key
- `TURNSTILE_SECRET_KEY` - server-only Turnstile secret key
- `TURNSTILE_ALLOWED_HOSTNAMES` - comma-separated hostnames accepted after Siteverify
- `VITE_N8N_WEBHOOK_URL` - existing n8n webhook URL used by site events and contact forwarding

For a fixed staging hostname, add it both to the Turnstile widget's hostname
allowlist and to `TURNSTILE_ALLOWED_HOSTNAMES`. The active Vercel preview
hostname is accepted automatically through `VERCEL_URL`.

Use the real Cloudflare Turnstile pair from `.env` for local work. Never deploy
Cloudflare's official test pair to production; production rejects likely test
credentials.

If `aidatahouse.com` is proxied through Cloudflare, add a WAF rate-limiting rule
for URI path `/api/contact` and POST method when the plan supports method
matching. Start with 10 requests per IP per minute and a 10-minute Managed
Challenge, then tune it from observed traffic. The function also applies a
best-effort eight-request-per-minute limit, but edge limits are authoritative
for serverless deployments.

n8n remains responsible for downstream lead handling and any confirmation or
internal notification emails.
