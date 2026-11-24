import { ArrowRight, Building2, GraduationCap, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdSenseSlot } from './components/AdSenseSlot';
import { AdminDashboard } from './components/AdminDashboard';
import { CitiesOverviewPage } from './components/CitiesOverviewPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { JobDetailView } from './components/JobDetailView';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ShareButtons } from './components/ShareButtons';
import { StaticPages } from './components/StaticPages';
import {
  EDUCATION_LEVELS,
  MAJOR_CITIES,
  type CityName,
  type EducationLevel,
  type JobFilters,
  type JobListing,
} from './types/job';
import {
  fetchPublishedJobs,
  getInitialJobs,
  resetWorkspaceToDefault,
  saveJobsToLocalWorkspace,
} from './utils/jobStorage';
import { applySeoMetadata } from './utils/seo';

const DEFAULT_FILTERS: JobFilters = {
  query: '',
  category: 'All',
  city: 'All',
  education: 'All',
  sortBy: 'latest',
};

function parseCityFromSlug(slug: string): CityName | 'All' {
  const normalized = slug.toLowerCase().replace(/-/g, ' ');
  const found = MAJOR_CITIES.find((c) => c.toLowerCase() === normalized);
  return found ?? 'All';
}

function parseEducationFromSlug(slug: string): EducationLevel | 'All' {
  const normalized = slug.toLowerCase();
  const found = EDUCATION_LEVELS.find((e) => e.toLowerCase() === normalized);
  return found ?? 'All';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [jobs, setJobs] = useState<JobListing[]>(() => getInitialJobs());
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [heroImageError, setHeroImageError] = useState(false);

  // Sync with published /data/jobs.json if no local admin edits exist
  useEffect(() => {
    let active = true;
    fetchPublishedJobs().then((remoteJobs) => {
      if (active && remoteJobs) {
        setJobs(remoteJobs);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync filters whenever route changes to category/city/education SEO URLs
  useEffect(() => {
    if (currentPath === '/jobs/government') {
      setFilters({ ...DEFAULT_FILTERS, category: 'Government' });
    } else if (currentPath === '/jobs/private') {
      setFilters({ ...DEFAULT_FILTERS, category: 'Private' });
    } else if (currentPath.startsWith('/jobs/city/')) {
      const citySlug = currentPath.replace('/jobs/city/', '').split('/')[0];
      setFilters({ ...DEFAULT_FILTERS, city: parseCityFromSlug(citySlug) });
    } else if (currentPath.startsWith('/jobs/education/')) {
      const eduSlug = currentPath.replace('/jobs/education/', '').split('/')[0];
      setFilters({ ...DEFAULT_FILTERS, education: parseEducationFromSlug(eduSlug) });
    } else if (currentPath === '/') {
      setFilters(DEFAULT_FILTERS);
    }
  }, [currentPath]);

  // Browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (window.location.pathname !== cleanPath) {
      window.history.pushState({}, '', cleanPath);
    }
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openJobDetail = useCallback(
    (slug: string) => {
      navigate(`/job/${slug}`);
    },
    [navigate]
  );

  // Active Job Detail resolution
  const activeJob = useMemo(() => {
    if (!currentPath.startsWith('/job/')) return null;
    const slug = currentPath.replace('/job/', '').split('/')[0];
    return jobs.find((j) => j.slug === slug) ?? null;
  }, [currentPath, jobs]);

  // Dynamic SEO Metadata & JSON-LD
  useEffect(() => {
    if (activeJob) {
      applySeoMetadata({
        title: `${activeJob.title} – Pakistan Job Point`,
        description: `${activeJob.department} in ${activeJob.city}. Qualification: ${activeJob.education}. Deadline: ${activeJob.deadline}.`,
        canonicalPath: `/job/${activeJob.slug}`,
        job: activeJob,
      });
      return;
    }

    if (currentPath === '/jobs/government') {
      applySeoMetadata({
        title: 'Government Jobs in Pakistan – Pakistan Job Point',
        description:
          'Browse latest federal and provincial Government job listings across Pakistan by city and education.',
      });
    } else if (currentPath === '/jobs/private') {
      applySeoMetadata({
        title: 'Private Sector Jobs in Pakistan – Pakistan Job Point',
        description:
          'Discover verified private company careers across Karachi, Lahore, Islamabad, and major cities.',
      });
    } else if (currentPath.startsWith('/jobs/city/')) {
      const city = parseCityFromSlug(currentPath.replace('/jobs/city/', ''));
      const cityLabel = city === 'All' ? 'Pakistan' : city;
      applySeoMetadata({
        title: `Latest Jobs in ${cityLabel} – Pakistan Job Point`,
        description: `Search verified Government and Private vacancies in ${cityLabel} by qualification and deadline.`,
      });
    } else if (currentPath.startsWith('/jobs/education/')) {
      const edu = parseEducationFromSlug(currentPath.replace('/jobs/education/', ''));
      const eduLabel = edu === 'All' ? 'All Qualifications' : edu;
      applySeoMetadata({
        title: `${eduLabel} Pass Jobs in Pakistan – Pakistan Job Point`,
        description: `Find current Government and Private jobs for ${eduLabel} degree and certificate holders in Pakistan.`,
      });
    } else if (currentPath === '/about') {
      applySeoMetadata({
        title: 'About Us – Pakistan Job Point',
        description:
          'Learn how Pakistan Job Point curates verified public and private employment notices across Pakistan.',
      });
    } else if (currentPath === '/contact') {
      applySeoMetadata({
        title: 'Contact Us – Pakistan Job Point',
        description:
          'Contact Pakistan Job Point to submit verified job notices or report listing updates.',
      });
    } else if (currentPath === '/privacy-policy') {
      applySeoMetadata({
        title: 'Privacy Policy – Pakistan Job Point',
        description: 'Read the Pakistan Job Point privacy, cookie, and Google AdSense policy.',
      });
    } else if (currentPath === '/disclaimer') {
      applySeoMetadata({
        title: 'Disclaimer – Pakistan Job Point',
        description: 'Official informational disclaimer and applicant safety guidelines.',
      });
    } else if (currentPath === '/terms-and-conditions') {
      applySeoMetadata({
        title: 'Terms & Conditions – Pakistan Job Point',
        description: 'Terms and conditions for using Pakistan Job Point.',
      });
    } else if (currentPath === '/admin') {
      applySeoMetadata({
        title: 'Admin Panel – Pakistan Job Point',
        description: 'Manage job listings for Pakistan Job Point.',
      });
    } else if (currentPath === '/cities') {
      applySeoMetadata({
        title: 'Jobs by City & Qualification – Pakistan Job Point',
        description:
          'Explore jobs across Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, and all education levels.',
      });
    } else {
      applySeoMetadata({
        title: 'Pakistan Job Point – Latest Government & Private Jobs in Pakistan',
        description:
          'Explore verified Government and Private sector jobs in Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta and across Pakistan by education level.',
      });
    }
  }, [currentPath, activeJob]);

  // Filtered and Sorted Listings
  const filteredJobs = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const list = jobs.filter((job) => {
      if (filters.category !== 'All' && job.category !== filters.category) {
        return false;
      }
      if (filters.city !== 'All' && job.city !== filters.city) {
        return false;
      }
      if (filters.education !== 'All' && job.education !== filters.education) {
        return false;
      }
      if (q) {
        const haystack =
          `${job.title} ${job.department} ${job.city} ${job.education} ${job.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (filters.sortBy === 'vacancies') {
        return b.vacancies - a.vacancies;
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return b.postedDate.localeCompare(a.postedDate);
    });
  }, [jobs, filters]);

  const recentlyAddedJobs = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => b.postedDate.localeCompare(a.postedDate))
        .slice(0, 6),
    [jobs]
  );

  const handleSaveJobs = (nextJobs: JobListing[]) => {
    setJobs(nextJobs);
    saveJobsToLocalWorkspace(nextJobs);
  };

  const handleResetDemo = () => {
    const defaults = resetWorkspaceToDefault();
    setJobs(defaults);
  };

  const relatedJobs = useMemo(() => {
    if (!activeJob) return [];
    return jobs
      .filter(
        (j) =>
          j.id !== activeJob.id &&
          (j.category === activeJob.category || j.city === activeJob.city)
      )
      .slice(0, 3);
  }, [jobs, activeJob]);

  // Determine Dynamic Page Heading for Listing Views
  const listingHeading = useMemo(() => {
    if (currentPath === '/jobs/government') return 'Government Jobs in Pakistan';
    if (currentPath === '/jobs/private') return 'Private Sector Jobs in Pakistan';
    if (currentPath.startsWith('/jobs/city/')) {
      const c = parseCityFromSlug(currentPath.replace('/jobs/city/', ''));
      return c === 'All' ? 'Jobs Across Pakistan' : `Latest Jobs in ${c}`;
    }
    if (currentPath.startsWith('/jobs/education/')) {
      const e = parseEducationFromSlug(currentPath.replace('/jobs/education/', ''));
      return e === 'All' ? 'Jobs by Education' : `${e} Pass Jobs in Pakistan`;
    }
    return 'Latest Jobs in Pakistan';
  }, [currentPath]);

  const isListingRoute =
    currentPath === '/' ||
    currentPath === '/jobs/government' ||
    currentPath === '/jobs/private' ||
    currentPath.startsWith('/jobs/city/') ||
    currentPath.startsWith('/jobs/education/');

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FAF8] text-[#0D1913]">
      <Header currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {/* Route: Job Detail */}
        {currentPath.startsWith('/job/') && (
          activeJob ? (
            <JobDetailView
              job={activeJob}
              relatedJobs={relatedJobs}
              onNavigate={navigate}
              onOpenJob={openJobDetail}
            />
          ) : (
            <div className="mx-auto max-w-[720px] px-4 py-16 text-center">
              <h1 className="font-display text-2xl font-bold text-[#0B1611]">
                Job Listing Not Found
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                This vacancy may have expired or been removed by an administrator.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Return to Latest Jobs
              </button>
            </div>
          )
        )}

        {/* Route: Cities Overview */}
        {currentPath === '/cities' && (
          <CitiesOverviewPage jobs={jobs} onNavigate={navigate} />
        )}

        {/* Route: Static & Legal Pages */}
        {currentPath === '/about' && <StaticPages page="about" onNavigate={navigate} />}
        {currentPath === '/contact' && <StaticPages page="contact" onNavigate={navigate} />}
        {currentPath === '/privacy-policy' && (
          <StaticPages page="privacy" onNavigate={navigate} />
        )}
        {currentPath === '/disclaimer' && (
          <StaticPages page="disclaimer" onNavigate={navigate} />
        )}
        {currentPath === '/terms-and-conditions' && (
          <StaticPages page="terms" onNavigate={navigate} />
        )}

        {/* Route: Admin Dashboard */}
        {currentPath === '/admin' && (
          <AdminDashboard
            jobs={jobs}
            onSaveJobs={handleSaveJobs}
            onResetDemo={handleResetDemo}
            onOpenJob={openJobDetail}
          />
        )}

        {/* Route: Homepage & Filtered Job Listings */}
        {isListingRoute && (
          <>
            {/* Hero Section (Full Presence on Homepage, Focused Header on Sub-routes) */}
            {currentPath === '/' ? (
              <section className="bg-[#0B1611] text-white border-b border-emerald-900/40">
                <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <p className="text-xs font-semibold text-emerald-300">
                        Pakistan Career Directory · Demo Mode Active
                      </p>
                      <h1 className="mt-3 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white text-balance">
                        Find verified Government and Private jobs across Pakistan.
                      </h1>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                        Search clearly structured listings by city, qualification, department, and application deadline—with direct links to official recruitment portals.
                      </p>
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a
                          href="#job-listings"
                          className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-emerald-500"
                        >
                          Browse Latest Jobs
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={() => navigate('/jobs/government')}
                          className="inline-flex min-h-[46px] items-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-white/10"
                        >
                          Government Sector
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="relative h-64 overflow-hidden rounded-xl border border-white/10 bg-[#10221A] lg:h-full lg:min-h-[300px]">
                        {!heroImageError ? (
                          <>
                            <img
                              src="/src/assets/images/hero_pakistan_careers_1795496047479.jpg"
                              alt="Modern civic and corporate courtyard in Islamabad, Pakistan"
                              referrerPolicy="no-referrer"
                              onError={() => setHeroImageError(true)}
                              className="h-full w-full object-cover"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 bg-gradient-to-t from-[#0B1611]/75 via-[#0B1611]/15 to-transparent"
                            />
                            <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white/95">
                              Nationwide coverage: Islamabad · Karachi · Lahore · Peshawar · Quetta
                            </p>
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-[#0F241A] to-[#08120D] p-6">
                            <p className="font-display text-lg font-bold text-white">
                              Nationwide Coverage
                            </p>
                            <p className="mt-1 text-xs text-emerald-200">
                              Islamabad · Karachi · Lahore · Rawalpindi · Peshawar · Quetta
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Full-width 4-Column KPI Strip Below Hero Split */}
                  <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-slate-400">Active Sample Listings</dt>
                      <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                        {jobs.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Government Posts</dt>
                      <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-300">
                        {jobs.filter((j) => j.category === 'Government').length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Private Openings</dt>
                      <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                        {jobs.filter((j) => j.category === 'Private').length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Total Vacancies</dt>
                      <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                        {jobs.reduce((acc, j) => acc + j.vacancies, 0)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
            ) : (
              <section className="bg-[#0B1611] text-white border-b border-emerald-900/40">
                <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
                  <p className="text-xs font-semibold text-emerald-300">Pakistan Job Point</p>
                  <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {listingHeading}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    Filter by city, education level, and deadline. Click any vacancy for complete eligibility details and the official application link.
                  </p>
                </div>
              </section>
            )}

            {/* Main Job Discovery Workspace */}
            <div id="job-listings" className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
              {/* Demo Notice Strip */}
              {jobs.some((j) => j.isDemo) && (
                <div className="mb-6 rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-xs text-amber-950 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <strong>Demo Testing Content:</strong> Sample vacancies labeled{' '}
                    <code className="font-mono">[DEMO]</code> are included for testing search and filters. Replace them with verified jobs in the Admin Panel.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="font-semibold text-amber-900 underline whitespace-nowrap shrink-0 text-left"
                  >
                    Open Admin Panel
                  </button>
                </div>
              )}

              <SearchFilterBar
                filters={filters}
                totalMatching={filteredJobs.length}
                onChange={setFilters}
                onReset={() => {
                  setFilters(DEFAULT_FILTERS);
                  if (currentPath !== '/') navigate('/');
                }}
              />

              {/* AdSense Top Leaderboard Placement */}
              <AdSenseSlot slotName="Top Directory Leaderboard" format="leaderboard" />

              {/* Quick Filter Shortcuts: Cities & Education */}
              <section aria-label="Quick city and qualification shortcuts" className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                    Cities:
                  </span>
                  {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta'].map(
                    (city) => {
                      const active = filters.city === city;
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              city: prev.city === city ? 'All' : (city as CityName),
                            }))
                          }
                          className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                            active
                              ? 'bg-emerald-700 text-white'
                              : 'border border-emerald-950/15 bg-white text-slate-700 hover:border-emerald-700/50'
                          }`}
                        >
                          {city}
                        </button>
                      );
                    }
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/cities')}
                    className="min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
                  >
                    All Cities →
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                    Education:
                  </span>
                  {EDUCATION_LEVELS.map((edu) => {
                    const active = filters.education === edu;
                    return (
                      <button
                        key={edu}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            education: prev.education === edu ? 'All' : edu,
                          }))
                        }
                        className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                          active
                            ? 'bg-[#0B1611] text-white'
                            : 'border border-emerald-950/15 bg-white text-slate-700 hover:border-emerald-700/50'
                        }`}
                      >
                        {edu}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Main Latest Jobs Grid */}
              <section aria-label="Job search results">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h2 className="font-display text-xl font-bold text-[#0B1611]">
                    {listingHeading}
                  </h2>
                  <ShareButtons title={listingHeading} />
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="rounded-xl border border-emerald-950/10 bg-white p-10 text-center">
                    <Building2
                      className="mx-auto h-8 w-8 text-slate-400"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 font-display text-base font-bold text-[#0B1611]">
                      No matching jobs found
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Try clearing a city or education filter, or search with broader keywords.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="mt-5 inline-flex min-h-[40px] items-center rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      Show All Listings
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} onOpenJob={openJobDetail} />
                    ))}
                  </div>
                )}
              </section>

              {/* In-Feed AdSense Slot */}
              <AdSenseSlot slotName="Mid-Page In-Feed" format="infeed" />

              {/* Recently Added Jobs Section */}
              <section
                aria-label="Recently added jobs"
                className="mt-10 rounded-xl border border-emerald-950/10 bg-white overflow-hidden"
              >
                <div className="flex flex-col gap-2 border-b border-emerald-950/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#0B1611]">
                      Recently Added Jobs
                    </h2>
                    <p className="text-xs text-slate-500">
                      Fast tabular index ordered by most recent publication date.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilters({ ...DEFAULT_FILTERS, sortBy: 'deadline' })}
                    className="text-xs font-semibold text-emerald-800 hover:underline text-left"
                  >
                    Sort by closing soonest →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-emerald-950/10 bg-[#F7FAF8] text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-5 py-3">Position &amp; Department</th>
                        <th className="px-4 py-3">Sector</th>
                        <th className="px-4 py-3">City</th>
                        <th className="px-4 py-3">Education</th>
                        <th className="px-4 py-3 text-right">Posts</th>
                        <th className="px-5 py-3 text-right">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/10">
                      {recentlyAddedJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-[#F7FAF8]">
                          <td className="px-5 py-3.5">
                            <a
                              href={`/job/${job.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                openJobDetail(job.slug);
                              }}
                              className="font-semibold text-[#0B1611] hover:text-emerald-800 hover:underline"
                            >
                              {job.title}
                            </a>
                            <div className="text-xs text-slate-500">{job.department}</div>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-medium text-emerald-800">
                            {job.category}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-700">{job.city}</td>
                          <td className="px-4 py-3.5 text-xs text-slate-700">{job.education}</td>
                          <td className="px-4 py-3.5 text-right font-mono text-xs font-semibold tabular-nums text-[#0B1611]">
                            {job.vacancies}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold tabular-nums text-emerald-800">
                            {job.deadline}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
