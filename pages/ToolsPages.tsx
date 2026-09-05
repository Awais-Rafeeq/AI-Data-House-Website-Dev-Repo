import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, PhoneCall, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TOOLS, getTool, type Tool, type ToolIconKey } from '../data/tools';
import AutomationRoiCalculator from '../components/tools/AutomationRoiCalculator';
import AiCallingRoiCalculator from '../components/tools/AiCallingRoiCalculator';
import { useSeo, breadcrumbJsonLd } from '../lib/seo';

// The two registries that turn a data entry into a real page. Adding a tool is:
// one entry in data/tools.ts, one icon here, one component here. Nothing else —
// the hub, the route and the prerendered <head> all derive from the data.
const TOOL_ICONS: Record<ToolIconKey, LucideIcon> = {
  workflow: Workflow,
  calling: PhoneCall,
};

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'automation-roi-calculator': AutomationRoiCalculator,
  'ai-calling-roi-calculator': AiCallingRoiCalculator,
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">{children}</p>
);

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="w-14 h-14 flex-none rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all">
          <Icon className="w-6 h-6" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{tool.category}</span>
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
        {tool.title}
      </h3>
      <p className="text-slate-500 font-medium leading-relaxed mb-7">{tool.description}</p>

      <ul className="space-y-3 mb-9">
        {tool.outputs.map((output) => (
          <li key={output} className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
            <Check className="w-4 h-4 mt-0.5 flex-none text-emerald-500" aria-hidden="true" />
            {output}
          </li>
        ))}
      </ul>

      <span className="mt-auto inline-flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:gap-3 transition-all">
        Open Tool <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
};

export const ToolsIndexPage: React.FC = () => {
  useSeo({
    title: 'Free AI & Automation Tools | AI Data House',
    description:
      'Free, practical tools from AI Data House: ROI calculators that show what manual work and missed calls cost you, and what automation would return.',
    path: '/tools',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]),
  });

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <Eyebrow>Tools</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.05]">
            Practical tools to calculate, plan, and make better decisions.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Free tools from AI Data House, built from the same numbers we use in client audits.
            No signup, no email gate — get a real figure in under a minute, then decide whether
            automation is worth a conversation.
          </p>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Explore our tools</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = getTool(slug);
  const Calculator = tool ? TOOL_COMPONENTS[tool.slug] : undefined;

  // A slug that is in the data but has no component registered would render a
  // blank page, so treat it the same as an unknown slug and send them to the hub.
  useSeo({
    title: tool?.seoTitle || 'Tools | AI Data House',
    description: tool?.seoDescription || 'Free, practical tools from AI Data House.',
    path: `/tools/${slug || ''}`,
    image: '/images/og/og-solutions.png',
    jsonLd: tool
      ? breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: tool.title, path: `/tools/${tool.slug}` },
        ])
      : undefined,
    noindex: !tool,
  });

  if (!tool || !Calculator) return <Navigate to="/tools" replace />;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold uppercase tracking-widest text-xs mb-10 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Tools
        </Link>

        <div className="max-w-3xl mb-12">
          <Eyebrow>{tool.category}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-[1.08]">
            {tool.title}
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">{tool.description}</p>
        </div>

        <Calculator />

        <p className="max-w-3xl mt-8 text-sm text-slate-400 font-medium leading-relaxed">
          Estimates only. The figures use your own inputs and the assumptions we see most often in
          audits — treat them as a starting point for a conversation, not a quote.
        </p>
      </div>
    </div>
  );
};
