// Full industry-page content. Source of truth: INDUSTRY_PAGES_COPY.md (2026-06-24).

export interface IndustryAutomation {
  title: string;
  replaces: string;
  does: string;
  sees?: string;
}

export interface IndustryContent {
  slug: string;
  navLabel: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  hero: { headline: string; sub: string; cta1: string; cta2: string };
  problem: { body: string[]; statHeading: string; statBody: string[] };
  after: string[];
  automationsHeading: string;
  automations: IndustryAutomation[];
  proof: string[];
  techStack: { fn: string; tool: string }[];
  pricing: { phase: string; built: string; timeline: string; investment: string }[];
  pricingNote?: string;
  faqs: { q: string; a: string }[];
  cta: { headline: string; sub: string; button: string; below?: string };
  healthcareNote?: string;
  // Condensed copy + icon key for the homepage industries grid. Single source of
  // truth so the homepage card and the detail page never drift apart.
  homeCard: { icon: string; blurb: string; badge?: string };
}

export const INDUSTRIES: IndustryContent[] = [
  {
    slug: 'real-estate',
    navLabel: 'Real Estate',
    image: '/images/industries/industry-real-estate.png',
    homeCard: {
      icon: 'building',
      blurb: 'Speed-to-lead is everything. We automate lead intake from every channel into your CRM, fire follow-up in under 2 minutes, and give agents a live dashboard so nothing falls through.',
    },
    metaTitle: 'AI Automation for Real Estate Teams | AI Data House',
    metaDescription:
      'Real estate teams lose deals to slow response times and manual follow-up. We build AI systems that respond in 90 seconds, qualify leads, and book showings automatically.',
    hero: {
      headline: 'Your Leads Are Going Cold While Your Team Is Doing Data Entry',
      sub: 'Real estate is a speed game. The agent who calls back in 5 minutes closes the deal. The one who calls back in 45 minutes leaves a voicemail. We build the systems that make your team the first to respond, every time, to every lead, at any hour.',
      cta1: 'Book a Free AI Audit',
      cta2: 'See How It Works',
    },
    problem: {
      body: [
        'You\'re spending money to generate leads. And then losing them to your own process.',
        'A new lead fills out a Zillow form at 7pm. Your team sees it the next morning. By then, that person has already talked to two other agents.',
        'Meanwhile, your team is manually entering that lead into the CRM, scheduling a showing via three emails, following up by hand, and building their weekly pipeline report by copying numbers between spreadsheets. None of that requires a real estate expert. All of it takes time away from the work that does.',
      ],
      statHeading: 'The numbers most real estate teams don\'t calculate',
      statBody: [
        'Leads contacted within 5 minutes convert at 21x the rate of leads contacted after 30 minutes. The average real estate team\'s response time: 47 minutes.',
        'For a team closing 6 deals per month at $8,000 average commission, improving response time alone can add 2-3 additional closings per month. That\'s $16,000, $24,000 in additional monthly revenue. From one change.',
      ],
    },
    after: [
      'A new lead comes in from Zillow at 8:47pm. In 90 seconds, the lead is in your CRM, tagged with source and property interest, assigned to the right agent based on territory, and has already received a personalized SMS. At 8:50pm, a follow-up email goes out with your agent\'s calendar link.',
      'Your morning team briefing is already in everyone\'s inbox when they wake up: leads from the last 24 hours, pipeline summary, showings booked, and which leads need a personal call today.',
      'When a lead books a showing, a confirmation fires automatically. A reminder fires 24 hours before. Your agent gets a pre-call prep note with everything the lead said in the AI chat. The team closes more deals because they\'re talking to more leads, and those leads are better prepared.',
    ],
    automationsHeading: 'The 5 Automations We Build for Real Estate',
    automations: [
      { title: 'Speed-to-Lead System', replaces: 'Manual CRM entry + delayed human follow-up.', does: 'Every lead from every source (Zillow, Facebook Lead Ads, website forms, Realtor.com) goes into one automation hub. In under 90 seconds: CRM record created, lead assigned by territory or round-robin, first SMS sent, follow-up email queued.', sees: 'A Slack notification with the full lead profile and a CRM link. Everything done. Just respond.' },
      { title: 'Lead Qualification Chatbot', replaces: 'Agents spending 20 minutes qualifying leads that aren\'t ready.', does: 'A chatbot on your website engages every visitor. It asks 4 targeted questions (timeline, budget range, property type, current situation). Qualified leads get a calendar link. Unqualified leads go into a nurture sequence. Agents only see leads that passed.', sees: 'A pre-qualified lead in their CRM with a qualification summary attached. They already know what they\'re walking into.' },
      { title: 'AI Receptionist for After-Hours Calls', replaces: 'Voicemails that never get called back. Missed leads after 6pm.', does: 'Your business number routes to an AI voice agent after hours (or 24/7). The agent answers, answers common questions (listing details, neighborhood info, appointment availability), and books showings directly in your calendar. Calls are logged, transcribed, and added to the CRM.', sees: 'The voice sounds like a professional assistant, not a phone tree.' },
      { title: 'Follow-Up Sequence Automation', replaces: 'Agents remembering (or forgetting) to follow up.', does: 'Every lead enters a conditional sequence. Day 0: first contact. Day 2: check-in SMS. Day 5: value email with market insights. Day 10: final reach-out. The sequence stops the moment the lead responds or books.', sees: 'No lead gets forgotten. No agent has to remember. The system runs 24/7.' },
      { title: 'Daily Pipeline Report', replaces: 'Manually pulling pipeline data and building a Monday morning report.', does: 'Every Sunday evening, an automated report compiles: new leads this week, leads by stage, upcoming showings, deals at risk (leads not contacted in 5+ days), and team performance. Delivered to your inbox before the week starts.', sees: 'What it takes to run: zero. It runs itself.' },
    ],
    proof: [
      'A real estate team running 4 agents and generating 200+ leads per month came to us spending 18 hours/week combined on manual CRM entry, scheduling, and follow-up.',
      'We built speed-to-lead + follow-up automation in 3 weeks. Response time dropped from 47 minutes to 90 seconds. 8 of those 18 hours came back in the first month. Two deals in month one were directly attributed to leads that would have previously gone cold overnight.',
    ],
    techStack: [
      { fn: 'Lead capture + routing', tool: 'n8n or Make.com' },
      { fn: 'CRM', tool: 'GoHighLevel (recommended for real estate) or HubSpot' },
      { fn: 'SMS', tool: 'Twilio or GoHighLevel built-in' },
      { fn: 'AI chatbot', tool: 'Botpress or custom build' },
      { fn: 'AI voice agent', tool: 'VAPI + ElevenLabs' },
      { fn: 'Calendar', tool: 'Calendly or Cal.com' },
      { fn: 'Reporting', tool: 'Looker Studio or Power BI' },
    ],
    pricing: [
      { phase: 'Phase 1: Speed-to-Lead', built: 'Lead capture, CRM entry, first contact, follow-up sequence', timeline: '1-2 weeks', investment: '$1,000, $2,000' },
      { phase: 'Phase 2: Qualification', built: 'AI chatbot for website lead qualification', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
      { phase: 'Phase 3: Voice + Booking', built: 'AI voice agent for after-hours calls and appointment booking', timeline: '2-3 weeks', investment: '$1,500, $3,000' },
      { phase: 'Phase 4: Reporting', built: 'Automated pipeline report and dashboard', timeline: '1-2 weeks', investment: '$1,000, $1,500' },
    ],
    pricingNote: 'All phases include: scoping call, build, testing, handoff documentation, 30-day support.',
    faqs: [
      { q: 'Can the AI voice agent really sound natural enough for real estate clients?', a: 'Modern AI voice (VAPI + ElevenLabs) has latency under 600 milliseconds and voice quality indistinguishable from a human assistant in most real conversations. We build and test with real US accents and include edge-case handling. We also offer a live demo, you can hear it before you commit.' },
      { q: 'We use Follow Up Boss / Chime / kvCore. Do you integrate with those?', a: 'Most CRMs have APIs we can connect to. We\'ve worked with GoHighLevel, HubSpot, Pipedrive, and Airtable. For niche real estate CRMs, we evaluate the API documentation in the scoping call. If there\'s no API, we build around the limitation.' },
      { q: 'What happens to my leads when the automation fails?', a: 'Every automation we build includes error handling and alert notifications. If a step fails, we get notified immediately and the lead is flagged for manual follow-up. We also set up a redundant SMS alert to your team for any automation error.' },
      { q: 'My agents are resistant to "AI taking over." How do we handle this?', a: 'The systems we build don\'t replace agents, they remove the tasks agents hate (data entry, scheduling emails, manual follow-up) so they can do more of the work they\'re actually good at (conversations and closes). In every team we\'ve worked with, the adoption resistance disappears within 2-3 weeks once the team sees what they get back.' },
    ],
    cta: {
      headline: 'Ready to Stop Losing Leads to Response Time?',
      sub: 'Book a free 30-minute AI Audit. We\'ll map your current lead process and show you exactly what to build first and what it costs.',
      button: 'Book Free Audit',
      below: 'We\'ve worked with real estate teams across the US. We understand lead volume, territory routing, and what agents actually need, not just what looks good in a demo.',
    },
  },
  {
    slug: 'ecommerce',
    homeCard: {
      icon: 'shopping-bag',
      blurb: 'Orders, inventory, fulfillment, and support on autopilot. We connect your Shopify store to your ops team without anyone touching a spreadsheet.',
    },
    navLabel: 'E-Commerce',
    image: '/images/industries/industry-ecommerce.png',
    metaTitle: 'AI Automation for E-Commerce Businesses | AI Data House',
    metaDescription:
      'Connect your Shopify store, fulfillment, inventory, and customer support into one automated system. Stop doing manually what your data can do for you.',
    hero: {
      headline: 'Your Shopify Store Is Running. Your Operations Aren\'t.',
      sub: 'E-commerce growth creates an operations problem. More orders means more manual steps. More products means more inventory chaos. More customers means more support tickets. We build the systems that make your backend scale as fast as your ads do.',
      cta1: 'Book a Free AI Audit',
      cta2: 'See What We Build',
    },
    problem: {
      body: [
        'You built a Shopify store. You got the ads working. The orders are coming in.',
        'And now someone on your team is manually checking inventory every morning. Someone else is copying tracking numbers from your 3PL into Shopify. Your customer support inbox has 140 unread messages, 90 of which ask "where is my order?" And your reporting involves exporting three CSVs and pasting them into a Google Sheet every Monday.',
        'Every one of those tasks is executing a rule that doesn\'t require a human.',
      ],
      statHeading: 'What the manual ops tax actually costs',
      statBody: [
        'A 6-person e-commerce team spending 3 hours each per week on manual order processing, inventory updates, and customer support is burning 18 team-hours per week. At $20/hour average: $18,720/year in labor on tasks automation handles in seconds.',
        'That\'s before accounting for the errors. A mis-ship costs an average of $12, $45 in reshipment plus a damaged customer relationship. A stock-out on a high-velocity SKU that nobody caught in time costs the revenue from every order that bounces during the out-of-stock window.',
      ],
    },
    after: [
      'A new order comes in at 2am. By 2:01am: inventory decremented, fulfillment team notified, picking task created, customer confirmation sent. By the time your warehouse opens at 8am, there\'s a clean queue of orders to process with everything they need already in the system.',
      'When the tracking number is entered by the fulfillment team, Shopify updates automatically. The customer gets a shipping notification with real tracking, no manual step.',
      'When a customer emails "where is my order," the AI support agent checks order status, retrieves the tracking number, and responds with accurate delivery information in 45 seconds. No human involved.',
      'Every Monday morning, your dashboard shows: revenue by channel, top products by margin, inventory risk (SKUs below reorder threshold), and return rate by product. You didn\'t build it. It built itself from your data.',
    ],
    automationsHeading: 'The 5 Automations We Build for E-Commerce',
    automations: [
      { title: 'Order-to-Fulfillment Pipeline', replaces: 'Manual order communication between your store and fulfillment team.', does: 'Shopify webhook fires on every paid order. Automation checks inventory. Fulfillment task created with order details, SKUs, and shipping priority. Warehouse team notified. When tracking is entered, Shopify updates and customer notification fires.', sees: 'Zero manual steps between order and customer notification.' },
      { title: 'Inventory Intelligence System', replaces: 'Someone checking inventory levels every morning and sending emails.', does: 'Daily inventory sweep runs automatically. Any SKU below your reorder threshold triggers a Slack alert with: SKU, current stock, average daily velocity, and days until stockout at current velocity.', sees: 'You stop running out of your best products.' },
      { title: 'AI Customer Support Agent', replaces: 'Your team answering 80-100 repetitive customer questions per week.', does: 'A trained AI support agent handles the questions that follow a rule: order status, return policy, shipping timeline, product compatibility, discount codes. It checks live order data to give accurate answers. For anything outside its scope, it escalates with full context.', sees: 'Your support team handles 20% of the volume they used to. The other 80% never reaches them.' },
      { title: 'Returns and Refunds Automation', replaces: 'Manual return request processing, email back-and-forth, and refund initiation.', does: 'Customer submits return request. System checks: is the order within return window? Is the reason valid per your policy? If yes, return label generated and emailed, refund initiated in Shopify (or queued for approval if above threshold). Customer notified. All logged.', sees: 'Your team handles edge cases, exceptions, large-value refund approvals.' },
      { title: 'Multi-Channel Analytics Dashboard', replaces: 'Weekly export-paste-format reporting ritual.', does: 'Looker Studio dashboard pulls from Shopify, Google Ads, Facebook Ads, and email platform automatically. Refreshes daily. Shows: revenue by channel, ROAS by campaign, top products by margin, return rates, new vs returning customer split.', sees: 'Your Monday morning starts with already-built clarity, not an hour of spreadsheet work.' },
    ],
    proof: [
      'An e-commerce brand selling on Shopify and Amazon (120 orders/day average) was spending 22 hours/week combined on order communication, inventory updates, and customer support.',
      'We built the order-to-fulfillment pipeline, inventory intelligence, and an AI support agent in 5 weeks. Order processing errors dropped to zero. Customer support volume handled by humans dropped 71%. The team reclaimed 18 of those 22 weekly hours. The brand scaled from 120 to 200 orders/day three months later without adding headcount.',
    ],
    techStack: [
      { fn: 'Order automation', tool: 'n8n + Shopify API' },
      { fn: 'Inventory management', tool: 'Airtable or Google Sheets (or WMS API)' },
      { fn: 'Customer support AI', tool: 'Botpress + OpenAI' },
      { fn: 'Customer notifications', tool: 'Shopify native + Klaviyo' },
      { fn: 'Returns processing', tool: 'Shopify API + Google Apps Script' },
      { fn: 'Analytics dashboard', tool: 'Looker Studio + Supermetrics' },
      { fn: 'Error alerting', tool: 'Slack + n8n' },
    ],
    pricing: [
      { phase: 'Phase 1: Order Operations', built: 'Order-to-fulfillment + customer notifications', timeline: '1-2 weeks', investment: '$1,000, $2,000' },
      { phase: 'Phase 2: Inventory', built: 'Inventory intelligence + low-stock alerts', timeline: '1-2 weeks', investment: '$800, $1,500' },
      { phase: 'Phase 3: Customer Support', built: 'AI support agent (FAQ + order status)', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
      { phase: 'Phase 4: Analytics', built: 'Multi-channel dashboard', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
    ],
    faqs: [
      { q: 'We\'re on Shopify. Will this work without changes to our store?', a: 'Yes. We connect via Shopify\'s webhook and API, no changes to your storefront. You don\'t need a developer on your end. We handle all the integration work.' },
      { q: 'Our fulfillment is handled by a 3PL. Can you connect to their system?', a: 'Depends on the 3PL. Most major 3PLs (ShipBob, ShipStation, etc.) have APIs we can connect to. For 3PLs with no API, we typically work around it using email parsing or a shared spreadsheet that both systems read from.' },
      { q: 'The AI customer support agent, what happens if it gives a wrong answer?', a: 'We build confidence thresholds into every AI agent. If the agent\'s confidence in a response is below a defined threshold, it escalates to a human instead of answering. You set the threshold. We also build a review mechanism so you can see all AI responses and flag training issues.' },
      { q: 'We have a seasonal business. Will the automation cost more during peak season?', a: 'Tool costs scale with volume (VAPI is per-minute; Make.com is per-operation), but these are typically small relative to the build cost. We\'ll give you a full breakdown of ongoing costs at the scoping stage so you can plan for seasonality.' },
    ],
    cta: {
      headline: 'Your Orders Shouldn\'t Require This Many Hands',
      sub: 'Book a free 30-minute AI Audit. We\'ll map your current order-to-delivery workflow and tell you exactly what to automate first.',
      button: 'Book Free Audit',
    },
  },
  {
    slug: 'agencies',
    homeCard: {
      icon: 'users',
      blurb: 'Your clients expect reporting. Your team dreads building it. We automate client dashboards, lead routing, and campaign reporting so you deliver more without hiring more.',
    },
    navLabel: 'Marketing Agencies',
    image: '/images/industries/industry-agencies.png',
    metaTitle: 'AI Automation for Marketing Agencies | AI Data House',
    metaDescription:
      'Automate client reporting, lead routing, onboarding, and proposal generation. Stop spending Fridays on tasks that should run themselves.',
    hero: {
      headline: 'Your Agency Is Growing. Your Team Is Drowning in Admin Work.',
      sub: 'Every client you add means more reports to build, more onboarding emails to send, more status updates to give, and more time your team can\'t spend doing the actual work they were hired for. We build the systems that handle the repetitive half of agency operations, so the creative and strategic half can scale.',
      cta1: 'Book a Free AI Audit',
      cta2: 'See the Agency Playbook',
    },
    problem: {
      body: [
        'Agency margins get squeezed from both directions.',
        'On one side: clients want more for less. On the other: your team is spending 30-40% of their time on work that doesn\'t require expertise, status updates, reporting, onboarding emails, CRM entry, proposal formatting.',
        'That\'s not a talent problem. It\'s an operations problem.',
      ],
      statHeading: 'What the agency admin tax actually costs',
      statBody: [
        'An agency with 8 team members, each spending 12 hours/week on non-billable admin tasks, is burning 96 hours per week on work that doesn\'t move a client forward. At $35 blended hour cost: $174,720/year.',
        'That is not a small number. And every hour of that time is time that could be going into client work, new business development, or margin.',
      ],
    },
    after: [
      'A new client signs. Within 10 minutes: a welcome email is sent with onboarding instructions, a project workspace is created in your PM tool, the client gets access to their reporting dashboard, the account team is introduced via email, and the first task list is created. Your team doesn\'t touch any of that.',
      'Every Monday, every client gets their weekly report, automatically pulled, formatted, and delivered. No one spent Friday afternoon on it.',
      'When a lead comes in from the website, it\'s in the CRM, tagged with source and service interest, and the right team member is notified with a brief, before anyone manually checks the inbox.',
    ],
    automationsHeading: 'The 5 Automations We Build for Agencies',
    automations: [
      { title: 'Automated Client Reporting', replaces: 'The Friday afternoon reporting ritual. Exports. CSV pastes. Manual formatting.', does: 'All data sources (Google Ads, Facebook, LinkedIn, GA4, HubSpot) connect to a Looker Studio or Power BI dashboard. Reports are auto-generated on your schedule and emailed to each client with their specific metrics. Branded, accurate, on time, with zero manual steps.', sees: 'What your team does instead of building reports: review them. Then use the extra time.' },
      { title: 'New Client Onboarding Automation', replaces: 'The onboarding email thread. The "did you get access?" follow-up. The manually created project workspace.', does: 'Deal closes in CRM → onboarding flow triggers → welcome email sent → project workspace created in ClickUp/Asana/Notion → client portal access granted → account team introduced → intake form sent → follow-up scheduled for Day 3 and Day 7.', sees: 'Every client gets the same quality onboarding experience regardless of which team member manages them.' },
      { title: 'Lead Routing + Follow-Up', replaces: 'Inbound leads sitting in a shared inbox waiting for someone to notice them.', does: 'Lead fills out your contact form → CRM record created → tagged by service interest and budget range → assigned to the right team member → first-touch email sent within 5 minutes → follow-up sequence begins.', sees: 'By the time your team sees a new lead, it\'s already in the CRM with context and has already been contacted.' },
      { title: 'Proposal Generation Automation', replaces: 'Starting a proposal from scratch for every new prospect.', does: 'After the discovery call, a brief internal form captures scope, service, budget, and timeline. The system auto-generates a proposal document populated with the client\'s name, the scoped services, pricing tiers, and case studies relevant to their industry.', sees: 'Proposal time drops from 3-4 hours to 30-45 minutes.' },
      { title: 'Client Health Monitoring', replaces: 'Not knowing a client is unhappy until they cancel.', does: 'Automated monthly check-in emails to all active clients. Response analysis flags unhappy signals. Any client that hasn\'t opened their last 3 reports gets flagged for a proactive call. Account manager gets a Slack notification.', sees: 'You stop being surprised by cancellations.' },
    ],
    proof: [
      'An 11-person digital marketing agency managing 26 retainer clients was spending 14 hours per week across the team on manual reporting. That\'s one full-time employee\'s worth of time, every week, building reports that should build themselves.',
      'We connected their ad platforms to a Looker Studio reporting system with automated delivery. Week one after launch: every report sent on schedule without a human touching it. The team used the reclaimed 14 hours for new business development. The agency added 3 new clients in the following 6 weeks.',
    ],
    techStack: [
      { fn: 'Reporting', tool: 'Looker Studio + Supermetrics / Power BI' },
      { fn: 'CRM + lead routing', tool: 'HubSpot or GoHighLevel' },
      { fn: 'Project management', tool: 'ClickUp, Asana, or Notion API' },
      { fn: 'Proposal generation', tool: 'Google Docs API + Apps Script' },
      { fn: 'Automation backbone', tool: 'n8n or Make.com' },
      { fn: 'Client health', tool: 'CRM + Slack alerts' },
    ],
    pricing: [
      { phase: 'Phase 1: Reporting', built: 'Automated multi-client reporting system', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
      { phase: 'Phase 2: Lead Routing', built: 'Inbound lead routing + follow-up sequence', timeline: '1-2 weeks', investment: '$1,000, $2,000' },
      { phase: 'Phase 3: Onboarding', built: 'New client onboarding automation', timeline: '1-2 weeks', investment: '$1,000, $1,500' },
      { phase: 'Phase 4: Proposals', built: 'Proposal generation from intake form', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
    ],
    faqs: [
      { q: 'We have 20+ clients with different reporting needs. Can the system handle custom metrics per client?', a: 'Yes. The most common setup: a master data model where each client\'s metrics are templated, with customizable KPI targets per client. Each client gets a report that looks like it was built for them specifically, because the template is parameterized, not copied.' },
      { q: 'We use ClickUp for project management. Can the onboarding automation integrate with it?', a: 'Yes, ClickUp has a solid API. We can create workspaces, add tasks, assign team members, and set due dates automatically. Same for Asana and Notion.' },
      { q: 'Our team is skeptical about AI generating proposals. Will they use this?', a: 'The automation doesn\'t replace the human, it builds the draft. Your team still reviews, customizes, and approves before it goes to the client. Most teams adopt it fully within 2 proposals because the time savings are immediate and obvious.' },
      { q: 'What if a client doesn\'t want to receive automated reports?', a: 'The system supports a manual delivery mode for specific clients, the report is generated automatically but held for team review and manual send. You get the time savings on the data pull and formatting; the human still presses send.' },
    ],
    cta: {
      headline: 'Your Team Didn\'t Become Agency Professionals to Build Reports on Friday Afternoons',
      sub: 'Book a free 30-minute audit. We\'ll identify the top 2 hours-per-week drains in your agency operations and tell you what to build first.',
      button: 'Book Free Audit',
    },
  },
  {
    slug: 'restaurants',
    homeCard: {
      icon: 'utensils',
      blurb: 'Every missed call is a missed reservation or order. Our AI voice agents answer every call, take orders, book tables, and hand off to staff only when needed.',
    },
    navLabel: 'Restaurants',
    image: '/images/industries/industry-restaurants.png',
    metaTitle: 'AI Automation for Restaurants | AI Data House',
    metaDescription:
      'AI voice agents, reservation bots, and order automation for restaurants. Stop losing customers to missed calls and understaffed front desks.',
    hero: {
      headline: 'Every Missed Call Is a Table That Didn\'t Get Filled',
      sub: 'Your kitchen can\'t run without a full dining room. But your phone keeps ringing during dinner service, your host is juggling three things at once, and voicemails pile up until it\'s too late to call back. We build the AI systems that answer every call, take every reservation, and answer every question, so your staff can focus on the room in front of them.',
      cta1: 'Book a Free AI Audit',
      cta2: 'Hear the AI Voice Demo',
    },
    problem: {
      body: [
        'Restaurants run on thin margins and full rooms.',
        'The front of house is the bridge between your marketing spend and your revenue. And right now, a significant portion of people trying to reach you aren\'t getting through.',
        'During peak hours, calls go unanswered. After hours, voicemails pile up and go unreturned until the next morning, by which point the customer has already booked somewhere else or walked in to a competitor.',
      ],
      statHeading: 'The math most restaurants don\'t run',
      statBody: [
        'A restaurant missing 8 calls per day, each representing one table of 2.5 guests at $45 average spend: 8 calls × $112.50 = $900/day missed. $900 × 300 operating days = $270,000/year in revenue walking out the door through a ringing phone.',
        'Even at a 30% answer rate for those missed calls, that\'s $81,000/year recovered by answering the phone.',
      ],
    },
    after: [
      'Your phone number is answered by a natural-sounding AI voice assistant, 24 hours a day, 7 days a week.',
      'A customer calls at 9:30pm on a Thursday to book for Saturday night. The AI assistant greets them with your restaurant\'s name, asks how many guests, checks your live availability in OpenTable or Resy, confirms a time, takes the name and phone number, and books the reservation, all while your host is seating a party.',
      'A customer calls to ask if you\'re open on Christmas. The AI answers accurately. A customer calls to ask if you have gluten-free options. The AI answers from your menu knowledge. A customer calls to modify their 7pm reservation to 7:30pm. The AI makes the change in your system and confirms it.',
      'Your host handles the room. The AI handles the phone. No voicemails. No missed tables.',
    ],
    automationsHeading: 'The 5 Automations We Build for Restaurants',
    automations: [
      { title: 'AI Voice Receptionist (24/7)', replaces: 'Missed calls. Voicemails. Distracted front-of-house staff answering routine calls during service.', does: 'Your phone number routes to a VAPI AI voice agent that answers every call within one ring. The agent knows your restaurant\'s name, hours, address, menu highlights, dietary options, and special events. It handles reservations, modifications, and cancellations in your booking system in real time.', sees: 'The voice: natural, warm, professional. We choose the voice profile in your brand review call.' },
      { title: 'Online Reservation + Waitlist Bot', replaces: 'Manually managing a waitlist and responding to reservation inquiries via email or DM.', does: 'A chat widget on your website handles reservation requests. It checks availability in real time, books confirmed reservations, and adds customers to a waitlist with automatic notification when a table opens. If someone contacts you on Instagram about a table, the same bot handles it.' },
      { title: 'Reservation Reminder + Confirmation System', replaces: 'No-shows. Guests who forgot. The host calling down the list at 5pm.', does: 'Reservations trigger an automatic confirmation text immediately upon booking. A reminder text fires 24 hours before and 2 hours before. The guest can confirm or cancel via text reply. Cancellations immediately open the slot for new bookings.', sees: 'No-show rate reduction: typically 30-50%.' },
      { title: 'Review Request Automation', replaces: 'Hoping customers leave reviews. Never asking.', does: 'Reservation checkout triggers a text 2 hours after the reservation time: "Hope you enjoyed your visit at [Restaurant]. Mind leaving us a review? [Google Review link]" Simple. Timed right. Personalized.', sees: 'Review volume typically doubles in the first 60 days.' },
      { title: 'Event and Special Occasion Automation', replaces: 'Manually handling birthday, anniversary, and large-party inquiries.', does: 'Special occasion requests trigger a separate flow. The AI captures party size, date, and occasion, then routes to your events coordinator with all details. Confirmation email goes to the guest with a deposit link if applicable.' },
    ],
    proof: [
      'A restaurant in the US (fine dining, 80 covers) was missing an estimated 15-20 calls per day during dinner service. An AI voice agent was deployed to handle all inbound calls after 5pm and on weekends.',
      'In the first 30 days: 440 calls handled without human intervention. 127 reservations booked directly through the AI. Average answer time: 1 ring. Estimated revenue recovered from previously missed reservations: $14,000 in the first month. The host now focuses entirely on the guests in front of them.',
    ],
    techStack: [
      { fn: 'AI voice agent', tool: 'VAPI + ElevenLabs' },
      { fn: 'Reservation booking', tool: 'OpenTable API, Resy API, or SevenRooms' },
      { fn: 'SMS (reminders + review requests)', tool: 'Twilio' },
      { fn: 'Chat widget', tool: 'Botpress or custom build' },
      { fn: 'Automation backbone', tool: 'n8n' },
      { fn: 'Event requests', tool: 'n8n → email + Airtable' },
    ],
    pricing: [
      { phase: 'Phase 1: Voice Agent', built: 'AI receptionist for calls (hours, reservations, FAQ)', timeline: '1-2 weeks', investment: '$1,500, $2,500' },
      { phase: 'Phase 2: Confirmations', built: 'Reservation reminders + no-show reduction system', timeline: '1 week', investment: '$500, $800' },
      { phase: 'Phase 3: Reviews', built: 'Automated review request sequence', timeline: '3-5 days', investment: '$400, $700' },
      { phase: 'Phase 4: Chat + Events', built: 'Website chat widget + event inquiry routing', timeline: '1-2 weeks', investment: '$1,000, $1,800' },
    ],
    pricingNote: 'Monthly operating cost (after build): $60, $120 (VAPI + Twilio at average restaurant volume).',
    faqs: [
      { q: 'Will customers know they\'re talking to an AI?', a: 'We recommend transparent AI (the agent says it\'s an AI assistant for your restaurant in the first sentence). This is increasingly the standard and customers respond well when the agent is helpful and the experience is smooth. We test extensively for this.' },
      { q: 'What if a customer asks a question the AI doesn\'t know how to answer?', a: 'We build a knowledge base during onboarding, your hours, menu, dietary options, parking, etc. For questions outside the knowledge base, the agent offers to transfer to a human or take a message. Nothing is left unanswered.' },
      { q: 'We use OpenTable. Can the AI book directly into our calendar?', a: 'Yes. OpenTable has an API we connect to for real-time availability checking and booking creation. Same for Resy and SevenRooms.' },
      { q: 'What about multilingual customers? We have Spanish-speaking regulars.', a: 'VAPI supports multilingual agents. We can configure a secondary language (Spanish being the most common) that activates when the caller speaks Spanish. This is a configuration decision we make during the scoping call.' },
    ],
    cta: {
      headline: 'Your Phone Should Never Ring Unanswered Again',
      sub: 'Book a free 30-minute AI Audit. We\'ll map your missed-call volume and tell you exactly what the AI voice agent would handle, and what it would cost.',
      button: 'Book Free Audit',
      below: 'Want to hear what the AI receptionist sounds like first? Go to our AI Voice Agents page and try the live demo.',
    },
  },
  {
    slug: 'professional-services',
    homeCard: {
      icon: 'briefcase',
      blurb: 'Client onboarding, document collection, invoicing, and follow-up automated so your team focuses on delivery, not administration.',
    },
    navLabel: 'Professional Services',
    image: '/images/industries/industry-professional-services.png',
    metaTitle: 'AI Automation for Professional Services | AI Data House',
    metaDescription:
      'Law firms, consultants, financial advisors, and healthcare practices: automate intake, scheduling, follow-up, and reporting without replacing the human relationship.',
    hero: {
      headline: 'You Built a Practice on Expert Judgment. You Shouldn\'t Be Spending Half Your Day on Admin Work.',
      sub: 'Law firms, consultancies, healthcare practices, financial advisors, you deliver expertise. The value is in the meeting, the analysis, the advice. Not in the intake form, the appointment reminder, the follow-up email, or the status report. We automate everything between the first inquiry and the professional conversation, so you can spend all your time on the conversation.',
      cta1: 'Book a Free AI Audit',
      cta2: 'See What We Build',
    },
    problem: {
      body: [
        'Professional services firms share the same operations problem regardless of specialty.',
        'New client inquiries come in inconsistently. Follow-up depends on who checks the inbox that day. Intake takes 2-3 emails or a phone call. Scheduling requires back-and-forth. Reminders are manual. Status updates to clients depend on someone remembering. Reports are built by hand.',
        'All of that happens before the expert ever starts delivering value.',
      ],
      statHeading: 'The cost of admin-heavy professional practices',
      statBody: [
        'A consultant billing at $250/hour and spending 15 hours/week on non-billable admin: 15 hours × $250 = $3,750/week not billed. $3,750 × 50 weeks = $187,500/year in unbillable time.',
        'That\'s not a fee rate problem. That\'s an operations problem. Even if only 5 of those 15 hours are automatable, you\'ve recovered $65,000/year.',
      ],
    },
    after: [
      'A prospective client fills out your contact form at 10pm. By 10:01pm, they\'ve received a warm acknowledgment email from your practice, a link to your intake form, and a calendar link to book an initial consultation.',
      'By the time you open your inbox the next morning, the prospect has already completed intake, reviewed your onboarding materials, and booked their consultation slot. You walk into the meeting with their information pre-read and context in hand.',
      'After the meeting, a follow-up email with next steps fires automatically. A proposal generates from the meeting notes. A reminder fires for the client 48 hours before any deliverable is due. Nothing falls through the cracks. The professional relationship is enhanced, not replaced, because you show up prepared instead of catching up.',
    ],
    automationsHeading: 'The 5 Automations We Build for Professional Services',
    automations: [
      { title: 'Client Intake Automation', replaces: 'The intake phone call. The email chain. "Can you send me X, Y, and Z before our first meeting?"', does: 'Inquiry received → automated acknowledgment with intake form link → intake form completed by client → form data pulled into CRM and case/project record → attorney/consultant/advisor notified with intake summary. For healthcare: intake includes medical history forms, insurance information, and consent documents.', sees: 'By the time you open the inbox: the intake is done, the file is started, and the client is already moving through your process.' },
      { title: 'Appointment Booking + Reminder System', replaces: 'The scheduling back-and-forth. The manual calendar invite. The reminder call.', does: 'Every new prospect or client gets a direct calendar link with your availability. When they book: confirmation fires instantly, intake form sends, a 48-hour reminder sends, and a 2-hour reminder sends. Each reminder includes preparation instructions specific to the meeting type.', sees: 'No-show reduction: 40-60% in most practices.' },
      { title: 'Follow-Up + Status Communication Automation', replaces: 'The "checking in" emails. The client calling to ask for a status update.', does: 'Every client engagement has defined stages. When a stage changes (proposal sent, in review, approved, in progress, completed), a pre-written, branded status update fires to the client. For law firms: "Your matter has been filed" triggers an automatic notification with the filed document attached.', sees: 'No one has to remember to send it. No client has to call to ask.' },
      { title: 'AI Chatbot for Website Inquiries (After Hours)', replaces: 'Inquiries going into a contact form and sitting untouched until Monday morning.', does: 'A chatbot engages visitors in real time. It answers common questions (Do you handle X? What\'s your fee structure? Are you taking new clients?), qualifies the inquiry, and routes to your CRM or books a consultation directly. High-value inquiries get flagged for priority response.' },
      { title: 'Client Reporting + Billing Summaries', replaces: 'The monthly billable hours report that someone builds by hand from a timesheet export.', does: 'Your time-tracking tool (Harvest, Toggl, Clio) connects to an automated report that compiles: total hours by matter, billable vs. non-billable breakdown, key milestones reached this period, next steps, and outstanding invoice status. Sent on the same day every month.', sees: 'Clients feel informed. You look organized. The billing conversation is easier.' },
    ],
    proof: [
      'A 4-attorney law firm was spending an estimated 11 hours/week collectively on intake calls, scheduling, status emails, and billing summary preparation.',
      'We built an intake automation and appointment system in 2 weeks. Intake moved entirely online. Scheduling back-and-forth dropped to zero for new clients. Status emails are now automated at each matter milestone.',
      'In the first 60 days: the 11 hours/week came back. Two of the attorneys used it to take on additional client matters. The firm\'s monthly revenue increased by 14%.',
    ],
    techStack: [
      { fn: 'Intake forms', tool: 'Typeform + n8n or Google Forms + Apps Script' },
      { fn: 'CRM / matter management', tool: 'Clio (legal), HubSpot, or custom' },
      { fn: 'Appointment booking', tool: 'Calendly or Cal.com' },
      { fn: 'Chatbot', tool: 'Botpress or custom' },
      { fn: 'Status automation', tool: 'n8n + CRM webhooks' },
      { fn: 'Reporting', tool: 'Looker Studio or automated email' },
      { fn: 'Healthcare compliance', tool: 'HIPAA-compliant communication tools only' },
    ],
    healthcareNote:
      'If you\'re a medical or mental health practice: we are HIPAA-aware in our automation design. We use HIPAA-compliant communication tools (Business Associate Agreements available). We do not store PHI in non-compliant third-party tools. All patient-facing automation is reviewed for compliance during the scoping process.',
    pricing: [
      { phase: 'Phase 1: Intake + Booking', built: 'Online intake form + calendar booking + confirmations', timeline: '1-2 weeks', investment: '$1,000, $2,000' },
      { phase: 'Phase 2: Follow-Up', built: 'Status communication automation by stage', timeline: '1-2 weeks', investment: '$800, $1,500' },
      { phase: 'Phase 3: Chatbot', built: 'After-hours website chatbot for inquiry + qualification', timeline: '2-3 weeks', investment: '$1,500, $2,500' },
      { phase: 'Phase 4: Reporting', built: 'Automated monthly client + billing summary', timeline: '1-2 weeks', investment: '$1,000, $1,500' },
    ],
    faqs: [
      { q: 'We handle sensitive client data. How do you protect it?', a: 'We design automation around your data sensitivity requirements. For legal practices: no case details leave your existing matter management system without approval. For healthcare: we use only HIPAA-compliant tools with Business Associate Agreements and never process PHI in non-compliant environments. Data security requirements are discussed in the first scoping call.' },
      { q: 'Our clients have a specific expectation of personal service. Will automation make us feel less personal?', a: 'The automations we build handle the transactional moments, scheduling, intake, reminders, status updates. These feel more personal when they arrive reliably, on time, and with the right information. The relationship-critical moments remain fully human. Most clients notice the improvement, not the automation.' },
      { q: 'We\'re a solo practitioner. Is this overkill for our scale?', a: 'Not if your inquiry-to-client conversion rate is lower than you want, or if you\'re spending more than 8 hours/week on admin. The intake + booking system alone (Phase 1) is the highest-ROI place to start at any scale, and it starts at $1,000.' },
      { q: 'What\'s the handoff when the project is done? We don\'t have a tech person.', a: 'Every build comes with: documentation in plain language, a walkthrough video, and a 30-day support window. We configure everything so that the things you\'ll need to update (availability, templates, routing rules) can be changed without code. If something breaks, you contact us.' },
    ],
    cta: {
      headline: 'You Deliver Expertise. Let AI Handle Everything Before the Meeting.',
      sub: 'Book a free 30-minute AI Audit. We\'ll map your current client intake process and show you exactly where 5-10 hours per week are being lost.',
      button: 'Book Free Audit',
      below: 'We work with law firms, consultancies, healthcare practices, and financial advisors. We understand confidentiality, regulatory requirements, and the value of a client relationship that feels personal.',
    },
  },
  {
    slug: 'healthcare',
    homeCard: {
      icon: 'stethoscope',
      blurb: 'Referral intake, appointment scheduling, EHR-adjacent workflows, and HIPAA-aware data handling. We have built for US clinics and we design every automation around compliance.',
      badge: 'Compliance-aware',
    },
    navLabel: 'Healthcare / Clinics',
    image: '/images/industries/industry-professional-services.png',
    metaTitle: 'AI Automation for Healthcare Clinics | AI Data House',
    metaDescription:
      'Clinics and private practices: automate referral intake, patient scheduling, reminders, and follow-up with HIPAA-aware design and Business Associate Agreements. Free audit available.',
    hero: {
      headline: 'Your Clinical Team Should Be Treating Patients, Not Chasing Forms and Phone Tag.',
      sub: 'Referral intake, new-patient paperwork, appointment scheduling, reminders, and recall all run through your front desk by hand. We build HIPAA-aware automation that handles everything between the first referral and the visit, so your staff spends their time on patients instead of admin.',
      cta1: 'Book a Free AI Audit',
      cta2: 'See What We Build',
    },
    problem: {
      body: [
        'Most clinics lose time and patients in the same places: intake, scheduling, and follow-up.',
        'A referral comes in by fax or portal. Someone re-keys it. New-patient forms get mailed or handed over on a clipboard and then typed back in. Scheduling is phone tag. Reminders are manual, so no-shows pile up. Recall for follow-up visits depends on someone remembering to call.',
        'None of that requires a clinician. All of it pulls your front desk away from the patients in the waiting room.',
      ],
      statHeading: 'The numbers most clinics do not calculate',
      statBody: [
        'The average no-show rate for US outpatient clinics runs 15-30%. Automated reminders typically cut no-shows by 40-60%, and every recovered slot is a visit that would otherwise have been lost revenue.',
        'A front desk spending 12 hours a week on intake re-keying, scheduling, and reminder calls is 12 hours not spent on patients, billing, or follow-up. Even automating half of that recovers a meaningful part of a full-time role.',
      ],
    },
    after: [
      'A referral arrives at 6pm. It is parsed into your intake record automatically, the patient receives a secure link to complete history, insurance, and consent forms, and a booking link for their first available slot, before your front desk opens the next morning.',
      'The patient books online. A confirmation fires instantly, a reminder fires 48 hours out and again 2 hours out, each with prep instructions for the visit type. No-shows drop because nobody has to remember to call.',
      'After the visit, a follow-up message and any recall reminder are scheduled automatically. Your staff walks into each day with intake already done and the schedule already confirmed, instead of starting from a stack of paperwork.',
    ],
    automationsHeading: 'The 5 Automations We Build for Clinics',
    automations: [
      { title: 'Referral + Patient Intake Automation', replaces: 'Re-keying faxed or portal referrals and mailing or handing over new-patient paperwork.', does: 'Referral received → intake record created → patient sent a secure link for medical history, insurance information, and consent documents → completed data routed into your patient record → front desk notified with an intake summary. All patient-facing steps use HIPAA-compliant tools.', sees: 'By the time the office opens, the intake is complete and the chart is started.' },
      { title: 'Appointment Booking + Reminder System', replaces: 'Phone tag for scheduling, manual reminder calls, and avoidable no-shows.', does: 'Patients get a direct booking link with real availability. On booking: instant confirmation, intake form if not yet completed, a 48-hour reminder, and a 2-hour reminder, each with visit-specific prep instructions.', sees: 'No-show reduction of 40-60% in most practices.' },
      { title: 'Recall + Follow-Up Automation', replaces: 'Someone remembering to call patients due for a follow-up or annual visit.', does: 'Each visit type defines a follow-up or recall window. When a patient is due, an automated, compliant message goes out with a booking link. Patients who do not respond enter a short reminder sequence.', sees: 'Recall stops depending on memory and starts running on its own.' },
      { title: 'After-Hours Inquiry Chatbot or Voice Agent', replaces: 'Inquiries sitting in voicemail or a contact form until the next business day.', does: 'A chatbot or AI voice agent handles common questions (hours, location, insurance accepted, whether you are taking new patients), qualifies the inquiry, and books or routes it. Anything clinical is flagged for staff rather than answered by AI.' },
      { title: 'Front-Desk + Reporting Summaries', replaces: 'Building schedule, no-show, and intake-status reports by hand.', does: 'A daily or weekly summary compiles upcoming appointments, outstanding intake forms, no-show trends, and recall lists due, delivered to the office before the day starts.', sees: 'The front desk knows exactly what needs attention without digging through systems.' },
    ],
    proof: [
      'A US clinic was running referral intake, new-patient paperwork, scheduling, and reminder calls entirely through the front desk, losing both staff hours and slots to no-shows.',
      'We built HIPAA-aware intake and an appointment and reminder system, with every patient-facing step on compliant tools backed by a Business Associate Agreement.',
      'Intake moved online, scheduling back-and-forth dropped sharply, and automated reminders recovered slots that were previously lost to no-shows, freeing the front desk to focus on patients in the office.',
    ],
    techStack: [
      { fn: 'Intake forms', tool: 'HIPAA-compliant form tools with a Business Associate Agreement' },
      { fn: 'Patient records / EHR', tool: 'Integration with your existing EHR or practice management system' },
      { fn: 'Appointment booking', tool: 'HIPAA-compliant scheduling (Cal.com self-hosted or compliant Calendly)' },
      { fn: 'Reminders + messaging', tool: 'HIPAA-compliant SMS and email providers only' },
      { fn: 'Chatbot / voice agent', tool: 'Botpress or VAPI, scoped to non-clinical questions' },
      { fn: 'Automation engine', tool: 'n8n on your own infrastructure' },
      { fn: 'Reporting', tool: 'Looker Studio or automated internal summary' },
    ],
    healthcareNote:
      'We are HIPAA-aware in our automation design. We use only HIPAA-compliant communication tools (Business Associate Agreements available), we do not store PHI in non-compliant third-party tools, and every patient-facing automation is reviewed for compliance during scoping. We are not a covered entity and do not provide legal compliance certification; we design and build to your compliance requirements and your counsel\'s guidance.',
    pricing: [
      { phase: 'Phase 1: Intake + Booking', built: 'Online intake + HIPAA-aware scheduling + confirmations', timeline: '2-3 weeks', investment: '$1,500-$3,000' },
      { phase: 'Phase 2: Reminders + Recall', built: 'Reminder sequences and automated recall/follow-up', timeline: '1-2 weeks', investment: '$1,000-$2,000' },
      { phase: 'Phase 3: After-Hours Agent', built: 'Chatbot or voice agent for non-clinical inquiries', timeline: '2-3 weeks', investment: '$1,500-$3,000' },
      { phase: 'Phase 4: Reporting', built: 'Daily/weekly front-desk and no-show summaries', timeline: '1-2 weeks', investment: '$1,000-$1,500' },
    ],
    pricingNote: 'All phases include: scoping call, compliance review of patient-facing steps, build, testing, handoff documentation, and 30-day support.',
    faqs: [
      { q: 'Is your automation HIPAA compliant?', a: 'We design HIPAA-aware automation: we use only communication and storage tools that offer a Business Associate Agreement, we never route PHI through non-compliant third-party tools, and we review every patient-facing step for compliance during scoping. We are not a covered entity and do not issue compliance certifications. We build to your requirements and your compliance counsel\'s guidance.' },
      { q: 'Can you integrate with our EHR or practice management system?', a: 'If your system has an API or supported integration, yes. Where direct integration is not available, we build compliant intake and scheduling layers around it and hand structured data to your staff for entry. We confirm exactly what is possible with your specific system during the first scoping call.' },
      { q: 'Will patients feel like they are dealing with a machine?', a: 'The automations handle the transactional moments: intake, scheduling, reminders, and recall. Those feel better when they arrive reliably and on time. Anything clinical stays with your staff and clinicians. Most patients notice fewer delays, not the automation.' },
      { q: 'We are a small practice. Is this worth it at our size?', a: 'The intake and booking system alone (Phase 1) is usually the highest-ROI place to start at any size, because it recovers front-desk hours and reduces no-shows immediately. You do not have to build everything at once.' },
    ],
    cta: {
      headline: 'Give Your Front Desk Their Time Back, and Stop Losing Slots to No-Shows.',
      sub: 'Book a free 30-minute AI Audit. We will map your intake, scheduling, and reminder workflow and show you where staff hours and appointment slots are being lost.',
      button: 'Book Free Audit',
      below: 'We build HIPAA-aware systems for clinics and private practices. Compliance of every patient-facing step is reviewed during scoping.',
    },
  },
];

export const INDUSTRY_NAV = INDUSTRIES.map((i) => ({ label: i.navLabel, href: `/industries/${i.slug}` }));

export function getIndustry(slug?: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}
