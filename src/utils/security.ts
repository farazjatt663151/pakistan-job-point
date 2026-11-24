/**
 * Validates and sanitizes external URLs to block unsafe protocols
 * such as javascript:, data:, or vbscript:.
 */
export function sanitizeExternalUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates an SEO-friendly lowercase URL slug.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\[demo\]/gi, 'demo')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Generates a cryptographically random hex salt for client-side vault hashing.
 */
export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes a salted SHA-256 digest via Web Crypto API.
 * Used so no plaintext passcode is ever stored or hardcoded in source files.
 */
export async function hashPasscode(passcode: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${passcode}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
