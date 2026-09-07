import React, { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'cloudflare-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function isLikelyTurnstileTestKey(value: string) {
  return /^([123])x0+(AA|AB|BB|FF)$/.test(value);
}

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void;
  resetSignal: number;
}

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.appendChild(script);
  });
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onTokenChange, resetSignal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasTokenRef = useRef(false);
  const onTokenChangeRef = useRef(onTokenChange);
  const [status, setStatus] = useState<'loading' | 'ready' | 'interactive' | 'verified' | 'error'>('loading');
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    let cancelled = false;

    if (!siteKey || (import.meta.env.PROD && isLikelyTurnstileTestKey(siteKey))) {
      setStatus('error');
      return;
    }

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        setStatus('ready');
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          size: 'flexible',
          action: 'contact_submit',
          appearance: 'interaction-only',
          retry: 'auto',
          'refresh-expired': 'auto',
          'refresh-timeout': 'auto',
          'before-interactive-callback': () => setStatus('interactive'),
          'after-interactive-callback': () => setStatus(hasTokenRef.current ? 'verified' : 'ready'),
          callback: (token: string) => {
            hasTokenRef.current = true;
            setStatus('verified');
            onTokenChangeRef.current(token);
          },
          'expired-callback': () => {
            hasTokenRef.current = false;
            setStatus('ready');
            onTokenChangeRef.current(null);
          },
          'error-callback': () => {
            hasTokenRef.current = false;
            setStatus('error');
            onTokenChangeRef.current(null);
            return true;
          },
          'unsupported-callback': () => {
            setStatus('error');
            onTokenChangeRef.current(null);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
    hasTokenRef.current = false;
    onTokenChangeRef.current(null);
    setStatus('ready');
  }, [resetSignal]);

  return (
    <div className={`contact-turnstile is-${status}`} aria-live="polite">
      <div ref={containerRef} className="contact-turnstile-widget" />
      {status === 'loading' && <p className="contact-turnstile-status">Checking submission security...</p>}
      {status === 'verified' && <p className="contact-turnstile-status is-success">Protected against automated submissions.</p>}
      {status === 'error' && (
        <p className="contact-turnstile-status is-error" role="alert">
          Secure verification could not load. Check your connection or site configuration and refresh the page.
        </p>
      )}
    </div>
  );
};

export default TurnstileWidget;
