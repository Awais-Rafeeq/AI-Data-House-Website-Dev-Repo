// Real Shorts from the AI Data House YouTube channel:
// https://www.youtube.com/@aidatahouse/shorts
//
// IDs and titles were read off the live channel — none are invented. Titles are
// reproduced as published, minus the trailing "#Shorts" hashtag some carry.
// `topic` is our own one-word grouping for the card, not a claim about the video.
//
// Thumbnails use YouTube's `oar2.jpg`, which is the true 1080x1920 vertical
// frame for a Short (`hqdefault` is a 16:9 crop and would pillarbox).

export interface Reel {
  id: string;
  title: string;
  topic: string;
}

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@aidatahouse/shorts';

export const reelThumb = (id: string) => `https://i.ytimg.com/vi/${id}/oar2.jpg`;
export const reelEmbed = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
export const reelWatch = (id: string) => `https://www.youtube.com/shorts/${id}`;

export const REELS: Reel[] = [
  { id: 'KBn-Xeo8IOs', title: '90% of Our Clients Still Prefer n8n', topic: 'Automation' },
  { id: 'dpwTdWtaqtw', title: '300 Leads a Day? Cloud AI Will Burn Your Money', topic: 'Lead gen' },
  { id: 'altaWonLBxI', title: 'What Turns a Scraped Email Into a Qualified Lead?', topic: 'Lead gen' },
  { id: 'VP76c7cRbBk', title: 'Do Not Automate Customer Chats on Day One', topic: 'AI support' },
  { id: '1moOoGIE4ec', title: 'Your Bank Logins Are Still On a Google Sheet', topic: 'Operations' },
  { id: 'tOR5__i72wc', title: 'AI Avatar Ads Got Engagement and Zero Real Business', topic: 'Marketing' },
  { id: 'kh88kI1RHOk', title: 'Build Your Brand Where Coke and Pepsi Are Absent', topic: 'Marketing' },
  { id: 'FT2SYT75cl0', title: 'Grok Bot Went From $200 to $20. I Tested 10 Jobs', topic: 'AI tooling' },
  { id: 'ixuMmQXik10', title: 'Stop Claude Code Hallucinations at 40% Context', topic: 'AI tooling' },
  { id: 'W597DPomm2s', title: 'Grok Bot vs OpenClaw & Hermes: My First Test', topic: 'AI tooling' },
];
