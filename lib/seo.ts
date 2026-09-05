import { useEffect } from 'react';

const SITE = 'https://www.aidatahouse.com';
const DEFAULT_OG = `${SITE}/images/og/og-homepage.png`;

type JsonLd = Record<string, any> | Record<string, any>[];

interface SeoOptions {
  title: string;
  description: string;
  path: string;           // e.g. "/solutions/ai-chatbots"
  image?: string;         // absolute or root-relative
  type?: 'website' | 'article';
  jsonLd?: JsonLd;
  noindex?: boolean;      // emit robots noindex (e.g. 404 page)
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Client-side per-page SEO. Sets title, description, canonical, Open Graph,
 * Twitter tags, and an optional JSON-LD block. Cleans up the JSON-LD on unmount
 * so structured data never leaks between routes.
 */
export function useSeo({ title, description, path, image, type = 'website', jsonLd, noindex = false }: SeoOptions) {
  useEffect(() => {
    const url = `${SITE}${path}`;
    const img = image
      ? (image.startsWith('http') ? image : `${SITE}${image}`)
      : DEFAULT_OG;

    document.title = title;
    setMeta('name', 'description', description);
    // Always set robots so a noindex page (e.g. 404) cannot leak into the next route.
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setLink('canonical', url);

    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', img);

    setMeta('property', 'twitter:card', 'summary_large_image');
    setMeta('property', 'twitter:url', url);
    setMeta('property', 'twitter:title', title);
    setMeta('property', 'twitter:description', description);
    setMeta('property', 'twitter:image', img);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'route');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)]);
}

export const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AI Data House',
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  description:
    'AI Data House builds workflow automations, AI agents, internal web apps, and dashboards that replace manual operations for US businesses.',
  sameAs: [
    'https://youtube.com/@aidatahouse',
    'https://linkedin.com/company/aidatahouse',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Islamabad',
    addressCountry: 'PK',
  },
};

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    description,
    url: `${SITE}${path}`,
    provider: { '@type': 'Organization', name: 'AI Data House', url: SITE },
    areaServed: { '@type': 'Country', name: 'United States' },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}

export function articleJsonLd(opts: { title: string; description: string; path: string; image: string; author: string; datePublished: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    image: opts.image.startsWith('http') ? opts.image : `${SITE}${opts.image}`,
    author: { '@type': 'Person', name: opts.author },
    publisher: { '@type': 'Organization', name: 'AI Data House', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
    datePublished: opts.datePublished,
    mainEntityOfPage: `${SITE}${opts.path}`,
  };
}
