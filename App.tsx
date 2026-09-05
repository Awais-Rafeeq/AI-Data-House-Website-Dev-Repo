
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import HomePageNew from './pages/HomePage';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Zap,
  Youtube,
  Linkedin,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Check,
  Bot,
  Sparkles,
  Search,
  Users,
  Award,
  Layers,
  Wrench,
  BookOpen,
  BarChart3,
  Globe,
  Star,
  Cpu,
  Smartphone,
  ChevronLeft,
  Mail,
  MapPin,
  Loader2,
  Utensils
} from 'lucide-react';
import {
  NAV_LINKS,
  SERVICES,
  CASE_STUDIES,
  BLOG_POSTS,
  METRICS,
  SHOWCASE_FEATURES,
  HUB_CATEGORIES,
  TECH_STACK_LOGOS,
  FAQ_ITEMS
} from './constants';
import AIAssistant from './components/AIAssistant';
import FeatureShowcase from './components/FeatureShowcase';
import BookingFlow from './components/BookingFlow';
import { sendToN8n, ACTIONS } from './lib/n8n';
import SolutionPage from './pages/SolutionPage';
import IndustryPage from './pages/IndustryPage';
import { BlogIndexPage, BlogPostPage } from './pages/BlogPages';
import BlogSubmitPage from './pages/BlogSubmitPage';
import { CaseStudyIndexPage, CaseStudyDetailPage } from './pages/CaseStudyPages';
import { AboutPage, ContactPage, LegalPage, NotFoundPage } from './pages/StaticPages';
import CommercialPage from './pages/CommercialPage';
import { ToolsIndexPage, ToolPage } from './pages/ToolsPages';

// Heavy, route-specific components are code-split so recharts, supabase, and the
// dashboard bundle stay off the marketing pages (see DESIGN_QA_BACKLOG A6).
const ROICalculator = lazy(() => import('./components/ROICalculator'));
const RestaurantAgent = lazy(() => import('./components/RestaurantAgent'));
const JobDashboard = lazy(() => import('./components/JobDashboard'));
import { SOLUTIONS } from './data/solutions';
import { INDUSTRIES } from './data/industries';
import { useSeo, breadcrumbJsonLd } from './lib/seo';
import { trackPageView } from './lib/analytics';
import { AdhLogo } from './components/Logo';

// --- VISUAL COMPONENTS ---

const TypewriterHero = () => {
  const words = ["AI Voice Agents", "n8n Workflows", "WhatsApp Chatbots", "Custom AI Models", "BI Dashboards"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="text-emerald-600 inline-block min-w-[280px]">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse border-r-4 border-emerald-600 ml-1"></span>
    </span>
  );
};

const HeroVisuals = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] perspective-1000">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/20 blur-[120px] rounded-full"></div>

      {/* Main Dashboard Interface */}
      <div className="absolute inset-0 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden transform rotate-y-6 rotate-x-6 hover:rotate-y-3 hover:rotate-x-3 transition-transform duration-700">
         {/* Fake Browser Header */}
         <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 px-3 py-1 bg-slate-900 rounded-md text-[10px] text-slate-500 font-mono w-64">aidatahouse.com/dashboard/live</div>
         </div>

         {/* Dashboard Content Mockup */}
         <div className="p-6 grid grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="col-span-1 hidden md:block space-y-4">
               <div className="h-8 w-3/4 bg-slate-800 rounded-lg animate-pulse"></div>
               <div className="h-4 w-1/2 bg-slate-800/50 rounded-lg"></div>
               <div className="h-4 w-2/3 bg-slate-800/50 rounded-lg"></div>
               <div className="h-4 w-1/2 bg-slate-800/50 rounded-lg"></div>
            </div>

            {/* Main Graphs */}
            <div className="col-span-3 md:col-span-2 space-y-6">
               <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                     <div className="text-xs text-slate-400 mb-1">Active Agents</div>
                     <div className="text-2xl font-black text-emerald-400">142</div>
                  </div>
                  <div className="flex-1 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                     <div className="text-xs text-slate-400 mb-1">Hours Saved</div>
                     <div className="text-2xl font-black text-white">1,240</div>
                  </div>
               </div>
               <div className="h-48 bg-slate-800/30 rounded-xl border border-slate-700/50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-4 pb-4 gap-2">
                     {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} style={{height: `${h}%`}} className="w-full bg-emerald-500/20 rounded-t-sm relative group">
                           <div className="absolute bottom-0 w-full bg-emerald-500 transition-all duration-1000" style={{height: '100%'}}></div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Floating Card: n8n Workflow Node */}
      <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-48 animate-in slide-in-from-left duration-1000 delay-300">
         <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#FF6D5A] rounded-lg flex items-center justify-center text-white font-bold text-xs">n8n</div>
            <div className="text-xs font-bold text-slate-700">Webhook</div>
         </div>
         <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
            POST /catch/hooks
            <br/><span className="text-emerald-600">200 OK</span>
         </div>
      </div>

      {/* Floating Card: AI Chat */}
      <div className="absolute -right-6 bottom-32 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 w-56 animate-in slide-in-from-right duration-1000 delay-500">
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white"><Bot size={14} /></div>
             <div className="bg-slate-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl">
                <p className="text-xs font-medium text-slate-600">Lead qualified. Sending to CRM now.</p>
             </div>
          </div>
      </div>
    </div>
  );
};

