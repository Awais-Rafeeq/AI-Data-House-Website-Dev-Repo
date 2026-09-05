// Full solution-page content. Source of truth: SOLUTION_PAGES_COPY.md (2026-06-24).
// Slugs follow the locked spec. Old slugs redirect via App.tsx + vercel.json.

export interface PricingRow {
  scope: string;
  includes: string;
  timeline: string;
  startingAt: string;
}

export interface WorkflowExample {
  title: string;
  before?: string;
  after?: string;
  body?: string;
  tools: string;
}

export interface BigStat {
  value: string; // the one big number, e.g. "40+ hrs/week"
  label: string; // what it measures, e.g. "of manual work eliminated"
}

export interface SolutionContent {
  slug: string;
  navLabel: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  // One bold sentence: what the product IS (pain-first pattern, shown under the H1).
  whatItIs: string;
  // The one big result number, derived from proof.result.
  bigStat: BigStat;
  hero: {
    headline: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    trustRow: string;
  };
  problem: { headline: string; body: string[]; costs: string[] };
  whoFor: { intro: string; points: string[]; industries: string };
  workflowsHeading: string;
  workflows: WorkflowExample[];
  techStack: { label: string; value: string }[];
  pricing: PricingRow[];
  proof: { heading: string; situation: string; built: string; result: string; note: string };
  faqs: { q: string; a: string }[];
  cta: { headline: string; body: string; button: string };
  relatedPosts?: string[]; // blog slugs
  hasVoiceDemo?: boolean;
  // Condensed copy + icon key for the homepage solutions grid. Single source of
  // truth so the homepage card and the detail page never drift apart.
  homeCard: { icon: string; problem: string; example: string; price: string; whatItIs: string; bigStat: BigStat };
}

