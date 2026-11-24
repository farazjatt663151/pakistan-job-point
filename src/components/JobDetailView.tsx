import { ArrowLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';
import type { JobListing } from '../types/job';
import { sanitizeExternalUrl } from '../utils/security';
import { AdSenseSlot } from './AdSenseSlot';
import { JobCard } from './JobCard';
import { ShareButtons } from './ShareButtons';

interface JobDetailViewProps {
  job: JobListing;
  relatedJobs: JobListing[];
  onNavigate: (path: string) => void;
  onOpenJob: (slug: string) => void;
}

export function JobDetailView({
  job,
  relatedJobs,
  onNavigate,
  onOpenJob,
}: JobDetailViewProps) {
  const safeApplyUrl = sanitizeExternalUrl(job.officialApplyUrl);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to All Jobs
        </button>
        <span aria-hidden="true">/</span>
        <a
          href={job.category === 'Government' ? '/jobs/government' : '/jobs/private'}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(job.category === 'Government' ? '/jobs/government' : '/jobs/private');
          }}
          className="hover:text-[#0B1611] hover:underline"
        >
          {job.category} Jobs
        </a>
        <span aria-hidden="true">/</span>
        <a
          href={`/jobs/city/${job.city.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/jobs/city/${job.city.toLowerCase().replace(/\s+/g, '-')}`);
          }}
          className="hover:text-[#0B1611] hover:underline"
        >
          {job.city}
        </a>
      </nav>

      {/* Demo Listing Banner */}
      {job.isDemo && (
        <div
          role="note"
          className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Sample Demo Listing for Testing</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              This vacancy is a placeholder sample to demonstrate job formatting, search, and external apply links. Sign in to the Admin Panel to replace demo entries with verified job announcements.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Job Content */}
        <div className="lg:col-span-2 space-y-8">
          <article className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-600">
              {job.isDemo && (
                <>
                  <span className="font-semibold text-amber-800">Demo Listing</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="font-semibold text-emerald-800">{job.category} Sector</span>
              <span aria-hidden="true">·</span>
              <span>{job.city}, Pakistan</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Posted {job.postedDate}</span>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0B1611] sm:text-3xl text-balance">
              {job.title}
            </h1>
            <p className="mt-2 text-base font-medium text-slate-700">{job.department}</p>

            {/* Structured Specification Grid */}
            <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-emerald-950/10 py-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">Department / Organization</dt>
                <dd className="mt-1 text-sm font-semibold text-[#0B1611]">{job.department}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Job Location</dt>
                <dd className="mt-1 text-sm font-semibold text-[#0B1611]">{job.city}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Required Education</dt>
                <dd className="mt-1 text-sm font-semibold text-[#0B1611]">{job.education}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Salary / Pay Scale</dt>
                <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#0B1611]">
                  {job.salary}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Age Limit</dt>
                <dd className="mt-1 text-sm font-semibold text-[#0B1611]">{job.ageLimit}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Number of Vacancies</dt>
                <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#0B1611]">
                  {job.vacancies}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Application Deadline</dt>
                <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-800">
                  {job.deadline}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Category</dt>
                <dd className="mt-1 text-sm font-semibold text-[#0B1611]">{job.category}</dd>
              </div>
            </dl>

            {/* Job Description */}
            <section className="mt-6">
              <h2 className="font-display text-lg font-bold text-[#0B1611]">
                Job Overview &amp; Eligibility Details
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Application Procedure */}
            <section className="mt-8">
              <h2 className="font-display text-lg font-bold text-[#0B1611]">
                How to Apply (Official Procedure)
              </h2>
              <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[15px] leading-relaxed text-slate-700">
                {job.applicationProcedure.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>

            {/* Official Apply CTA & Share */}
            <div className="mt-8 flex flex-col gap-5 border-t border-emerald-950/10 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {safeApplyUrl ? (
                  <a
                    href={safeApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    {job.isDemo ? 'Open Demo Application Link' : 'Official Apply Now'}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-red-700">
                    Official application link is invalid or unavailable.
                  </p>
                )}

                <p className="text-xs text-slate-500">
                  Pakistan Job Point never charges application fees. Always apply via the employer’s official portal.
                </p>
              </div>

              <ShareButtons title={job.title} />
            </div>
          </article>

          <AdSenseSlot slotName="Job Detail In-Article" format="infeed" />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-emerald-950/10 bg-[#0B1611] p-6 text-white">
            <h2 className="font-display text-base font-bold">Quick Verification Checklist</h2>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-300">
              <li>1. Confirm the official closing date ({job.deadline}) before starting.</li>
              <li>2. Check provincial/district domicile requirements on the official notice.</li>
              <li>3. Keep scanned CNIC, academic degrees, and domicile ready in PDF/JPG.</li>
              <li>4. Never pay unauthorized agents or personal mobile wallets for job forms.</li>
            </ul>
          </div>

          <AdSenseSlot slotName="Job Detail Sidebar" format="rectangle" />
        </aside>
      </div>

      {/* Related Listings */}
      {relatedJobs.length > 0 && (
        <section className="mt-12 border-t border-emerald-950/10 pt-10">
          <h2 className="font-display text-xl font-bold text-[#0B1611]">
            More {job.category} &amp; {job.city} Opportunities
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedJobs.map((rel) => (
              <JobCard key={rel.id} job={rel} onOpenJob={onOpenJob} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
