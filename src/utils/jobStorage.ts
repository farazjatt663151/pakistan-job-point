import { DEMO_JOBS } from '../data/demoJobs';
import type { JobListing } from '../types/job';
import { sanitizeExternalUrl, slugify } from './security';

const STORAGE_KEY = 'pjp_jobs_v1';
const LOCAL_OVERRIDE_KEY = 'pjp_jobs_local_override_v1';

export function validateJobArray(raw: unknown): JobListing[] {
  if (!Array.isArray(raw)) return [];
  const valid: JobListing[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    if (
      typeof obj.id !== 'string' ||
      typeof obj.title !== 'string' ||
      typeof obj.department !== 'string'
    ) {
      continue;
    }

    const safeUrl = sanitizeExternalUrl(String(obj.officialApplyUrl || '')) ?? 'https://example.com';

    valid.push({
      id: obj.id,
      slug: typeof obj.slug === 'string' && obj.slug ? obj.slug : slugify(obj.title),
      title: obj.title,
      category: obj.category === 'Private' ? 'Private' : 'Government',
      department: obj.department,
      city: (typeof obj.city === 'string' ? obj.city : 'Other Cities') as JobListing['city'],
      education: (typeof obj.education === 'string'
        ? obj.education
        : 'Bachelor') as JobListing['education'],
      salary: typeof obj.salary === 'string' ? obj.salary : 'Market Competitive',
      ageLimit: typeof obj.ageLimit === 'string' ? obj.ageLimit : '18 – 35 Years',
      vacancies: typeof obj.vacancies === 'number' && obj.vacancies > 0 ? obj.vacancies : 1,
      deadline: typeof obj.deadline === 'string' ? obj.deadline : '2026-12-31',
      postedDate: typeof obj.postedDate === 'string' ? obj.postedDate : '2026-11-23',
      description: typeof obj.description === 'string' ? obj.description : '',
      applicationProcedure: Array.isArray(obj.applicationProcedure)
        ? obj.applicationProcedure.filter((s): s is string => typeof s === 'string')
        : [],
      officialApplyUrl: safeUrl,
      isDemo: Boolean(obj.isDemo),
      featured: Boolean(obj.featured),
    });
  }

  return valid;
}

export function getInitialJobs(): JobListing[] {
  try {
    const hasOverride = localStorage.getItem(LOCAL_OVERRIDE_KEY) === 'true';
    const raw = localStorage.getItem(STORAGE_KEY);
    if (hasOverride && raw) {
      const parsed = validateJobArray(JSON.parse(raw));
      if (parsed.length > 0 || raw.trim() === '[]') {
        return parsed;
      }
    }
  } catch {
    // Fallback cleanly to built-in demo dataset
  }
  return DEMO_JOBS;
}

export async function fetchPublishedJobs(): Promise<JobListing[] | null> {
  try {
    const hasOverride = localStorage.getItem(LOCAL_OVERRIDE_KEY) === 'true';
    if (hasOverride) return null;

    const response = await fetch('/data/jobs.json', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    const validated = validateJobArray(data);
    return validated.length > 0 ? validated : null;
  } catch {
    return null;
  }
}

export function saveJobsToLocalWorkspace(jobs: JobListing[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  localStorage.setItem(LOCAL_OVERRIDE_KEY, 'true');
}

export function resetWorkspaceToDefault(): JobListing[] {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LOCAL_OVERRIDE_KEY);
  return DEMO_JOBS;
}

export function hasLocalWorkspaceOverrides(): boolean {
  return localStorage.getItem(LOCAL_OVERRIDE_KEY) === 'true';
}