export const SOLUTIONS: SolutionContent[] = [
  {
    slug: 'ai-workflow-automation',
    navLabel: 'AI Workflow Automation',
    image: '/images/solutions/solution-workflow-automation.png',
    homeCard: {
      icon: 'zap',
      problem: 'Manual, multi-step processes that rely on someone remembering to do them',
      example: 'Lead form → CRM sync → WhatsApp follow-up → dashboard update, all in under 2 minutes',
      price: '$1,000',
      whatItIs: 'A system that runs your multi-step processes automatically, so data moves between your tools with zero manual copying.',
      bigStat: { value: '40+ hrs/week', label: 'of manual work eliminated' },
    },
    metaTitle: 'AI Workflow Automation Services for US Businesses | AI Data House',
    metaDescription:
      'We automate the manual, multi-step business processes slowing your team down. n8n, Make.com, Zapier, and custom API workflows. Starting at $1,000. Free audit available.',
    whatItIs: 'It is a system that runs your multi-step processes automatically, so data moves between your tools with zero manual copying.',
    bigStat: { value: '40+ hrs/week', label: 'of manual work eliminated' },
    hero: {
      headline: 'Every manual step in your business is a place where things slow down, break, or get forgotten.',
      sub: 'We map your most painful multi-step processes and automate them end to end, so your team stops doing data entry, chasing updates, and rebuilding the same reports every week.',
      primaryCta: 'Book Free Workflow Audit',
      secondaryCta: 'See a real automation example',
      trustRow: '500+ workflows automated · Clutch 5.0/5.0 · Starting at $1,000',
    },
    problem: {
      headline: 'The problem is not your team. It is the process they are stuck executing manually.',
      body: [
        'Most business operations were designed when the company was smaller. They worked fine at 5 clients. At 50, they create bottlenecks. At 150, they create chaos.',
        'The workflows look like this: someone fills a form, someone copies it into a spreadsheet, someone sends an email, someone updates the CRM, someone builds a report from it on Friday. Every step is a human touching data that a system should be moving automatically.',
      ],
      costs: [
        'Hours of skilled staff time spent on work that should not require a human',
        'Errors that happen when data is copied between tools manually',
        'Delays between a trigger event and the action that should follow it',
        'No visibility into whether the process ran or where it broke',
      ],
    },
    whoFor: {
      intro: 'This is for your business if any of the following is true:',
      points: [
        'You have a process that involves more than two tools and a human copying between them',
        'Your team does the same repetitive task more than three times a week',
        'Something breaks or gets missed when a specific person is out',
        'You are paying for software that does not talk to your other software',
        'A new hire could not execute a process without being walked through it manually',
      ],
      industries: 'Real estate · E-commerce · Agencies · Professional services · Healthcare · Insurance · Restaurants',
    },
    workflowsHeading: 'How It Works: Four Real Workflow Types',
    workflows: [
      {
        title: 'Lead and Sales Automation',
        before: 'Lead submits a form. It sits in an email inbox. Someone copies it to a spreadsheet. Someone else updates the CRM when they remember.',
        after: 'Lead submits form → instantly synced to CRM → owner assigned → follow-up sent in 90 seconds → pipeline stage set → manager notified in Slack.',
        tools: 'n8n · GoHighLevel · HubSpot · Airtable · Slack · Gmail · WhatsApp',
      },
      {
        title: 'Operations and Admin Automation',
        before: 'Team fills timesheets manually. Manager collects them Friday. Payroll entry done Monday morning. Reports emailed by Tuesday.',
        after: 'Timesheet submitted → auto-calculated → payslip generated → sent to employee → summary logged to dashboard. Zero manual steps.',
        tools: 'Google Apps Script · n8n · Google Sheets · Docs · Slack',
      },
      {
        title: 'Order and Fulfillment Automation',
        before: 'Order placed in Shopify. Team manually checks inventory. Fulfillment team notified by email. Tracking number entered manually.',
        after: 'Order placed → inventory checked automatically → fulfillment triggered → tracking synced back to Shopify → customer notified → Slack alert to team.',
        tools: 'n8n · Shopify · Airtable · Slack · custom API',
      },
      {
        title: 'Document and Reporting Automation',
        before: 'Staff generates weekly reports by pulling data from three tools, pasting into a template, formatting it, and emailing it to the right people.',
        after: 'Scheduled trigger fires → data pulled from all sources → report generated automatically → formatted → emailed to stakeholders. Every time. On schedule.',
        tools: 'n8n · Make.com · Google Sheets · Power BI · Gmail',
      },
    ],
    techStack: [
      { label: 'Automation platforms', value: 'n8n · Make.com · Zapier · Google Apps Script' },
      { label: 'CRMs', value: 'GoHighLevel · HubSpot · Salesforce · Airtable · Pipedrive' },
      { label: 'Communication', value: 'Slack · Gmail · WhatsApp · Twilio · SMS' },
      { label: 'Data', value: 'Google Sheets · Airtable · Supabase · MySQL · Postgres' },
      { label: 'Payments', value: 'Stripe · PayPal · QuickBooks' },
      { label: 'Documents', value: 'Google Docs · PDF generation · DocuSign' },
    ],
    pricing: [
      { scope: 'Mini Pilot', includes: 'One workflow automated end to end', timeline: '3-7 days', startingAt: '$300' },
      { scope: 'Process Sprint', includes: 'One complete process with 2-4 integrations, testing, documentation', timeline: '14-21 days', startingAt: '$1,000' },
      { scope: 'Full Automation System', includes: 'Multiple processes, custom logic, dashboards, team handoff', timeline: '30-60 days', startingAt: '$3,000' },
      { scope: 'Monthly Retainer', includes: 'Ongoing monitoring, fixes, new automations', timeline: 'Monthly', startingAt: '$500/mo' },
    ],
    proof: {
      heading: 'Proof: HVAC Company, USA',
      situation: 'A US HVAC company had field technicians submitting service reports on paper. Admin staff spent 3 hours every day entering data into a CRM manually. Every Monday, a manager spent 4 hours building a performance report in Excel.',
      built: 'An end-to-end automation using n8n. Field reports submitted digitally → auto-synced to CRM → Slack notifications fired → Power BI dashboard updated in real time. Monday report became live and automatic.',
      result: '40+ hours of manual work eliminated every week. Zero admin staff required for data entry. Manager\'s Monday report now runs automatically overnight.',
      note: 'Client name withheld by NDA. Full architecture available on request.',
    },
    faqs: [
      { q: 'How do you know which workflows to automate first?', a: 'We run a free 30-minute audit before any project starts. We map your current workflows, identify where the most time is being lost, and recommend which automations will deliver the highest ROI in the shortest time.' },
      { q: 'Do we need to switch our existing tools?', a: 'Almost never. We build around what you already use. The goal is to connect your existing tools, not replace them.' },
      { q: 'What if a workflow breaks after you deliver it?', a: 'Every automation we build includes documentation, error handling, and a defined support path. We offer ongoing retainers for monitoring and maintenance if needed.' },
      { q: 'How is this different from just using Zapier ourselves?', a: 'Zapier handles simple two-step triggers. What we build involves conditional logic, error handling, multi-step flows with branching, API calls, data transformation, and custom integrations. If you could build it yourself in an afternoon, we would tell you that.' },
      { q: 'Do you handle data security during automation?', a: 'Yes. We do not store client data beyond project scope. Credentials are managed securely, and every workflow is documented with access notes. We can deploy entirely within your own accounts and infrastructure.' },
    ],
    cta: {
      headline: 'Tell us the process you are most tired of doing manually.',
      body: 'Book a free 30-minute workflow audit. We will map it, estimate the ROI, and tell you exactly what it would take to automate it. No commitment required.',
      button: 'Book Free Workflow Audit',
    },
    relatedPosts: ['what-to-automate-first-growing-business', 'real-cost-manual-work-automation-roi'],
  },
  {
    slug: 'ai-chatbots',
    homeCard: {
      icon: 'message-square',
      problem: 'Leads going cold because no one responded fast enough',
      example: 'AI qualifies website visitors 24/7, routes hot leads to CRM before your team starts their day',
      price: '$1,500',
      whatItIs: 'An AI assistant that qualifies every visitor, answers instantly, and drops hot leads into your CRM around the clock.',
      bigStat: { value: '24/7', label: 'lead capture, zero manual routing' },
    },
    navLabel: 'AI Chatbots',
    image: '/images/solutions/solution-ai-chatbots.png',
    metaTitle: 'AI Chatbots for US Businesses, Lead Qualification and Customer Support | AI Data House',
    metaDescription:
      'We build AI chatbots that qualify leads, answer customer questions, and route conversations to your CRM, 24/7, across your website and WhatsApp. Starting at $1,500.',
    whatItIs: 'It is an AI assistant that qualifies every visitor, answers instantly, and drops hot leads into your CRM around the clock.',
    bigStat: { value: '24/7', label: 'lead capture, zero manual routing' },
    hero: {
      headline: 'Your best leads are not the ones who fill out the form. They are the ones who ask a question and never hear back.',
      sub: 'We build AI chatbots that qualify visitors, answer questions instantly, and route hot leads to your CRM before your team starts their day, on your website, on WhatsApp, and everywhere else your customers already are.',
      primaryCta: 'Book Free Chatbot Audit',
      secondaryCta: 'See how it qualifies leads',
      trustRow: '24/7 lead capture · Multi-channel · CRM-integrated · Starting at $1,500',
    },
    problem: {
      headline: 'A lead that does not get a response in 5 minutes is 21 times less likely to convert.',
      body: [
        'That is not a philosophy. That is a studied pattern in US sales data. The problem is not your team\'s effort. It is the gap between when a prospect is ready to talk and when someone is available to respond.',
        'A visitor lands on your site at 9 PM on a Thursday. They have a question. They look around, find nothing fast enough, and leave. You wake up Friday with no record they were ever there.',
      ],
      costs: [
        'Leads captured during business hours, ignored after hours',
        'Sales reps spending time answering the same pre-qualification questions on every call',
        'No consistent qualification process, different reps ask different things',
        'CRM is only as accurate as whoever remembered to log the conversation',
      ],
    },
    whoFor: {
      intro: 'This is the right solution if:',
      points: [
        'You get inbound leads from your website or WhatsApp but response time is longer than 5 minutes',
        'Your sales team spends significant call time on leads that were never qualified',
        'You want coverage outside of business hours without hiring overnight staff',
        'You have a knowledge base, FAQ, or product catalog that visitors ask questions about repeatedly',
        'You are running ads and need a faster, smarter landing experience than a static form',
      ],
      industries: 'Real estate · E-commerce · Healthcare / clinics · Agencies · Professional services · SaaS · Coaching and education',
    },
    workflowsHeading: 'How It Works: Four Real Chatbot Types',
    workflows: [
      {
        title: 'Lead Qualification Chatbot',
        body: 'Engages every site visitor, asks qualification questions in natural conversation, scores the lead, and routes qualified prospects to your CRM with full context, while booking a call if they are ready. Lands on site → chatbot opens → asks 3-4 qualification questions → if qualified: CRM entry created + calendar link sent → if not qualified: nurture sequence triggered.',
        tools: 'OpenAI or Claude · Voiceflow or Botpress · HubSpot or GoHighLevel · Calendly',
      },
      {
        title: 'Knowledge Base Chatbot (RAG)',
        body: 'Reads your website, documents, FAQs, and product catalog. Answers any question a customer would otherwise email or call about, pricing tiers, service availability, integration compatibility, process timelines, support troubleshooting, policy questions. Hands off to a human only when the conversation needs it.',
        tools: 'OpenAI or Claude · Supabase (vector store) · Botpress or custom build · n8n for escalation',
      },
      {
        title: 'WhatsApp Automation Bot',
        body: 'For businesses where clients primarily communicate on WhatsApp. Client messages asking about availability → bot qualifies → sends service menu → client selects → booking triggered → confirmation sent → reminder fired 24 hours before. Staff only sees the confirmed booking.',
        tools: 'WhatsApp Business API · GreenAPI or Twilio · n8n · GoHighLevel',
      },
      {
        title: 'E-commerce Support Bot',
        body: 'Handles order status, return requests, product questions, and shipping inquiries. Pulls live data from your store. Replaces the "where is my order?" emails, return form confusion, product compatibility questions, and shipping policy questions. Escalates only when a human decision is needed.',
        tools: 'Shopify or WooCommerce API · OpenAI · Botpress · n8n · Slack for escalations',
      },
    ],
    techStack: [
      { label: 'AI models', value: 'OpenAI GPT-4o · Anthropic Claude · Google Gemini' },
      { label: 'Bot builders', value: 'Botpress · Voiceflow · Custom React build' },
      { label: 'Knowledge base', value: 'Supabase (pgvector) · Pinecone · custom RAG pipeline' },
      { label: 'Channels', value: 'Website widget · WhatsApp · Facebook Messenger · Instagram DM' },
      { label: 'CRM integration', value: 'GoHighLevel · HubSpot · Salesforce · Airtable · Pipedrive' },
      { label: 'Automation backbone', value: 'n8n · Make.com' },
    ],
    pricing: [
      { scope: 'FAQ Chatbot', includes: 'Knowledge base setup, website widget, basic escalation', timeline: '5-10 days', startingAt: '$1,500' },
      { scope: 'Lead Qualification Bot', includes: 'Qualification flow, CRM integration, calendar booking', timeline: '10-14 days', startingAt: '$2,000' },
      { scope: 'Multi-channel Bot', includes: 'Website + WhatsApp + CRM + full conversation logging', timeline: '14-21 days', startingAt: '$3,000' },
      { scope: 'Full AI Support System', includes: 'Multi-channel + RAG knowledge base + human escalation + reporting', timeline: '21-30 days', startingAt: '$4,500' },
    ],
    proof: {
      heading: 'Proof: SkyClinics, USA',
      situation: 'A US healthcare clinic was acquiring patients across Facebook Ads, Google Ads, and organic web. Every lead came into a different place. Follow-up was manual. Qualification was inconsistent.',
      built: 'An AI chatbot integrated into the website that qualified inbound leads with HIPAA-aware questions, scored intent, and routed to the CRM automatically. Paired with an automated multi-channel follow-up sequence for leads who did not convert on first contact.',
      result: 'Complete patient acquisition pipeline built from scratch. Every inbound lead now captured, qualified, and followed up, with zero manual routing by staff.',
      note: 'Client name shared with permission. Full case study available on request.',
    },
    faqs: [
      { q: 'Can the chatbot sound like our brand, not like a generic bot?', a: 'Yes. We write the conversation flows, personality, and tone to match your brand voice. Visitors should not be able to tell it is AI unless they specifically ask, and even then, we can configure how it responds.' },
      { q: 'What happens when the chatbot cannot answer a question?', a: 'We build escalation rules into every bot. When a conversation goes outside the bot\'s knowledge or a visitor requests a human, the conversation is flagged, summarized, and sent to your team with full context. No conversation disappears.' },
      { q: 'Will it integrate with our existing CRM?', a: 'If your CRM has an API, which most do, yes. We have integrated with GoHighLevel, HubSpot, Salesforce, Pipedrive, Airtable, and custom CRM setups. We tell you up front if an integration has limitations.' },
      { q: 'How do you keep the knowledge base up to date?', a: 'We set up a system where your team can update source documents and the knowledge base re-indexes automatically. You do not need to re-train a model every time your pricing or services change.' },
      { q: 'Is it HIPAA-compliant for healthcare use?', a: 'We build with HIPAA-aware architecture for healthcare clients: no PHI stored in the bot platform, conversations routed through compliant infrastructure, audit logs available. We disclose exactly what is and is not covered in the initial audit.' },
    ],
    cta: {
      headline: 'See what a qualified lead looks like when it reaches your CRM automatically.',
      body: 'Book a free 30-minute audit. We will look at your current lead flow, identify where prospects are dropping off, and show you exactly what an AI chatbot would change.',
      button: 'Book Free Chatbot Audit',
    },
    relatedPosts: ['ai-chatbot-vs-voice-agent', 'automate-lead-follow-up-system'],
  },
  {
    slug: 'ai-voice-agents',
    homeCard: {
      icon: 'phone-call',
      problem: 'Missed calls, overwhelmed front desks, no after-hours coverage',
      example: 'AI answers inbound calls, takes orders, books appointments, transfers to human only when needed',
      price: '$1,500',
      whatItIs: 'An AI receptionist that answers every call in a natural voice, books the appointment, and transfers to a human only when needed.',
      bigStat: { value: '0 missed', label: 'bookings from unanswered calls' },
    },
    navLabel: 'AI Voice Agents',
    image: '/images/solutions/solution-voice-agents.png',
    metaTitle: 'AI Voice Agents for US Businesses, Inbound Calls, Appointments, Lead Qualification | AI Data House',
    metaDescription:
      'We build AI voice agents that answer every call, qualify leads, book appointments, and take orders, 24/7, no hold times. VAPI + ElevenLabs + custom CRM integration. Starting at $1,500.',
    hasVoiceDemo: true,
    whatItIs: 'It is an AI receptionist that answers every call in a natural voice, books the appointment, and transfers to a human only when needed.',
    bigStat: { value: '0 missed', label: 'bookings from unanswered calls' },
    hero: {
      headline: 'Every call your team cannot answer is a lead your competitor will.',
      sub: 'We build AI voice agents that pick up every inbound call, qualify the caller, book the appointment, take the order, or route to a human, in a natural voice, with zero hold time, available 24/7.',
      primaryCta: 'Book Free Voice Agent Demo',
      secondaryCta: 'Try the live demo below',
      trustRow: 'Zero missed calls · 24/7 coverage · Human-quality voice · Starting at $1,500',
    },
    problem: {
      headline: 'Your phone rings when you are on another call, in a meeting, or closed for the day. That caller does not leave a voicemail. They call someone else.',
      body: [
        'Phone coverage is a revenue problem disguised as a staffing problem. Hiring more front desk staff scales cost linearly. Building a smarter first-response layer scales differently.',
        'The businesses winning on inbound today are not the ones with the most staff answering phones. They are the ones where every call gets answered, every question gets a real response, and every qualified caller moves forward, regardless of what time it is.',
      ],
      costs: [
        'Restaurant: a missed reservation or a missed order',
        'Clinic: a patient who booked with your competitor',
        'Real estate: a buyer who moved on in 20 minutes',
        'Service business: a lead who Googled the next option',
        'Any business: a customer who experienced friction and remembered it',
      ],
    },
    whoFor: {
      intro: 'This is for your business if:',
      points: [
        'You miss inbound calls during busy periods, after hours, or on weekends',
        'Your front desk spends significant time on calls that follow a predictable script',
        'You want to qualify inbound callers before routing them to a human agent',
        'You run a high-call-volume business, restaurant, clinic, real estate office, service company',
        'You want outbound follow-up calls made automatically from your CRM',
      ],
      industries: 'Restaurants · Healthcare / clinics · Real estate · Legal · Insurance · Home services · Auto dealerships',
    },
    workflowsHeading: 'How It Works: Four Real Voice Agent Types',
    workflows: [
      {
        title: 'Inbound Appointment Booking Agent',
        body: 'Answers every inbound call. Calls → AI answers in under 1 ring → identifies need → asks qualifying questions → checks calendar availability → books slot → confirms by voice → SMS confirmation sent → CRM updated. Human transfer triggered only when the caller specifically requests it, or when the request is outside defined parameters.',
        tools: 'VAPI · ElevenLabs · Twilio · GoHighLevel · Calendly · n8n',
      },
      {
        title: 'Restaurant Order and Reservation Agent',
        body: 'Takes inbound orders and reservations by phone in a natural conversation. Reads from your live menu. Handles full menu orders, special requests and modifications, reservation bookings, wait time queries, and hours and location questions. Confirms order details and fires the order to your POS or kitchen system. Live demo available on this page.',
        tools: 'VAPI · Google GenAI · custom menu integration · n8n · POS API',
      },
      {
        title: 'Lead Qualification Calling Agent',
        body: 'AI calls the lead within minutes of form submission: form submitted → AI calls within 2 minutes → qualification conversation → if qualified: warm transfer or calendar booking → if not: tagged in CRM with reason and added to nurture. Your sales team only speaks to people who have already been qualified by a real conversation.',
        tools: 'VAPI · Twilio · n8n · GoHighLevel or HubSpot · Calendly',
      },
      {
        title: 'Outbound Follow-Up Agent',
        body: 'Re-engages leads who did not convert on first contact. Calls automatically based on CRM triggers, after X days with no response, after a proposal is sent, after a no-show. "Hi [Name], this is [Brand] following up on your inquiry about [service]. Do you have 2 minutes?" → qualification check → if interested: books call or warm transfer → if not: removes from active follow-up.',
        tools: 'VAPI · Twilio · n8n · GoHighLevel · CRM of choice',
      },
    ],
    techStack: [
      { label: 'Voice AI platform', value: 'VAPI' },
      { label: 'Voice synthesis', value: 'ElevenLabs · built-in VAPI voices' },
      { label: 'Telephony', value: 'Twilio · Telnyx' },
      { label: 'AI reasoning', value: 'OpenAI GPT-4o · Google Gemini' },
      { label: 'CRM integration', value: 'GoHighLevel · HubSpot · Airtable · Salesforce' },
      { label: 'Calendar', value: 'Calendly · Cal.com · Google Calendar · GoHighLevel calendar' },
    ],
    pricing: [
      { scope: 'Single-purpose agent', includes: 'One use case (booking, ordering, or qualification), one phone number, CRM log', timeline: '7-14 days', startingAt: '$1,500' },
      { scope: 'Multi-purpose agent', includes: '2-3 use cases, call routing, full CRM integration, SMS confirmation', timeline: '14-21 days', startingAt: '$2,500' },
      { scope: 'Full voice system', includes: 'Multiple agents, outbound + inbound, full reporting, human escalation', timeline: '21-35 days', startingAt: '$4,000' },
      { scope: 'Monthly management', includes: 'Monitoring, prompt updates, new call flows, performance reporting', timeline: 'Monthly', startingAt: '$500/mo' },
    ],
    proof: {
      heading: 'Proof: Salon Chain, USA',
      situation: 'A US salon chain could not answer every inbound call during peak hours. Staff were busy with clients. Missed calls meant missed bookings. After-hours calls went to voicemail, most were never returned.',
      built: 'An AI voice agent on VAPI that answers every inbound call, checks availability in real time, books appointments directly, and sends an SMS confirmation to the caller. Staff only see the confirmed booking in their calendar.',
      result: 'Zero missed bookings from unanswered calls. Staff removed from the booking call loop entirely. AI handles 100% of appointment calls. Human staff handles walk-ins and in-session clients only.',
      note: 'Client name withheld by NDA. Architecture and call recording available on request.',
    },
    faqs: [
      { q: 'How human does the voice actually sound?', a: 'Very. We use ElevenLabs or VAPI\'s best available voices. In internal testing with US clients, callers regularly do not identify the AI unless they ask directly. You can try it yourself with the live demo on this page.' },
      { q: 'What happens when the caller asks to speak to a human?', a: 'We build a transfer protocol into every agent. When a caller requests a human, the AI summarizes the conversation and routes to your team with context. If no one is available, it offers a callback or takes a message.' },
      { q: 'Can the agent handle accents and unclear speech?', a: 'Yes. Modern speech-to-text handles a wide range of accents and speech patterns. We test with your specific use case before launch and calibrate accordingly.' },
      { q: 'Is outbound calling legal in the US?', a: 'Outbound calling is legal for businesses with a prior relationship or expressed interest. For cold outbound, TCPA regulations apply and we brief you on compliance requirements before any outbound campaign is configured.' },
      { q: 'How do you update the agent\'s knowledge, for example, menu changes or new availability?', a: 'We build an update pipeline so you can change source data without touching the AI agent. Menu changes update automatically. Availability pulls live from your calendar system.' },
    ],
    cta: {
      headline: 'You just tried the demo. Now let us build one for your business.',
      body: 'Book a free 30-minute call. We will review your inbound call volume, identify the highest-impact use case, and walk you through what an AI voice agent would look like for your specific operation.',
      button: 'Book Free Voice Agent Audit',
    },
    relatedPosts: ['ai-chatbot-vs-voice-agent', 'what-is-ai-transformation-audit'],
  },
  {
    slug: 'internal-web-apps',
    homeCard: {
      icon: 'layers',
      problem: 'Teams outgrowing Google Sheets, losing data, fighting over versions',
      example: 'Replace a 12-tab spreadsheet with a role-based operations portal your whole team actually uses',
      price: '$3,000',
      whatItIs: 'A custom web app built around your exact workflow, replacing the fragile spreadsheet your team has outgrown.',
      bigStat: { value: '2 days', label: 'to onboard staff, down from two weeks' },
    },
    navLabel: 'Internal Web Apps',
    image: '/images/solutions/solution-internal-web-apps.png',
    metaTitle: 'Custom Internal Web Apps for US Businesses, Replace Google Sheets | AI Data House',
    metaDescription:
      'We build custom internal web apps that replace Google Sheets, give your team a real interface, and connect to your existing tools. Starting at $3,000. Free audit available.',
    whatItIs: 'It is a custom web app built around your exact workflow, replacing the fragile spreadsheet your team has outgrown.',
    bigStat: { value: '2 days', label: 'to onboard staff, down from two weeks' },
    hero: {
      headline: 'Your team is running a growing business out of a spreadsheet that was never meant to scale.',
      sub: 'We build lightweight internal web apps, custom-built around your exact workflow, that give your team a real interface, real access control, and real data without the spreadsheet chaos.',
      primaryCta: 'Book Free App Scoping Call',
      secondaryCta: 'See what we have built',
      trustRow: 'Delivered in 30-60 days · Role-based access · Built for your workflow · Starting at $3,000',
    },
    problem: {
      headline: 'A shared Google Sheet with 8 editors, 12 tabs, and no access control is not a system. It is a liability.',
      body: [
        'Google Sheets is a powerful tool. It is also where business operations go to quietly break down. When your team grows past a certain point, the spreadsheet stops being a solution and starts being the problem.',
        'You know you have outgrown the spreadsheet when two people edited the same row and one version was lost, a new hire had to be walked through the spreadsheet for three days, you cannot tell who changed what or when, and the "system" exists only in the head of the person who built it.',
      ],
      costs: [
        'Errors from manual entry and version conflicts',
        'Hours spent training staff on a tool that was not designed for them',
        'Inability to add logic, automation, or access rules to a flat file',
        'Zero audit trail when something goes wrong',
      ],
    },
    whoFor: {
      intro: 'This is the right solution if:',
      points: [
        'Your core operations run inside one or more Google Sheets or Excel files with multiple users',
        'You need different team members to see different data based on their role',
        'You want to add automation, triggers, or AI into an operational workflow that currently has none',
        'You are managing a client-facing process, onboarding, delivery, reporting, out of a spreadsheet',
        'You have a specific workflow that no off-the-shelf software quite fits',
      ],
      industries: 'Healthcare · Real estate · Agencies · Professional services · Operations teams · E-commerce back office',
    },
    workflowsHeading: 'How It Works: Four Real App Types',
    workflows: [
      {
        title: 'Operations Management Portal',
        body: 'A clean web interface that replaces the master spreadsheet your ops team lives in. Shows the right data to the right people. Includes role-based login, status boards, record creation and editing, notification triggers, and exportable reports, without overwriting each other\'s work.',
        tools: 'React · Supabase · role-based auth · n8n triggers',
      },
      {
        title: 'Client Onboarding Portal',
        body: 'A dedicated interface for collecting client information, managing document uploads, tracking onboarding stages, and notifying your team when action is needed. Client receives a branded link → logs in → fills intake form → uploads documents → sees their onboarding status → gets automated updates as stages complete.',
        tools: 'React · Supabase · file storage · automated email',
      },
      {
        title: 'Lead and Sales Tracking App',
        body: 'A lightweight CRM-style internal tool built for your specific pipeline, stages, and team, without the overhead of implementing Salesforce for a 10-person company. Includes lead intake, pipeline stages, owner assignment, activity log, follow-up reminders, and basic reporting.',
        tools: 'React · Postgres · custom pipeline logic',
      },
      {
        title: 'Healthcare or Compliance-Sensitive App',
        body: 'For businesses that handle data requiring access control, audit trails, or compliance documentation, clinics, legal firms, insurance agencies, financial services. Role-based access with audit log, secure form submission, document management, and integration with existing EHR or case management tools.',
        tools: 'React · Supabase · compliance-aware data handling · EHR API',
      },
    ],
    techStack: [
      { label: 'Frontend', value: 'React · TypeScript · Tailwind CSS' },
      { label: 'Backend / database', value: 'Supabase · Postgres · Firebase' },
      { label: 'Automation layer', value: 'n8n · Google Apps Script · custom APIs' },
      { label: 'Auth', value: 'Supabase Auth · custom role-based permissions' },
      { label: 'Hosting', value: 'Vercel · self-hosted Docker · client\'s own infrastructure' },
      { label: 'Integrations', value: 'Any tool with an API, HubSpot, Airtable, QuickBooks, Stripe, and more' },
    ],
    pricing: [
      { scope: 'Lightweight portal', includes: 'Single workflow, 2-3 views, basic auth, export', timeline: '14-21 days', startingAt: '$3,000' },
      { scope: 'Full internal app', includes: 'Multi-role access, 5-8 views, automation triggers, integrations', timeline: '30-45 days', startingAt: '$6,000' },
      { scope: 'Complex system', includes: 'Multiple modules, external integrations, AI features, reporting', timeline: '45-75 days', startingAt: '$10,000' },
      { scope: 'Ongoing dev retainer', includes: 'Feature additions, bug fixes, performance improvements', timeline: 'Monthly', startingAt: '$1,000/mo' },
    ],
    proof: {
      heading: 'Proof: Healthcare Web App, USA',
      situation: 'A US healthcare operation was managing patient intake, referral tracking, and staff task assignments across a multi-tab Google Sheet shared with 11 users. Data conflicts were weekly. There was no audit trail. New staff took two weeks to get up to speed.',
      built: 'A custom internal web portal with role-based login. Clinic admins see everything. Front desk staff see intake forms and scheduling. Referring providers see case status only. All data stored in a secure database with a full audit log.',
      result: 'Intake errors eliminated. Staff onboarding time cut from two weeks to two days. Management has a real-time view of every active case without asking anyone to pull a report.',
      note: 'Client name withheld by NDA. Clutch-verified engagement. Full architecture available on request.',
    },
    faqs: [
      { q: 'How is this different from just using an off-the-shelf tool like Airtable or Notion?', a: 'Off-the-shelf tools are built for the average workflow. We build for your specific workflow. When your process has unusual logic, compliance requirements, or integration needs that generic tools cannot handle cleanly, a custom app is faster and cheaper in the long run than years of duct-taped workarounds.' },
      { q: 'Do we own the code when you deliver it?', a: 'Yes. Everything we build belongs to you, the code, the database schema, the documentation. You are not dependent on us to keep the app running.' },
      { q: 'Can it connect to our existing tools?', a: 'Almost always. If your existing tool has an API, and most do, we can read from it, write to it, or trigger actions in it. We tell you up front if an integration has limitations.' },
      { q: 'How do we handle future feature requests?', a: 'We document the app architecture in detail at handoff. You can continue development with your own team, or we offer a monthly retainer for ongoing feature additions.' },
      { q: 'What if we are not sure whether we need a custom app or an off-the-shelf tool?', a: 'Book the free scoping call. We will review your current workflow and give you an honest recommendation, including if we think you should use an existing tool instead of a custom build.' },
    ],
    cta: {
      headline: 'Tell us what your team is running on a spreadsheet. We will tell you what an app would look like.',
      body: 'Book a free 30-minute scoping call. We will review your current workflow, sketch the right architecture, and give you a realistic scope, timeline, and cost estimate, before any work begins.',
      button: 'Book Free App Scoping Call',
    },
    relatedPosts: ['replace-google-sheets-web-app', 'what-to-automate-first-growing-business'],
  },
  {
    slug: 'crm-lead-automation',
    homeCard: {
      icon: 'target',
      problem: 'Manual lead entry, inconsistent follow-up, no visibility into pipeline health',
      example: 'Every lead from every channel flows into one CRM with the right owner, tags, and follow-up sequence',
      price: '$1,000',
      whatItIs: 'An automated lead engine that captures every lead, contacts it in under 90 seconds, and follows up on its own.',
      bigStat: { value: '<2 min', label: 'to first contact, down from hours' },
    },
    navLabel: 'CRM & Lead Automation',
    image: '/images/solutions/solution-crm-lead-automation.png',
    metaTitle: 'CRM and Lead Automation for US Businesses | AI Data House',
    metaDescription:
      'We automate your lead intake, CRM sync, follow-up sequences, and pipeline reporting so every lead is captured, qualified, and followed up, automatically. Starting at $1,000.',
    whatItIs: 'It is an automated lead engine that captures every lead, contacts it in under 90 seconds, and follows up on its own.',
    bigStat: { value: '<2 min', label: 'to first contact, down from hours' },
    hero: {
      headline: 'Most businesses do not have a lead problem. They have a follow-up problem.',
      sub: 'We automate the entire lead journey, from the moment a prospect contacts you to the moment they become a client, so your sales team focuses on closing, not chasing.',
      primaryCta: 'Book Free Lead Audit',
      secondaryCta: 'See a real lead flow',
      trustRow: 'Every lead captured · Automated follow-up · Pipeline visibility · Starting at $1,000',
    },
    problem: {
      headline: 'Leads are not falling through the cracks because your team is not trying hard enough.',
      body: [
        'They fall through because the process depends on someone remembering to do the next step. And memory is not a reliable system.',
        'Lead comes in from a Facebook ad at 7 PM. It lands in an email. Someone sees it in the morning. They copy it to a spreadsheet. They try to call at 11 AM, the lead has already spoken to two competitors.',
      ],
      costs: [
        'Leads from different channels land in different places and never get unified',
        'Speed-to-first-contact averages hours instead of seconds',
        'Follow-up sequences exist only as intentions, not as automated actions',
        'Pipeline health is only visible when someone manually builds a report',
        'CRM data is only as good as whoever updated it last',
      ],
    },
    whoFor: {
      intro: 'This is for your business if:',
      points: [
        'You receive leads from more than one source and they do not all end up in the same place automatically',
        'Your follow-up timing varies depending on who is working that day',
        'You cannot see the health of your pipeline without asking someone to pull data',
        'You have a CRM that your team uses inconsistently or avoids',
        'You are spending money on ads but not sure which campaigns actually generate clients',
      ],
      industries: 'Real estate · Mortgage and financial services · Insurance · Legal · Agencies · Healthcare · Coaching and consulting',
    },
    workflowsHeading: 'How It Works: Four Real Lead Automation Setups',
    workflows: [
      {
        title: 'Multi-Channel Lead Unification',
        body: 'Leads come in from your website, Facebook Ads, Google Ads, Upwork, referrals, and cold outreach. We build a single intake layer that captures every lead, regardless of source, and pushes it into one CRM pipeline with source tracking. One view of every lead. No lead lost because it came from the "wrong" channel.',
        tools: 'n8n · Make.com · Facebook Lead Ads API · Google Ads API · GoHighLevel · HubSpot · Webhooks',
      },
      {
        title: 'Speed-to-Lead Automation',
        body: 'The moment a lead submits a form: CRM entry created → lead assigned → WhatsApp/SMS sent → email sent → Slack notification to assigned rep → calendar link included. All within 90 seconds. Studies consistently show that leads contacted within 5 minutes convert at significantly higher rates than those contacted an hour later.',
        tools: 'n8n · GoHighLevel · Twilio · WhatsApp Business API · Gmail · Slack',
      },
      {
        title: 'Follow-Up Sequence Automation',
        body: 'Most leads do not convert on first contact. We build the multi-touch sequence that runs automatically based on lead behavior. Day 0: instant SMS + email. Day 1: personal follow-up. Day 3: value email. Day 5: SMS check-in. Day 7: final outreach. If the lead books a call, the sequence stops and switches to pre-call confirmation mode.',
        tools: 'GoHighLevel · HubSpot · ActiveCampaign · n8n · WhatsApp',
      },
      {
        title: 'Pipeline Reporting and Visibility',
        body: 'Live visibility into your pipeline without anyone pulling a report: leads by source, pipeline stage breakdown, average time in each stage, conversion rate per stage, follow-up compliance, and revenue forecast.',
        tools: 'GoHighLevel · HubSpot · Power BI · Looker Studio · Google Sheets + Apps Script',
      },
    ],
    techStack: [
      { label: 'CRM platforms', value: 'GoHighLevel · HubSpot · Salesforce · Pipedrive · Airtable · custom' },
      { label: 'Lead sources', value: 'Facebook Lead Ads · Google Ads · website forms · Typeform · Webflow · LinkedIn' },
      { label: 'Outreach', value: 'Twilio SMS · WhatsApp Business API · Gmail · ActiveCampaign · Mailchimp' },
      { label: 'Data enrichment', value: 'Snov.io · LinkedIn Sales Navigator · custom APIs' },
      { label: 'Automation backbone', value: 'n8n · Make.com · Zapier · Google Apps Script' },
      { label: 'Reporting', value: 'Power BI · Looker Studio · GoHighLevel reporting · custom dashboards' },
    ],
    pricing: [
      { scope: 'Single-channel setup', includes: 'One lead source to CRM, basic follow-up', timeline: '5-10 days', startingAt: '$1,000' },
      { scope: 'Multi-channel unification', includes: 'All lead sources unified, CRM sync, speed-to-lead automation', timeline: '14-21 days', startingAt: '$2,000' },
      { scope: 'Full lead system', includes: 'Multi-channel + full follow-up sequence + pipeline reporting', timeline: '21-35 days', startingAt: '$3,500' },
      { scope: 'Monthly optimization', includes: 'Sequence testing, pipeline reporting, new source integration', timeline: 'Monthly', startingAt: '$500/mo' },
    ],
    proof: {
      heading: 'Proof: HVAC Company, USA',
      situation: 'An HVAC company received leads from their website, Google Ads, and referrals. Each came in a different way. Follow-up depended on whoever noticed first. There was no pipeline visibility.',
      built: 'A unified lead intake layer that captures every lead source, pushes to GoHighLevel, assigns an owner, fires a follow-up within 90 seconds, and runs a 5-touch sequence. A live reporting dashboard shows pipeline health in real time.',
      result: 'Every lead captured from every source. Speed-to-first-contact dropped from hours to under 2 minutes. Management sees pipeline health live without asking anyone to build a report.',
      note: 'Client name withheld by NDA. Clutch-verified. Full architecture available on request.',
    },
    faqs: [
      { q: 'We already have a CRM. Can you automate around it?', a: 'Yes. We work with your existing CRM, we do not ask you to switch. If your CRM has an API (GoHighLevel, HubSpot, Salesforce, Pipedrive all do), we can automate intake, updates, sequences, and reporting on top of what you already have.' },
      { q: 'What if our leads come from sources you have not mentioned?', a: 'We have integrated with over 40 lead sources. If something exists with a form, an API, or a webhook, we can pull from it. We tell you upfront if something is not feasible.' },
      { q: 'How do you personalize automated follow-up without it feeling robotic?', a: 'By using the data the lead submitted. "Hi [Name], I saw you were looking for [service] in [city]" feels personal because it is accurate. We write the sequence copy as part of every project, not just the automation.' },
      { q: 'How long until we see ROI?', a: 'Most clients see faster lead response and reduced lead drop-off within the first week of going live. Conversion rate improvements typically show in the first 30 days of full data.' },
      { q: 'Can we A/B test sequences to see what converts better?', a: 'Yes, on most platforms. We build the infrastructure to support testing from day one, so you can optimize sequences based on real performance data over time.' },
    ],
    cta: {
      headline: 'Show us where your leads come in. We will show you where they are being lost.',
      body: 'Book a free 30-minute lead audit. We will map your current lead sources, follow-up process, and CRM setup, and show you exactly where automation would recover the most revenue.',
      button: 'Book Free Lead Audit',
    },
    relatedPosts: ['automate-lead-follow-up-system', 'real-cost-manual-work-automation-roi'],
  },
  {
    slug: 'data-dashboards-reporting',
    homeCard: {
      icon: 'bar-chart',
      problem: 'Business decisions made on last week\'s data, pulled together by hand',
      example: 'Live dashboard connecting CRM, ad platforms, and ops tools into one view your team uses daily',
      price: '$1,500',
      whatItIs: 'A live dashboard that pulls from all your tools into one real-time view, so no one builds a report by hand again.',
      bigStat: { value: '4 hrs/week', label: 'of manual reporting recovered' },
    },
    navLabel: 'Dashboards & Reporting',
    image: '/images/solutions/solution-dashboards.png',
    metaTitle: 'Business Dashboards and Reporting Automation for US Companies | AI Data House',
    metaDescription:
      'We build live business dashboards that replace manual reporting, connecting your CRM, ad platforms, and operations tools into one real-time view. Starting at $1,500.',
    whatItIs: 'It is a live dashboard that pulls from all your tools into one real-time view, so no one builds a report by hand again.',
    bigStat: { value: '4 hrs/week', label: 'of manual reporting recovered' },
    hero: {
      headline: 'Your business generates data all day. You should not have to spend hours turning it into a report.',
      sub: 'We build live dashboards that pull from your CRM, ad platforms, spreadsheets, and ops tools, so you see what is happening in your business in real time, without asking someone to build a report first.',
      primaryCta: 'Book Free Dashboard Audit',
      secondaryCta: 'See a dashboard example',
      trustRow: 'Real-time data · Zero manual reporting · Connected to your tools · Starting at $1,500',
    },
    problem: {
      headline: 'If your Monday morning starts with someone building a report, you are a week behind on every decision.',
      body: [
        'Manual reporting is one of the most expensive invisible costs in a growing business. Not because the reports are wrong, but because they take skilled time to build, they are outdated by the time they are shared, and they cannot answer follow-up questions without another cycle of pulling data.',
      ],
      costs: [
        'A skilled team member spending 3-4 hours every week on a task a system should do',
        'Decisions made on last week\'s data when today\'s data is already different',
        'Management asking "where are we?" and waiting a day for an answer',
        'No visibility into which channel, which rep, or which product is actually driving results',
      ],
    },
    whoFor: {
      intro: 'This is for your business if:',
      points: [
        'Someone on your team spends regular hours building reports that could update automatically',
        'You make business decisions based on data that is more than 24 hours old',
        'You have data in multiple tools, CRM, ad platforms, Shopify, QuickBooks, spreadsheets, and no single place to see it together',
        'Your team says "I\'ll have to check and get back to you" when asked basic performance questions',
        'You want to know which marketing channels, products, or reps are actually driving revenue',
      ],
      industries: 'Sales pipeline · Marketing performance · Operations SLA · Fulfillment and inventory · Financial summary · Lead source attribution · Team productivity',
    },
    workflowsHeading: 'How It Works: Four Real Dashboard Types',
    workflows: [
      {
        title: 'Sales and Revenue Dashboard',
        body: 'Pulls from your CRM and payment processor. Shows total pipeline value, leads this week by source, deals closed this month, average time to close, revenue by rep, and top performing lead sources, live, always current.',
        tools: 'GoHighLevel · HubSpot · Stripe · Power BI · Looker Studio · Google Sheets',
      },
      {
        title: 'Marketing Performance Dashboard',
        body: 'Pulls from your ad platforms, website analytics, and CRM. Shows spend by channel, cost per lead, cost per qualified lead, cost per closed deal, ROAS by campaign, and lead-to-close rate by source. Answers the question: "Which of our marketing channels is actually working?"',
        tools: 'Google Ads API · Facebook Ads API · GA4 · HubSpot · Power BI · Looker Studio',
      },
      {
        title: 'Operations and Fulfillment Dashboard',
        body: 'For teams that need visibility into operational performance: open jobs by status, SLA compliance rate, average resolution time, team capacity and assignment, overdue items flagged in real time, and weekly throughput.',
        tools: 'Airtable · Monday.com · Google Sheets · n8n · Power BI · custom build',
      },
      {
        title: 'E-commerce and Inventory Dashboard',
        body: 'Connects Shopify (or your platform) to inventory management, fulfillment, and finance. Shows revenue by product and channel, inventory levels vs. reorder thresholds, fulfillment rate and delay flags, return rate by product, and gross margin by SKU.',
        tools: 'Shopify · WooCommerce · Airtable · QuickBooks · Power BI · Google Sheets',
      },
    ],
    techStack: [
      { label: 'BI platforms', value: 'Power BI · Looker Studio (Google Data Studio)' },
      { label: 'Data sources', value: 'Any tool with an API, database, or export, Google Ads, Facebook Ads, Shopify, Stripe, QuickBooks, HubSpot, Salesforce, Airtable, Google Sheets, and more' },
      { label: 'Data pipeline', value: 'n8n · Python · Google Apps Script · custom ETL' },
      { label: 'Storage', value: 'Google Sheets · Supabase · BigQuery · Postgres' },
      { label: 'Embedding', value: 'Power BI embedded · Looker Studio shareable · custom React dashboard' },
    ],
    pricing: [
      { scope: 'Single-source dashboard', includes: 'One data source, standard views, scheduled refresh', timeline: '5-10 days', startingAt: '$1,500' },
      { scope: 'Multi-source dashboard', includes: '3-5 data sources unified, custom views, daily refresh', timeline: '10-21 days', startingAt: '$2,500' },
      { scope: 'Full reporting system', includes: 'All sources, automated refresh, drill-down views, alerts', timeline: '21-35 days', startingAt: '$4,000' },
      { scope: 'Monthly maintenance', includes: 'Data pipeline monitoring, new metrics, updates', timeline: 'Monthly', startingAt: '$500/mo' },
    ],
    proof: {
      heading: 'Proof: HVAC Company, USA',
      situation: 'A US HVAC company had a manager spending every Monday morning pulling data from three sources into an Excel template. The report was outdated the moment it was sent. Management had no visibility between Monday reports.',
      built: 'A Power BI dashboard connected directly to their CRM, field reporting system, and job management tool. Data refreshes automatically. Management sees live pipeline, job status, and team performance at any time without asking anyone to pull anything.',
      result: 'Monday report eliminated entirely. 4 hours of skilled manager time recovered every week. Business decisions now made on real-time data, not last week\'s snapshot.',
      note: 'Client name withheld by NDA. Clutch-verified. Full architecture available on request.',
    },
    faqs: [
      { q: 'We have data in many different places. Can you pull it all into one dashboard?', a: 'That is exactly what this service is for. If a tool has an API, a database connection, or an export format, we can pull from it. We have connected Power BI and Looker Studio to Google Ads, Facebook Ads, Shopify, QuickBooks, HubSpot, Salesforce, Airtable, Stripe, and many others. We tell you upfront if a specific connection has limitations.' },
      { q: 'How often does the data update?', a: 'It depends on the data source and your needs. We can configure dashboards to refresh hourly, daily, or in real time where the source supports it. Most business dashboards update daily, which is sufficient for 95% of use cases.' },
      { q: 'Will we need to maintain the dashboard ourselves?', a: 'No. We document everything and train your team to read and use the dashboard. For adding new metrics or connecting new sources, we offer a monthly retainer. You do not need a data engineer on staff.' },
      { q: 'Can we share the dashboard with clients?', a: 'Yes. We can configure dashboards as client-facing reports with appropriate data access controls. This is common for agencies that report on campaign performance to clients.' },
      { q: 'What if we want to add more metrics over time?', a: 'We build the data architecture to support expansion from day one. Adding a new metric typically means adding a data source connection and a new visual, not rebuilding from scratch.' },
    ],
    cta: {
      headline: 'Tell us what you are currently building manually every week. We will automate it.',
      body: 'Book a free 30-minute dashboard audit. We will review your current reporting process, identify where the data lives, and show you exactly what a live dashboard would replace.',
      button: 'Book Free Dashboard Audit',
    },
    relatedPosts: ['real-cost-manual-work-automation-roi', 'what-to-automate-first-growing-business'],
  },
];

export const SOLUTION_NAV = SOLUTIONS.map((s) => ({ label: s.navLabel, href: `/solutions/${s.slug}` }));

export function getSolution(slug?: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}

// Map legacy slugs → new canonical slugs (client-side redirect support)
export const LEGACY_SOLUTION_SLUGS: Record<string, string> = {
  'workflow-automation': 'ai-workflow-automation',
  'ai-calling-agents': 'ai-voice-agents',
  'ai-process-automation': 'internal-web-apps',
  'data-analytics': 'data-dashboards-reporting',
};
