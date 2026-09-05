
import React from 'react';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  setupTime: string;
  downloads: string;
  rating: string;
  tool: 'n8n' | 'Make' | 'GHL' | 'GAS' | 'AI';
  tags: string[];
  image: string;
  pdfLink: string;
  videoLink: string;
  templateLink: string;
  downloadUrl?: string; 
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  overviewHeading: string;
  whyMatters: string;
  features: Array<{ title: string; desc: string; icon: React.ReactNode; useCase: string }>;
  howItWorks: Array<{ title: string; desc: string }>;
  useCases: Array<{ industry: string; problem: string; solution: string; outcome: string }>;
  techStack: Array<{ name: string; desc: string }>;
  pricing: string;
  icon: React.ReactNode;
  category: 'primary' | 'additional';
  faqs: Array<{ q: string; a: string }>;
  relatedCaseStudies?: string[];
}

export interface MetricItem {
  label: string;
  value: string;
  sublabel: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  companySize: string;
  duration: string;
  teamSize: string;
  serviceId: string;
  challengeShort: string;
  challengeDetailed: string;
  problemPoints: string[];
  solutionSummary: string;
  solutionComponents: Array<{ title: string; desc: string; icon: React.ReactNode }>;
  timeline: Array<{ label: string; duration: string }>;
  workflowDiagram?: string[];
  resultsTable: Array<{ metric: string; before: string; after: string; improvement: string }>;
  metricsOverview: Array<{ label: string; value: string; icon: React.ReactNode }>;
  testimonial: { quote: string; author: string; title: string; company: string; rating: number };
  image: string;
  techStack: string[];
  downloadUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Used for standard markdown-style content
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  contentFormat?: 'markdown' | 'html'; // Distinguish between content types
  customHtml?: string; // For raw HTML layouts like the pricing comparison
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// ─── Job Dashboard Types ───────────────────────────────────────────────────

export interface ViewCondition {
  keywords?: string[];        // OR logic: matches Title | Description | Skills
  niches?: string[];          // e.g. ['ai', 'automation']
  minScore?: number;
  paymentCat?: 'Fixed' | 'Hourly';
  minClientSpending?: number;
}

export interface GlobalCondition {
  countries?: string[];       // e.g. ['United States', 'USA', 'Canada']
  minClientRating?: number;
  paymentVerified?: boolean;
}

export interface JobView {
  id: string;
  profile_id: string;
  name: string;
  conditions: ViewCondition;
  color: string;
  position: number;
  last_seen_at: string;
  created_at: string;
}

export interface UpworkJob {
  'Job Link': string;
  Title: string;
  Niche: string;
  Country: string;
  'Payment Cat': string;
  'Payment Amount': string;
  Score: number;
  'Client Rating': number;
  'Client Spending Value': number;
  'Posted On': string;
  Favourite: boolean;
  Description: string;
  Skills: string;
  Experience: string;
  'Hours/Week': string;
  Duration: string;
  'Payment Verified': string;
  'Positive KWs': string;
  'Negative KWs': string;
}

export interface DateRange {
  start: Date;
  end: Date;
  preset: 'today' | 'yesterday' | '7d' | '30d' | '3m' | 'year' | 'all' | 'custom';
}

export interface KPIData {
  total: number;
  today: number;
  avgPerDay: number;
  highScorePercent: number;
  favourites: number;
}

export interface DailyPoint {
  day: string;
  count: number;
}

export interface HeatmapCell {
  dow: number;
  hour: number;
  count: number;
}

export interface MonthlyPoint {
  month: string;
  count: number;
}

export interface NichePoint {
  niche: string;
  count: number;
}

export interface CountryPoint {
  country: string;
  count: number;
}