// --- FORMS ---

const LeadForm = ({ title, actionType, buttonText = "Submit Request" }: { title: string, actionType: string, buttonText?: string }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await sendToN8n(actionType, { name, email, company, type: 'Lead Form' });

    if (result.success) {
      setStatus('success');
      setEmail('');
      setName('');
      setCompany('');
    } else {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-black text-emerald-900 mb-2">Request Received!</h3>
        <p className="text-emerald-800">Our team will be in touch within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm font-bold text-emerald-600 underline">Send another request</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xl">
       <h3 className="text-2xl font-black mb-6">{title}</h3>
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="grid md:grid-cols-2 gap-4">
           <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-colors font-medium"
           />
           <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-colors font-medium"
           />
         </div>
         <input
            type="email"
            placeholder="Work Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-colors font-medium"
         />
         <button
            disabled={status === 'loading'}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
         >
           {status === 'loading' ? <Loader2 className="animate-spin" /> : buttonText}
         </button>
         {status === 'error' && <p className="text-red-500 text-sm font-bold text-center">Something went wrong. Please try again.</p>}
       </form>
    </div>
  );
};

const Header = ({ scrolled, isMenuOpen, setIsMenuOpen }: { scrolled: boolean; isMenuOpen: boolean; setIsMenuOpen: (v: boolean) => void }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (e: React.MouseEvent, href: string, trackingAction?: string, trackingData?: any) => {
    e.preventDefault();
    if (trackingAction) sendToN8n(trackingAction, trackingData);
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener noreferrer');
    } else {
      navigate(href);
    }
  };

  // Pages that open with a dark hero, header sits transparent over them with light text.
  // The homepage hero moved to the new white/light theme (Phase 1 redesign), so
  // '/' no longer gets the light-on-dark treatment — everything else is unchanged.
  const p = location.pathname;
  const darkHero =
    p === '/about' ||
    p.startsWith('/solutions/') ||
    p.startsWith('/industries/') ||
    p.startsWith('/case-studies/');
  const onDark = !scrolled && darkHero;

  const linkBase = onDark
    ? 'text-white/85 hover:text-white'
    : 'text-slate-600 hover:text-emerald-600';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <AdhLogo variant={onDark ? 'light' : 'dark'} />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <div
              key={link.label}
              className="relative group"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                className={`text-sm font-bold flex items-center gap-1 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${location.pathname.startsWith(link.href) && link.href !== '/' ? (onDark ? 'text-white' : 'text-emerald-600') : linkBase}`}
              >
                {link.label} {link.children && <ChevronDown className="w-4 h-4" />}
              </a>
              {link.children && activeDropdown === link.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-[1.5rem] p-3 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  {link.children.map(child => (
                    <a
                      key={child.label}
                      href={child.href}
                      onClick={(e) => { handleNav(e, child.href); setActiveDropdown(null); }}
                      target={child.href.startsWith('http') ? '_blank' : '_self'}
                      className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: 'Header', label: 'Book a 30-Min Founder Call' }); navigate('/contact'); }}
            className="whitespace-nowrap px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-700 hover:shadow-md active:bg-emerald-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Book a 30-Min Founder Call
          </button>
        </div>

        <button
          className={`lg:hidden p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${onDark ? 'text-white' : 'text-slate-900'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
         <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-4 lg:hidden flex flex-col gap-4">
            {NAV_LINKS.map(link => (
               <div key={link.label}>
                  <a
                     href={link.href}
                     onClick={(e) => { handleNav(e, link.href); setIsMenuOpen(false); }}
                     className="block py-2 font-bold text-slate-900"
                  >
                     {link.label}
                  </a>
                  {link.children && (
                     <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100">
                        {link.children.map(child => (
                           <a
                              key={child.label}
                              href={child.href}
                              onClick={(e) => { handleNav(e, child.href); setIsMenuOpen(false); }}
                              className="block py-1 text-sm text-slate-600"
                           >
                              {child.label}
                           </a>
                        ))}
                     </div>
                  )}
               </div>
            ))}
            <button
              onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: 'Header (mobile)', label: 'Book a 30-Min Founder Call' }); navigate('/contact'); setIsMenuOpen(false); }}
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200"
            >
              Book a 30-Min Founder Call
            </button>
         </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      await sendToN8n(ACTIONS.NEWSLETTER, { email });
      setSubscribed(true);
      setEmail('');
    }
  };

  // Shared link styling: quiet grey that resolves to the brand green on hover,
  // which is the same interaction language the rest of the light theme uses.
  const linkCls = 'text-left text-slate-600 hover:text-[#1a7a3c] transition-colors';

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] mb-16">
          <div>
            <div className="mb-6">
              <AdhLogo variant="dark" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs mb-8">
              AI systems for US business leaders — workflow automation, AI agents, internal
              apps, and live reporting. Built in Islamabad, run on your infrastructure.
            </p>

            <div className="space-y-2 mb-8">
              <a href="mailto:info@aidatahouse.com" className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-[#1a7a3c] transition-colors">
                <Mail className="w-4 h-4 text-slate-400" /> info@aidatahouse.com
              </a>
              <p className="flex items-center gap-2.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" /> G-13, Islamabad · EST to PST coverage
              </p>
            </div>

            <div className="flex gap-3">
              <a href="https://youtube.com/@aidatahouse" target="_blank" rel="noopener noreferrer" aria-label="AI Data House on YouTube" className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1a7a3c] hover:border-[#1a7a3c] transition-colors">
                <Youtube className="w-[18px] h-[18px]" />
              </a>
              <a href="https://linkedin.com/company/aidatahouse" target="_blank" rel="noopener noreferrer" aria-label="AI Data House on LinkedIn" className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1a7a3c] hover:border-[#1a7a3c] transition-colors">
                <Linkedin className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase text-[10px] tracking-[0.16em]">Solutions</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              {SOLUTIONS.map(s => (
                <li key={s.slug}>
                  <button onClick={() => navigate(`/solutions/${s.slug}`)} className={linkCls}>
                    {s.navLabel}
                  </button>
                </li>
              ))}
              <li className="pt-1"><button onClick={() => navigate('/ai-automation-agency')} className={linkCls}>AI Automation Agency</button></li>
              <li><button onClick={() => navigate('/hire-n8n-developer')} className={linkCls}>Hire an n8n Developer</button></li>
              <li><button onClick={() => navigate('/ai-chatbot-development-company')} className={linkCls}>AI Chatbot Development</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase text-[10px] tracking-[0.16em]">Company</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><button onClick={() => navigate('/case-studies')} className={linkCls}>Case Studies</button></li>
              <li><button onClick={() => navigate('/industries')} className={linkCls}>Industries</button></li>
              <li><button onClick={() => navigate('/about')} className={linkCls}>About</button></li>
              <li><button onClick={() => navigate('/resources')} className={linkCls}>Blueprints</button></li>
              <li><button onClick={() => navigate('/resources/blog')} className={linkCls}>Automation Guides</button></li>
              <li><button onClick={() => navigate('/contact')} className={linkCls}>Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase text-[10px] tracking-[0.16em]">Stay Updated</h4>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              What we learn building these systems, once in a while. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              {subscribed ? (
                <p className="text-[#1a7a3c] font-semibold text-sm">Thanks for subscribing.</p>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a3c]/25 focus:border-[#1a7a3c] transition"
                  />
                  <button className="px-6 py-3 bg-[#1a7a3c] text-white font-bold rounded-xl text-sm hover:bg-[#146130] transition-colors">
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="pt-7 border-t border-slate-200 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI Data House. All rights reserved.</p>
          <div className="flex gap-7 font-medium">
            <button onClick={() => navigate('/privacy')} className="hover:text-[#1a7a3c] transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-[#1a7a3c] transition-colors">Terms</button>
            <button onClick={() => navigate('/security')} className="hover:text-[#1a7a3c] transition-colors">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Components ---

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-40 pb-28 lg:pt-56 lg:pb-36 overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-[900px] h-[600px] rounded-full bg-emerald-400 blur-[180px] opacity-[0.06]"></div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] opacity-40"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Trusted by 50+ US Businesses
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[1.0] tracking-tight text-slate-900 mb-7">
            Your AI Transformation<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800">
              Partner.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            We design, build, and scale custom AI systems that eliminate <strong className="text-slate-700">100+ hours of manual work</strong> every month, for ambitious US business owners.
          </p>

          <div className="flex flex-col lg:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: 'Hero', label: 'Book Free Audit' }); navigate('/contact'); }}
              className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 text-lg"
            >
              Book Your Free Audit <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/case-studies')}
              className="px-10 py-5 bg-white text-slate-700 border-2 border-slate-200 font-bold rounded-2xl hover:border-emerald-400 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 text-lg"
            >
              View Success Stories <ChevronRight size={20} />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            No contracts. No fluff. Just systems that work.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: '99%',      l: 'Uptime SLA',          s: 'Enterprise reliability' },
              { v: '50+',      l: 'Client Wins',          s: 'US businesses served' },
              { v: '2 Weeks',  l: 'Avg. Go-Live',         s: 'From audit to deployed' },
              { v: '100+ hrs', l: 'Saved / Month',        s: 'Per client, on average' },
            ].map((stat) => (
              <div key={stat.l} className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.v}</p>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <p className="text-[10px] text-slate-500 font-medium">{stat.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK LOGOS STRIP ── */}
      <section className="py-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Powered By Best-In-Class Infrastructure</p>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK_LOGOS.map((tech) => (
              <span key={tech.name} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-default">
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left, Pain */}
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] text-rose-500 uppercase mb-4">Sound Familiar?</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                You're Losing Revenue<br />to Manual Work.
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                Most US businesses are running on spreadsheets, slow follow-ups, and staff doing repetitive tasks that AI could handle in milliseconds.
              </p>
              <ul className="space-y-4">
                {[
                  { pain: 'Leads going cold because no one responds fast enough', icon: <Clock size={18} /> },
                  { pain: 'Staff spending hours on data entry, copy-pasting between tools', icon: <Layers size={18} /> },
                  { pain: 'Zero visibility into what\'s working, decisions made on gut feeling', icon: <BarChart3 size={18} /> },
                  { pain: 'Phone lines overwhelmed, orders and inquiries falling through the cracks', icon: <Wrench size={18} /> },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">{item.icon}</span>
                    <span className="text-slate-700 font-semibold text-sm leading-relaxed">{item.pain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right, Solution */}
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">How We Fix It</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                Autonomous Systems.<br />Built for Your Business.
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                We don't sell software licenses or templates. We build <strong className="text-slate-700">custom AI infrastructure</strong> that slots into your exact workflow and runs on autopilot.
              </p>
              <ul className="space-y-4">
                {[
                  { fix: 'AI Voice & Chat agents respond to every lead in under 3 seconds', icon: <Zap size={18} /> },
                  { fix: 'n8n + Python pipelines sync your entire tech stack automatically', icon: <ShieldCheck size={18} /> },
                  { fix: 'Live BI dashboards show you exactly what\'s working in real time', icon: <TrendingUp size={18} /> },
                  { fix: 'Custom AI models trained on your data, not generic off-the-shelf tools', icon: <Award size={18} /> },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">{item.icon}</span>
                    <span className="text-slate-700 font-semibold text-sm leading-relaxed">{item.fix}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: 'ProblemSolution', label: 'Get Free Audit' }); navigate('/contact'); }}
                className="mt-10 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all inline-flex items-center gap-3"
              >
                Get Your Free Audit <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      <FeatureShowcase />

      {/* How It Works */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600 blur-[160px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black tracking-[0.3em] text-emerald-400 uppercase mb-4">Our Process</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white">From Audit to Automation</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-emerald-800"></div>
            {[
              { num: '01', t: 'Analysis', d: 'We deep-dive your manual workflows, map every bottleneck, and identify the highest-ROI automation opportunities.', i: <Search size={24} /> },
              { num: '02', t: 'Engineering', d: 'Our team architects custom Python & n8n pipelines tailored to your exact data topology and tech stack.', i: <Cpu size={24} /> },
              { num: '03', t: 'Deployment', d: 'We integrate seamlessly into your live environment, train your team, and monitor performance from day one.', i: <Zap size={24} /> }
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center p-8">
                <div className="w-28 h-28 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center mb-8 relative z-10">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{step.num}</span>
                  <span className="text-emerald-400">{step.i}</span>
                </div>
                <h4 className="text-2xl font-black mb-4 text-white">{step.t}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">The AI Advantage</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-16">Why Global Leaders Choose Us</h3>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { t: 'High-Tech Center', d: 'Operating from G-13, Islamabad, we tap into a premium pool of AI & Data engineers.', i: <Globe /> },
              { t: 'US Timezone Focus', d: 'We align our operations with US business hours for seamless real-time collaboration.', i: <Clock /> },
              { t: 'Surgical Implementation', d: 'We don\'t just build tools; we architect outcomes that drive measurable profit.', i: <Target /> }
            ].map((item, idx) => (
              <div key={idx} className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-emerald-500 transition-all text-left group shadow-sm hover:shadow-xl">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">{item.i}</div>
                <h4 className="text-2xl font-black mb-4">{item.t}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">Proven Results</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Real Clients. Real Numbers.</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {CASE_STUDIES.slice(0, 2).map((cs) => (
              <div key={cs.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={cs.image} alt={cs.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{cs.industry}</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-xl font-black text-slate-900 mb-3">{cs.title}</h4>
                  <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed flex-1">{cs.challengeShort}</p>
                  {cs.testimonial && (
                    <div className="border-t border-slate-100 pt-6 mt-auto">
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: cs.testimonial.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-700 font-semibold italic text-sm mb-3">"{cs.testimonial.quote}"</p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">, {cs.testimonial.author}, {cs.testimonial.title} @ {cs.testimonial.company}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/resources/read/${cs.slug}`)}
                    className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-sm hover:gap-3 transition-all"
                  >
                    Read Full Case Study <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/case-studies')}
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 font-black rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm uppercase tracking-wider"
            >
              View All Success Stories
            </button>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">Knowledge Hub</h2>
              <h3 className="text-4xl font-black text-slate-900">Latest Automation Insights</h3>
            </div>
            <button
              onClick={() => navigate('/resources/blog')}
              className="flex items-center gap-2 text-slate-500 font-black text-sm hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              All Articles <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <div key={post.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all overflow-hidden">
                <div className="h-44 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 self-start">{post.category}</span>
                  <h4 className="font-black text-slate-900 mb-3 leading-snug flex-1">{post.title}</h4>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-medium">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                      <Clock size={12} /> {post.readTime}
                    </div>
                    <button
                      onClick={() => navigate(`/resources/read/${post.slug}`)}
                      className="text-emerald-600 font-black text-xs flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">FAQ</h2>
            <h3 className="text-4xl font-black text-slate-900">Common Questions</h3>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-black text-slate-900 pr-4">{item.q}</span>
                  <ChevronDown size={18} className={`text-emerald-500 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed text-sm">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">Direct Revenue Lift</h2>
            <h3 className="text-4xl font-black text-slate-900">Calculate Your Automation ROI</h3>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600 blur-[180px] opacity-15 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Stop Leaking Revenue
          </div>
          <h2 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Ready to Deploy Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">AI Infrastructure?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 font-medium max-w-xl mx-auto">
            Join 50+ businesses that eliminated manual work and unlocked scalable growth with custom AI systems.
          </p>
          <button
            onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: 'FinalCTA', label: 'Book Free Audit' }); navigate('/contact'); }}
            className="px-12 py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl hover:bg-emerald-500 transition-all inline-flex items-center gap-3 text-lg"
          >
            Book Your Free Audit <ArrowRight size={22} />
          </button>
        </div>
      </section>
    </>
  );
};

const ArticleReader = ({ post, onBack }: { post: any, onBack: () => void }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold uppercase tracking-widest text-xs mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Hub
        </button>

        <div className="mb-12">
          <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-4 block">{post.category || 'Insight'}</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
             <div className="flex items-center gap-2"><Users size={16} /> {post.author || 'AI Data House Team'}</div>
             <div className="flex items-center gap-2"><Clock size={16} /> {post.readTime || '5 min'} read</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> {post.date}</div>
          </div>
        </div>

        <div className="prose prose-lg prose-slate max-w-none">
          <div className="rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
          </div>

          {post.content && <p className="text-xl leading-relaxed text-slate-600 mb-8 font-medium">{post.content}</p>}

          {post.customHtml && (
            <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 my-12" dangerouslySetInnerHTML={{ __html: post.customHtml }} />
          )}

          <div className="mt-16">
            <LeadForm
              title="Request a Custom Tool Audit"
              actionType={ACTIONS.AUDIT}
              buttonText="Generate Comparison"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HubPageReader = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = useMemo(() =>
    [...BLOG_POSTS, ...CASE_STUDIES].find((p: any) => p.slug === slug),
    [slug]
  );

  // This legacy reader path duplicates the canonical /resources/:slug and
  // /case-studies/:slug pages. Mark it noindex so it does not compete in search
  // (see SEO_AUDIT_BACKLOG item 9).
  const p = post as any;
  useSeo({
    title: p ? `${p.title} | AI Data House` : 'Resource | AI Data House',
    description: p?.excerpt || p?.challengeShort || 'AI Data House resource.',
    path: `/resources/read/${slug || ''}`,
    noindex: true,
  });

  if (!post) return <Navigate to="/resources" replace />;
  return <ArticleReader post={post} onBack={() => navigate('/resources')} />;
};

const HubPage = ({ subTab }: { subTab: string }) => {
  const navigate = useNavigate();

  const TAB_ROUTES: Record<string, string> = {
    'all': '/resources',
    'blog': '/resources/blog',
    'case-study': '/case-studies',
    'calculator': '/tools',
    'resource': '/resources',
  };

  const filtered = useMemo(() => {
    if (subTab === 'all') return [...CASE_STUDIES, ...BLOG_POSTS];
    if (subTab === 'case-study') return CASE_STUDIES;
    if (subTab === 'blog') return BLOG_POSTS;
    return [];
  }, [subTab]);

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
           <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">The AI <span className="text-emerald-600">Intelligence Node.</span></h1>
           <div className="flex flex-wrap gap-3">
              {HUB_CATEGORIES.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(TAB_ROUTES[cat.id] || '/resources')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${subTab === cat.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {cat.label}
                </button>
              ))}
           </div>
        </div>

        {/* The 'calculator' tab now navigates out to /tools, so this page only
            ever renders the knowledge list. */}
        <div>
            {filtered.length === 0 ? (
                 <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
                     <p className="text-slate-400 font-bold">No items found in this category yet.</p>
                     <button onClick={() => navigate('/resources')} className="mt-4 text-emerald-600 font-bold underline">View All Knowledge</button>
                 </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map((item: any) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/resources/read/${item.slug}`)}
                        className="group cursor-pointer bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="h-64 relative overflow-hidden">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                            <span className="absolute top-6 left-6 px-4 py-2 bg-white/95 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600">{item.id.startsWith('cs') ? 'Success Story' : 'Automation Guide'}</span>
                        </div>
                        <div className="p-10">
                            <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">{item.challengeShort || item.excerpt}</p>
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-emerald-600 transition-colors">Analyze Outcome <ArrowRight size={16} /></button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const SolutionsIndexPage = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'AI Automation Solutions for US Businesses | AI Data House',
    description: 'Workflow automation, AI chatbots, AI voice agents, internal web apps, CRM automation, and live dashboards. Pick the system your business needs.',
    path: '/solutions',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }]),
  });
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">What We Build</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">Solutions for every part of your operation.</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">Six core systems. We build around the tools you already use, in phases, starting with the highest-ROI workflow first.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((s) => (
            <button key={s.slug} onClick={() => navigate(`/solutions/${s.slug}`)} className="group text-left bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <div className="h-44 overflow-hidden"><img src={s.image} alt={s.navLabel} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-7 flex flex-col flex-1">
                <h2 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{s.navLabel}</h2>
                <p className="text-slate-500 font-medium text-sm mb-5 flex-1">{s.hero.sub}</p>
                <span className="flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:gap-3 transition-all">Explore <ArrowRight size={16} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const IndustriesIndexPage = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'AI Automation by Industry | AI Data House',
    description: 'AI automation built for real estate, e-commerce, marketing agencies, restaurants, and professional services. See exactly what we build for your industry.',
    path: '/industries',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }]),
  });
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">By Industry</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">We know how your industry actually runs.</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">The same engine, mapped to the workflows, tools, and numbers specific to your business.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES.map((i) => (
            <button key={i.slug} onClick={() => navigate(`/industries/${i.slug}`)} className="group text-left bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <div className="h-44 overflow-hidden"><img src={i.image} alt={i.navLabel} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-7 flex flex-col flex-1">
                <h2 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{i.navLabel}</h2>
                <p className="text-slate-500 font-medium text-sm mb-5 flex-1">{i.hero.headline}</p>
                <span className="flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:gap-3 transition-all">See what we build <ArrowRight size={16} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lightweight loading state shown while a code-split chunk is fetched.
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white" role="status" aria-label="Loading">
    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
    // SPA page view: fire on initial load and every route change.
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Special full-screen routes (no header/footer). Lazy-loaded under Suspense.
  if (location.pathname === '/dashboard') return <Suspense fallback={<RouteFallback />}><JobDashboard /></Suspense>;
  if (location.pathname === '/solutions/restaurant-ai') return <Suspense fallback={<RouteFallback />}><RestaurantAgent /></Suspense>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePageNew />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Solutions */}
          <Route path="/solutions" element={<SolutionsIndexPage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />

          {/* Industries */}
          <Route path="/industries" element={<IndustriesIndexPage />} />
          <Route path="/industries/:slug" element={<IndustryPage />} />

          {/* Tools */}
          <Route path="/tools" element={<ToolsIndexPage />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          {/* The calculators used to live here. Vercel 301s this at the edge
              (see vercel.json); this keeps the SPA correct for in-app links and
              for any host that does not apply those redirects. */}
          <Route path="/resources/roi-calculator" element={<Navigate to="/tools" replace />} />

          {/* Resources / Blog */}
          <Route path="/resources" element={<HubPage subTab="all" />} />
          <Route path="/resources/blog" element={<BlogIndexPage />} />
          {/* Static segments outrank /resources/:slug, so this cannot be
              swallowed by the post route below. */}
          <Route path="/resources/blog/submit" element={<BlogSubmitPage />} />
          <Route path="/resources/read/:slug" element={<HubPageReader />} />
          <Route path="/resources/:slug" element={<BlogPostPage />} />

          {/* Case Studies */}
          <Route path="/case-studies" element={<CaseStudyIndexPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />

          {/* Commercial landing pages (bottom-funnel "hire us" intent) */}
          <Route path="/ai-automation-agency" element={<CommercialPage slug="ai-automation-agency" />} />
          <Route path="/hire-n8n-developer" element={<CommercialPage slug="hire-n8n-developer" />} />
          <Route path="/ai-chatbot-development-company" element={<CommercialPage slug="ai-chatbot-development-company" />} />

          {/* Legal */}
          <Route path="/security" element={<LegalPage kind="security" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />

          {/* Catch-all → real 404 so broken links surface instead of silently redirecting */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default App;
