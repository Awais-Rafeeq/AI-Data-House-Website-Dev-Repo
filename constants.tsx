
import React from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  Cpu, 
  Workflow, 
  BarChart3, 
  Code2, 
  Database, 
  Settings2,
  CheckCircle2,
  Zap,
  Globe,
  Clock,
  TrendingUp,
  ShieldCheck,
  Search,
  Users,
  Calendar,
  Layers,
  FileText,
  Mail,
  Smartphone,
  PieChart,
  HardDrive,
  Activity,
  Briefcase,
  Target,
  DollarSign,
  Network,
  Award,
  ArrowUpRight,
  Shield,
  Bot,
  Star,
  BookOpen,
  Lightbulb,
  Wrench,
  Filter,
  MousePointer2,
  Youtube,
  Linkedin,
  Boxes,
  Utensils
} from 'lucide-react';
import { ServiceItem, MetricItem, NavLink, CaseStudy, BlogPost, Resource } from './types';

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'AI Workflow Automation', href: '/solutions/ai-workflow-automation' },
      { label: 'AI Chatbots', href: '/solutions/ai-chatbots' },
      { label: 'AI Voice Agents', href: '/solutions/ai-voice-agents' },
      { label: 'Internal Web Apps', href: '/solutions/internal-web-apps' },
      { label: 'CRM & Lead Automation', href: '/solutions/crm-lead-automation' },
      { label: 'Dashboards & Reporting', href: '/solutions/data-dashboards-reporting' },
    ]
  },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'Real Estate', href: '/industries/real-estate' },
      { label: 'E-Commerce', href: '/industries/ecommerce' },
      { label: 'Marketing Agencies', href: '/industries/agencies' },
      { label: 'Restaurants', href: '/industries/restaurants' },
      { label: 'Professional Services', href: '/industries/professional-services' },
      { label: 'Healthcare / Clinics', href: '/industries/healthcare' },
    ]
  },
  { label: 'Case Studies', href: '/case-studies' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'The Playbook (Blog)', href: '/resources/blog' },
      // 'Success Stories' removed: it pointed at /case-studies, which already
      // has its own top-level nav item.
      { label: 'Tools', href: '/tools' },
      { label: 'Watch on YouTube', href: 'https://youtube.com/@aidatahouse' },
    ]
  },
  { label: 'About', href: '/about' },
];

export const SHOWCASE_FEATURES = [
  {
    id: 'chatbots',
    title: 'Customer Experience Bots',
    slug: 'ai-chatbots',
    heading: 'Sell & Support 24/7 on WhatsApp & Web',
    description: 'Intelligent assistants that read your website content, handle complex FAQs, and qualify leads into your CRM while you sleep.',
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1200',
    icon: <MessageSquare />,
    features: ['Instant Content Indexing', 'Multi-lingual Sales', 'Direct CRM Lead Injection']
  },
  {
    id: 'calling',
    title: 'Voice AI Agents',
    slug: 'ai-calling-agents',
    heading: 'Zero Latency Phone Automation',
    description: 'Human-sounding AI agents for inbound customer support and outbound appointment setting. Zero wait times, infinite scale.',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=1200',
    icon: <PhoneCall />,
    features: ['Emotional Intelligence', 'Direct Live-Transfer', 'Post-Call Analytics']
  },
  {
    id: 'workflows',
    title: 'Deep Automation',
    slug: 'workflow-automation',
    heading: 'Your Entire Tech Stack, Connected.',
    description: 'Using n8n and custom Python scripts, we eliminate the data silos in your business. No more manual entry between Shopify, HubSpot, or Slack.',
    image: 'https://images.unsplash.com/photo-1451187530220-4c2a1ba79ca1?auto=format&fit=crop&q=80&w=1200',
    icon: <Workflow />,
    features: ['Custom API Bridges', 'Error Monitoring & Alerts', 'Complex Conditional Logic']
  },
  {
    id: 'ml_models',
    title: 'Custom AI Models',
    slug: 'ai-process-automation',
    heading: 'Proprietary ML Solutions',
    description: 'Tailored AI models and Computer Vision solutions designed specifically for your proprietary business data.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    icon: <Cpu />,
    features: ['Private Model Fine-tuning', 'Vector Database Setup', 'Image/Pattern Recognition']
  },
  {
    id: 'dashboards',
    title: 'BI & Analytics',
    slug: 'data-analytics',
    heading: 'Data-Driven Decision Hub',
    description: 'Live performance dashboards that pull from every automated node in your business. See your true ROI in real-time.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    icon: <BarChart3 />,
    features: ['Automated ETL Pipelines', 'Predictive Forecasting', 'Custom KPI Visuals']
  }
];

