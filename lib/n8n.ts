
import { trackEvent, n8nActionToGaEvent } from './analytics';

const WEBHOOK_CONFIG = {
  endpoint: 'https://n8n.aidatahouse.cloud/webhook/website-events',
  securityCode: '786',
  timeout: 10000,
  retryAttempts: 2
};

// Generate or retrieve unique session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('aidh_session_id');
  if (!sessionId) {
    sessionId = '786_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('aidh_session_id', sessionId);
  }
  return sessionId;
}

export const ACTIONS = {
  CONTACT_MAIN: '786_contact_form_main',
  CONTACT_FOOTER: '786_contact_form_footer',
  CONSULTATION: '786_consultation_booking',
  QUOTE: '786_quote_request',
  NEWSLETTER: '786_newsletter_signup',
  AUDIT: '786_free_audit_request',
  RESOURCE_PDF: '786_resource_download_pdf',
  RESOURCE_TEMPLATE: '786_resource_download_template',
  RESOURCE_VIDEO: '786_resource_video_view',
  CASE_STUDY_PDF: '786_case_study_download',
  CHAT_START: '786_chatbot_conversation_start',
  CHAT_COMPLETE: '786_chatbot_conversation_complete',
  VOICE_SESSION: '786_voice_ai_session_log',
  EXIT_INTENT: '786_page_exit_intent',
  ROI_CALC: '786_roi_calculation',
  CTA_CLICK: '786_cta_click'
};

/**
 * Universal webhook sender for AI Data House events
 */
export const sendToN8n = async (action: string, data: any, options: any = {}) => {
  if (!action.startsWith('786_')) {
    console.error('Invalid action: must start with 786_');
    return { success: false, error: 'Invalid action namespace' };
  }

  // Mirror the action into GA4 (non-PII params only). Fired up front so it
  // records even if the webhook later fails.
  try {
    const gaParams: Record<string, string> = {};
    if (data?.location) gaParams.location = String(data.location);
    if (data?.label) gaParams.label = String(data.label);
    if (data?.type) gaParams.lead_type = String(data.type);
    trackEvent(n8nActionToGaEvent(action), gaParams);
  } catch (e) {
    // never let analytics break the webhook
  }

  const payload = {
    action: action,
    source_page: window.location.hash || '/',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    session_id: getSessionId(),
    data: data,
    metadata: {
      referrer: document.referrer || 'direct',
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      ...options.metadata
    }
  };

  console.log(`[n8n] Triggering: ${action}`, payload);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

    const response = await fetch(WEBHOOK_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, ...result };

  } catch (error: any) {
    console.error(`[n8n] Webhook Error (${action}):`, error);
    return { 
      success: false, 
      error: error.message || 'Network failure',
      action: action
    };
  }
};
