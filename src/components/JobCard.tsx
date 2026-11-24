import { ArrowUpRight } from 'lucide-react';
import type { JobListing } from '../types/job';
import { sanitizeExternalUrl } from '../utils/security';

interface JobCardProps {
  job: JobListing;
  onOpenJob: (slug: string) => void;
}

export function JobCard({ job, onOpenJob }: JobCardProps) {
  const safeApplyUrl = sanitizeExternalUrl(job.officialApplyUrl);

  return (
    <article className="flex flex-col justify-between rounded-xl border border-emerald-950/10 bg-white p-5 sm:p-6 transition-colors duration-150 hover:border-emerald-700/40">
      <div>
        {/* Zero-pill unboxed metadata kicker */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-600">
          {job.isDemo && (
            <>
              <span className="font-semibold text-amber-800">Demo Listing</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span className={job.category === 'Government' ? 'text-emerald-800 font-semibold' : 'text-slate-700 font-semibold'}>
            {job.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>{job.city}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-500">
            Posted {job.postedDate}
          </span>
        </div>

        {/* Job Title */}
        <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-[#0B1611] text-balance">
          <a
            href={`/job/${job.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onOpenJob(job.slug);
            }}
            className="hover:text-emerald-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            {job.title}
          </a>
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-600">{job.department}</p>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Key Specs & Actions */}
      <div className="mt-5 pt-4 border-t border-emerald-950/10">
        <dl className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-slate-500">Education</dt>
            <dd className="mt-0.5 font-semibold text-[#0B1611]">{job.education}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Vacancies</dt>
            <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[#0B1611]">
              {job.vacancies}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Deadline</dt>
            <dd className="mt-0.5 font-mono font-semibold tabular-nums text-emerald-800">
              {job.deadline}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`/job/${job.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onOpenJob(job.slug);
            }}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-emerald-950/15 bg-[#F7FAF8] px-4 py-2 text-xs font-semibold text-[#0B1611] whitespace-nowrap shrink-0 transition-colors hover:bg-emerald-50 hover:border-emerald-700/40"
          >
            View Details
          </a>

          {safeApplyUrl ? (
            <a
              href={safeApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-emerald-800"
            >
              {job.isDemo ? 'Demo Apply Link' : 'Apply Now'}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-xs text-slate-500">Official link unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}
