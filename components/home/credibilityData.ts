// Every value here is lifted from existing public proof points or the live
// Clutch profile. If a number or badge is not already true somewhere else, it
// does not belong in this file.

export interface TrustPlatform {
  id: string;
  name: string;
  /** The headline value: a rating, or a status like "Top Rated". */
  score: string;
  meta: string;
  href: string;
  ariaLabel: string;
  logoSrc?: string;
}

export const TRUST_PLATFORMS: TrustPlatform[] = [
  {
    id: 'clutch',
    name: 'Clutch',
    score: '5.0',
    // Review count confirmed against the live profile: 4 reviews, all 5.0.
    meta: '4 verified reviews',
    href: 'https://clutch.co/profile/ai-data-house',
    ariaLabel: '5.0 rating from 4 verified reviews on Clutch - opens the AI Data House Clutch profile in a new tab',
    logoSrc: '/images/home/clutch-wordmark.png',
  },
  {
    id: 'upwork',
    name: 'Upwork',
    score: 'Top Rated',
    meta: '100% job success',
    href: 'https://www.upwork.com/ag/aidatahouse',
    ariaLabel: 'Top Rated with 100% job success on Upwork - opens the AI Data House Upwork agency page in a new tab',
  },
];

/** `icon` maps to a lucide component in CredibilitySection. */
export interface ProofMetric {
  value: string;
  label: string;
  detail: string;
  icon: 'systems' | 'response' | 'registered';
}

export const PROOF_METRICS: ProofMetric[] = [
  { value: '500+', label: 'Systems delivered', detail: 'US - UK - MENA', icon: 'systems' },
  { value: '<24h', label: 'Average response', detail: 'EST to PST', icon: 'response' },
  { value: 'PSEB', label: 'Registered', detail: 'Verified entity', icon: 'registered' },
];

/**
 * Trusted-by clients verified against the live Clutch profile:
 * https://clutch.co/profile/ai-data-house
 *
 * Exactly three reviewers name their company publicly; the fourth is posted
 * as "CEO, Digital Marketing Agency - Anonymous", so there is no public
 * client brand to show for it.
 */
export interface TrustedClient {
  id: string;
  name: string;
  logoSrc: string;
}

export const TRUSTED_CLIENTS: TrustedClient[] = [
  { id: 'sinergizar', name: 'Sinergizar', logoSrc: '/images/home/sinergizar-wordmark.png' },
  { id: 'good-care', name: 'Good Care Ventures', logoSrc: '/images/home/good-care-ventures-mark.svg' },
  { id: 'apex', name: 'Apex Heat and A/C', logoSrc: '/images/home/apex-logo.webp' },
];

// The real integration list, moved out of the hand-written markup so the
// marquee is data-driven. Two rows travelling in opposite directions, exactly
// as the previous strip did.
export const TECH_ROW_ONE: string[] = [
  'n8n', 'Make', 'Zapier', 'GoHighLevel', 'HubSpot', 'Salesforce', 'Airtable',
  'Supabase', 'Google Sheets', 'Notion', 'Slack', 'WhatsApp', 'Instagram',
  'Calendly', 'Stripe', 'Shopify',
];

export const TECH_ROW_TWO: string[] = [
  'OpenAI', 'Claude', 'Gemini', 'Vapi', 'Retell', 'ElevenLabs', 'Twilio',
  'Voiceflow', 'Power BI', 'Microsoft Fabric', 'Looker', 'Tableau',
  'QuickBooks', 'Vercel', 'AWS', 'Google',
];
