import { ArrowRight } from 'lucide-react';
import { EDUCATION_LEVELS, MAJOR_CITIES, type JobListing } from '../types/job';

interface CitiesOverviewPageProps {
  jobs: JobListing[];
  onNavigate: (path: string) => void;
}

export function CitiesOverviewPage({ jobs, onNavigate }: CitiesOverviewPageProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 space-y-12">
      <section>
        <p className="text-xs font-semibold text-emerald-800">Regional Job Directory</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0B1611] sm:text-3xl text-balance">
          Explore Jobs by City Across Pakistan
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Select a city to view active government and private sector listings in that region.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAJOR_CITIES.map((city) => {
            const count = jobs.filter((j) => j.city === city).length;
            const citySlug = city.toLowerCase().replace(/\s+/g, '-');
            return (
              <a
                key={city}
                href={`/jobs/city/${citySlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/jobs/city/${citySlug}`);
                }}
                className="flex items-center justify-between rounded-xl border border-emerald-950/10 bg-white p-5 transition-colors hover:border-emerald-700/50 hover:bg-emerald-50/40"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-[#0B1611]">{city}</h2>
                  <p className="mt-1 text-xs text-slate-600">
                    <span className="font-mono font-semibold tabular-nums text-emerald-800">
                      {count}
                    </span>{' '}
                    {count === 1 ? 'listing available' : 'listings available'}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-t border-emerald-950/10 pt-10">
        <h2 className="font-display text-xl font-bold text-[#0B1611]">
          Explore Jobs by Qualification
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Find opportunities matching your completed academic level.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {EDUCATION_LEVELS.map((edu) => {
            const count = jobs.filter((j) => j.education === edu).length;
            return (
              <a
                key={edu}
                href={`/jobs/education/${edu.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/jobs/education/${edu.toLowerCase()}`);
                }}
                className="flex flex-col justify-between rounded-xl border border-emerald-950/10 bg-white p-5 transition-colors hover:border-emerald-700/50 hover:bg-emerald-50/40"
              >
                <span className="font-display text-base font-bold text-[#0B1611]">{edu}</span>
                <span className="mt-3 text-xs text-slate-600">
                  <span className="font-mono font-semibold tabular-nums text-emerald-800">
                    {count}
                  </span>{' '}
                  {count === 1 ? 'job' : 'jobs'}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
