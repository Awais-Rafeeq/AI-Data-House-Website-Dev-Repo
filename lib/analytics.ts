// GA4 helpers. The gtag snippet in index.html loads with send_page_view:false,
// so this is the single place that fires page views (manually, on every SPA
// route change) and mirrors product events into GA4 alongside the n8n webhook.

export const GA_ID = 'G-P3BTVDGED9';

type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function callGtag(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// Fired on every route change (and initial load) because the site is a SPA and
// the gtag config has send_page_view disabled.
export function trackPageView(path: string) {
  callGtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: GtagParams = {}) {
  callGtag('event', name, params);
}

// Turns an n8n action (786_free_audit_request) into a clean GA4 event name
// (free_audit_request) so the same call drives both the webhook and analytics.
export function n8nActionToGaEvent(action: string): string {
  return action.replace(/^786_/, '');
}
