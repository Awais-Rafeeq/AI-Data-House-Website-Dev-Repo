export interface ContactFormData {
  name: string;
  email: string;
  service_type: string;
  message: string;
}

export interface ContactSubmitResult {
  success: boolean;
  code?: string;
  error?: string;
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('aidh_session_id');
  if (!sessionId) {
    sessionId = `786_sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('aidh_session_id', sessionId);
  }
  return sessionId;
}

export async function submitContactForm(
  form: ContactFormData,
  turnstileToken: string,
  website = '',
): Promise<ContactSubmitResult> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        turnstileToken,
        website,
        context: {
          source_page: window.location.hash || '/contact',
          session_id: getSessionId(),
          referrer: document.referrer || 'direct',
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
        },
      }),
    });

    const result = await response.json().catch(() => ({}));
    return {
      success: response.ok && result.success === true,
      code: typeof result.code === 'string' ? result.code : undefined,
      error: typeof result.error === 'string' ? result.error : undefined,
    };
  } catch {
    return { success: false, code: 'network_error', error: 'Network request failed.' };
  }
}
