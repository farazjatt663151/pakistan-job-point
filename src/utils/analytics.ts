export const GA_MEASUREMENT_ID = 'G-7W5STX55GH';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: string]: unknown;
  }
}

let lastTrackedPath = '';
let lastTrackedTimestamp = 0;

/**
 * Normalizes a route path and strips query strings/hashes so no search terms
 * or form parameters are ever sent to analytics.
 */
function normalizePathname(pathname: string): string {
  const pathOnly = pathname.split('?')[0].split('#')[0] || '/';
  return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
}

/**
 * Excludes all admin-only routes from Google Analytics tracking.
 */
export function isAdminAnalyticsExcluded(pathname: string): boolean {
  const cleanPath = normalizePathname(pathname);
  return cleanPath === '/admin' || cleanPath.startsWith('/admin/');
}

/**
 * Updates the global GA disable flag for admin routes and dispatches a single
 * clean SPA page_view event for public pages.
 */
export function trackPageView(pathname: string, pageTitle: string): void {
  if (typeof window === 'undefined') return;

  const cleanPath = normalizePathname(pathname);
  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}`;
  const excluded = isAdminAnalyticsExcluded(cleanPath);

  window[disableKey] = excluded;

  if (excluded) {
    return;
  }

  const now = Date.now();
  if (lastTrackedPath === cleanPath && now - lastTrackedTimestamp < 500) {
    return;
  }
  lastTrackedPath = cleanPath;
  lastTrackedTimestamp = now;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: cleanPath,
      page_location: `${window.location.origin}${cleanPath}`,
    });
  }
}
