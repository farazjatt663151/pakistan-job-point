import type { JobListing } from '../types/job';

interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  job?: JobListing | null;
}

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function applySeoMetadata({ title, description, canonicalPath, job }: SeoConfig): void {
  document.title = title;

  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  const origin = window.location.origin;
  const path = canonicalPath ?? window.location.pathname;
  const canonicalUrl = `${origin}${path}`;

  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  const schemaScript = document.getElementById('pjp-structured-data');
  if (schemaScript) {
    if (job) {
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.postedDate,
        validThrough: job.deadline,
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          '@type': 'Organization',
          name: job.department,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.city,
            addressCountry: 'PK',
          },
        },
        educationRequirements: job.education,
        url: canonicalUrl,
      });
    } else {
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Pakistan Job Point',
        url: origin,
        description,
      });
    }
  }
}