export const HUB_CATEGORIES = [
  { id: 'all', label: 'All Knowledge', icon: <Layers className="w-4 h-4" /> },
  { id: 'case-study', label: 'Success Stories', icon: <Award className="w-4 h-4" /> },
  { id: 'resource', label: 'Blueprints', icon: <Wrench className="w-4 h-4" /> },
  { id: 'blog', label: 'Automation Guides', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'calculator', label: 'Tools', icon: <BarChart3 className="w-4 h-4" /> }
];

export const RESTAURANT_MENU = {
  items: [
    { id: 'p1', name: 'Margherita Pizza', price: 14, category: 'Pizza' },
    { id: 'p2', name: 'Pepperoni Feast', price: 18, category: 'Pizza' },
    { id: 'b1', name: 'Classic Wagyu Burger', price: 16, category: 'Burger' },
    { id: 'b2', name: 'Truffle Mushroom Burger', price: 19, category: 'Burger' },
    { id: 's1', name: 'Caesar Salad', price: 12, category: 'Sides' },
    { id: 'd1', name: 'Cola Zero', price: 3, category: 'Drinks' },
    { id: 'd2', name: 'Lemonade', price: 4, category: 'Drinks' },
  ]
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b2',
    slug: 'automation-tools-pricing-comparison-2025',
    title: 'Automation Tools Pricing Comparison 2025',
    excerpt: 'Complete breakdown of costs, features, and hidden charges for Zapier, Make, n8n, and Apps Script.',
    content: 'Full pricing comparison details below.', 
    category: 'Industry Insights', 
    author: 'Awais Rafeeq', 
    date: 'Dec 15, 2024', 
    readTime: '10 min', 
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    contentFormat: 'html',
    customHtml: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-slate-600">
          Choosing the right automation platform is critical for scaling. Below is our comprehensive analysis of the top 3 contenders in the market.
        </p>
        <div class="overflow-hidden border border-slate-200 rounded-2xl shadow-sm">
          <table class="w-full text-left border-collapse bg-white">
            <thead>
              <tr class="bg-slate-900 text-white">
                <th class="p-6 font-bold uppercase text-xs tracking-widest">Tool</th>
                <th class="p-6 font-bold uppercase text-xs tracking-widest">Pricing Model</th>
                <th class="p-6 font-bold uppercase text-xs tracking-widest">Key Advantage</th>
                <th class="p-6 font-bold uppercase text-xs tracking-widest">Best For</th>
              </tr>
            </thead>
            <tbody class="text-sm font-medium text-slate-600 divide-y divide-slate-100">
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-6 font-bold text-slate-900">n8n (Self-Hosted)</td>
                <td class="p-6">Flat Fee / Free</td>
                <td class="p-6 text-emerald-600 font-bold">Unlimited Executions & Privacy</td>
                <td class="p-6">Enterprise & Heavy Data Ops</td>
              </tr>
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-6 font-bold text-slate-900">Make (Integromat)</td>
                <td class="p-6">Per Operation</td>
                <td class="p-6 text-emerald-600 font-bold">Visual Debugging Interface</td>
                <td class="p-6">Complex Marketing Logic</td>
              </tr>
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-6 font-bold text-slate-900">Zapier</td>
                <td class="p-6">Per Task (Premium)</td>
                <td class="p-6 text-emerald-600 font-bold">Massive Integration Library</td>
                <td class="p-6">Simple Connectors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },
  {
    id: 'b3',
    slug: 'mastering-n8n-in-2024',
    title: 'How to Build an AI-First Business with n8n in 2024',
    excerpt: 'The complete architectural guide to replacing manual tasks with intelligent automated workflows.',
    content: 'We explore how to architect an AI-first business using n8n for orchestration. Key topics include webhook handling, JSON parsing, and OpenAI function calling integration.',
    category: 'Tutorials',
    author: 'AI Data House Team',
    date: 'May 12, 2024',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b4',
    slug: 'ai-calling-agents-roi',
    title: 'The Real ROI of AI Calling Agents: Data from 500 Campaigns',
    excerpt: 'We analyzed thousands of calls made by Zara and other AI agents to find what actually converts.',
    content: 'Our analysis of 500+ campaigns reveals that speed to lead is the single most important metric. AI agents that call within 1 minute of lead submission see a 300% higher conversion rate.',
    category: 'Industry Insights',
    author: 'Awais Rafeeq',
    date: 'June 02, 2024',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs1', 
    slug: 'real-estate-roi', 
    title: '95% Faster Lead Response for Real Estate', 
    client: 'Confidential Agency', 
    industry: 'Real Estate', 
    companySize: '50-100', 
    duration: '2 weeks', 
    teamSize: '2', 
    serviceId: 'ai-chatbots',
    challengeShort: 'Losing 70% of leads due to slow manual response times.', 
    challengeDetailed: 'The client was manually copying leads from Facebook Ads to their CRM. This process took an average of 12 hours, by which time the lead had gone cold.', 
    problemPoints: ['Manual Data Entry', 'Slow Response Time', 'Low Conversion'], 
    solutionSummary: 'We implemented an n8n workflow that instantly captures leads, verifies them via WhatsApp, and schedules appointments.', 
    solutionComponents: [], 
    timeline: [], 
    resultsTable: [], 
    metricsOverview: [], 
    testimonial: {quote: 'We doubled our booking rate in 2 weeks.', author: 'Sarah J.', title: 'Director', company: 'EstateFlow', rating: 5},
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', 
    techStack: ['n8n', 'Vapi', 'Retell']
  },
  {
    id: 'cs2',
    slug: 'scaling-order-fulfillment',
    title: 'Scaling Order Fulfillment by 600%',
    client: 'E-commerce Brand',
    industry: 'E-commerce',
    companySize: '10-50',
    duration: '3 weeks',
    teamSize: '3',
    serviceId: 'workflow-automation',
    challengeShort: 'Manual entry from Shopify to ERP was creating a backlog of 500 orders/day.',
    challengeDetailed: 'The client had 4 staff members manually typing order details into NetSuite. Error rates were high (5%), and shipping was delayed by 48 hours.',
    problemPoints: ['Data Entry Bottleneck', 'High Error Rate', 'Shipping Delays'],
    solutionSummary: 'Automated order sync, inventory validation, and label generation via custom API bridge using n8n and Python.',
    solutionComponents: [],
    timeline: [],
    resultsTable: [],
    metricsOverview: [],
    testimonial: {quote: 'We scaled to 6x order volume without hiring a single new staff member.', author: 'Mike T.', title: 'COO', company: 'SwiftKart', rating: 5},
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    techStack: ['Shopify API', 'NetSuite', 'n8n']
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'restaurant-ai',
    slug: 'restaurant-ai',
    title: 'AI Calling Agents for Restaurants',
    tagline: 'Never Miss a Takeout Order Again.',
    description: 'Automate your front-of-house phone lines with an AI that knows your menu, takes orders, and syncs with your kitchen.',
    longDescription: 'Our restaurant AI handles peak-hour call volume, understands complex menu modifications, and integrates directly with your KDS or POS system.',
    overviewHeading: 'Silence the Phone, Not the Orders',
    whyMatters: '30% of restaurant revenue is lost due to unanswered phone calls during rush hour.',
    features: [
      { title: 'Menu Knowledge', desc: 'Instantly answers questions about ingredients & allergies.', icon: <Utensils />, useCase: 'Staff training.' },
      { title: 'Live Order Sync', desc: 'Orders appear in your kitchen instantly.', icon: <Zap />, useCase: 'Operations.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <Utensils />, category: 'primary', faqs: []
  },
  {
    id: 'ai-chatbots',
    slug: 'ai-chatbots',
    title: 'Intelligent Website & WhatsApp Chatbots',
    tagline: 'Conversational AI that actually sells.',
    description: 'Transform your customer experience with high-engagement conversational AI.',
    longDescription: 'Our AI chatbots are built with the latest Natural Language Understanding (NLU). They understand intent and context, reading your website content instantly to provide human-like support.',
    overviewHeading: 'Intelligent Conversations at Scale',
    whyMatters: 'Speed to lead is the #1 factor in conversion. Our bots respond in under 3 seconds.',
    features: [
      { title: 'Content Context', desc: 'Reads and remembers your website data.', icon: <Globe />, useCase: 'FAQ handling.' },
      { title: 'Lead Slicing', desc: 'Intelligently qualifies leads.', icon: <Target />, useCase: 'CRM filtering.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <MessageSquare />, category: 'primary', faqs: []
  },
  {
    id: 'ai-calling-agents',
    slug: 'ai-calling-agents',
    title: 'Ultra-Realistic Voice AI Agents',
    tagline: 'Infinite scale inbound and outbound.',
    description: 'Autonomous voice agents for support and lead qualification.',
    longDescription: 'Using Vapi and Retell orchestration, our agents sound 99% human and handle 1000+ simultaneous calls.',
    overviewHeading: 'Voice Automation',
    whyMatters: 'Never miss an inbound lead again.',
    features: [
      { title: 'Human-like TTS', desc: 'Powered by ElevenLabs.', icon: <PhoneCall />, useCase: 'High trust calls.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <PhoneCall />, category: 'primary', faqs: []
  },
  {
    id: 'workflow-automation',
    slug: 'workflow-automation',
    title: 'Enterprise Workflow Automation',
    tagline: 'Connect every tool in your stack.',
    description: 'We build custom n8n and Python workflows to eliminate manual data entry.',
    longDescription: 'From syncing Shopify orders to ERPs, to automating client onboarding, our workflows are robust, error-checked, and scalable.',
    overviewHeading: 'Eliminate Busywork',
    whyMatters: 'Manual data entry costs businesses 20-30% of their revenue in lost efficiency.',
    features: [
      { title: 'API Integration', desc: 'Connect any tool with an API.', icon: <Network />, useCase: 'Cross-platform sync.' },
      { title: 'Error Handling', desc: 'Automated alerts for failed tasks.', icon: <ShieldCheck />, useCase: 'Reliability.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <Workflow />, category: 'primary', faqs: []
  },
  {
    id: 'ai-process-automation',
    slug: 'ai-process-automation',
    title: 'Custom AI Models & Computer Vision',
    tagline: 'AI solutions tailored to your proprietary data.',
    description: 'Fine-tuned LLMs and computer vision models for specialized tasks.',
    longDescription: 'Whether it is analyzing medical imaging or drafting legal documents based on your firm\'s precedents, we build models that understand your specific domain.',
    overviewHeading: 'Beyond Generic AI',
    whyMatters: 'Generic models fail at specialized tasks. Custom models deliver 40% higher accuracy.',
    features: [
      { title: 'Fine-tuning', desc: 'Train on your data.', icon: <Database />, useCase: 'Specialized output.' },
      { title: 'Secure Deployment', desc: 'Private instances available.', icon: <Shield />, useCase: 'Data privacy.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <Cpu />, category: 'additional', faqs: []
  },
  {
    id: 'data-analytics',
    slug: 'data-analytics',
    title: 'BI & Predictive Analytics',
    tagline: 'Visualize your success in real-time.',
    description: 'Centralized dashboards that pull data from all your automated workflows.',
    longDescription: 'Stop guessing. We build real-time dashboards that show you exactly how much time and money your automations are saving you.',
    overviewHeading: 'Data Driven Growth',
    whyMatters: 'You cannot improve what you do not measure.',
    features: [
      { title: 'Real-time ETL', desc: 'Data is always up to date.', icon: <Activity />, useCase: 'Live monitoring.' },
      { title: 'Custom KPIs', desc: 'Track what matters to you.', icon: <Target />, useCase: 'Strategic alignment.' }
    ],
    howItWorks: [], useCases: [], techStack: [], pricing: '', icon: <BarChart3 />, category: 'additional', faqs: []
  }
];

export const METRICS: MetricItem[] = [
  { label: 'Uptime SLA', value: '99%', sublabel: 'Enterprise Reliability' },
  { label: 'Global AI Node', value: 'Islamabad', sublabel: 'Pakistan Hub' },
  { label: 'Elite Cases', value: '50+', sublabel: 'Worldwide' }
];

export const RESOURCES: Resource[] = [
  { 
    id: 'res_1', 
    title: 'n8n: FB Leads to WhatsApp', 
    category: 'n8n Workflows', 
    description: 'Instant auto-reply for every Facebook lead. Works with WhatsApp Business API.', 
    tags: ['n8n', 'CRM', 'Leads'], 
    downloads: '1200', 
    rating: '4.9', 
    tool: 'n8n',
    difficulty: 'Intermediate',
    setupTime: '15 mins',
    image: '',
    pdfLink: '',
    videoLink: '',
    templateLink: ''
  },
  { 
    id: 'res_2', 
    title: 'Make: Shopify Inventory Sync', 
    category: 'Make.com Scenarios', 
    description: 'Keep Google Sheets and Shopify inventory in perfect sync automatically.', 
    tags: ['Shopify', 'Google Sheets'], 
    downloads: '850', 
    rating: '4.8', 
    tool: 'Make',
    difficulty: 'Intermediate',
    setupTime: '20 mins',
    image: '',
    pdfLink: '',
    videoLink: '',
    templateLink: ''
  }
];
export const RESOURCE_CATEGORIES = [];
export const PRICING_TIERS = [];
export const BLOG_CATEGORIES = [];
export const STEPS = [];

export const TECH_STACK_LOGOS = [
  { name: 'n8n', icon: 'Workflow' },
  { name: 'OpenAI', icon: 'Bot' },
  { name: 'Vapi', icon: 'PhoneCall' },
  { name: 'Retell AI', icon: 'PhoneCall' },
  { name: 'HubSpot', icon: 'Users' },
  { name: 'Shopify', icon: 'ShoppingBag' },
  { name: 'Pinecone', icon: 'Database' },
  { name: 'Python', icon: 'Code2' },
  { name: 'ElevenLabs', icon: 'Activity' },
  { name: 'WhatsApp', icon: 'MessageSquare' },
];

export const FAQ_ITEMS = [
  {
    q: 'How long does it take to deploy an AI system?',
    a: 'Most automations go live within 2–4 weeks. Complex multi-system integrations typically take 4–8 weeks. We provide a detailed timeline during your free audit call.'
  },
  {
    q: 'Do I need technical knowledge to work with you?',
    a: 'No. We handle all architecture, engineering, and deployment. You describe the business problem; we build the solution and train your team on how to use it.'
  },
  {
    q: 'What tools and platforms do you integrate with?',
    a: 'We integrate with virtually any platform that has an API — HubSpot, Salesforce, Shopify, NetSuite, Slack, WhatsApp, Google Workspace, and hundreds more via n8n and custom Python bridges.'
  },
  {
    q: 'How do you ensure data security and privacy?',
    a: 'All workflows run on your own infrastructure or dedicated cloud instances. We never store client data on shared servers. Private model deployments and HIPAA-compliant pipelines are available upon request.'
  },
  {
    q: 'What happens after deployment — do you offer ongoing support?',
    a: 'Yes. Every engagement includes a 30-day post-launch support window. We also offer retainer plans for ongoing optimization, monitoring, and scaling as your business grows.'
  }
];
