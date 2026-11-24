import { RotateCcw, Search } from 'lucide-react';
import {
  EDUCATION_LEVELS,
  MAJOR_CITIES,
  type CityName,
  type EducationLevel,
  type JobCategory,
  type JobFilters,
  type SortOption,
} from '../types/job';

interface SearchFilterBarProps {
  filters: JobFilters;
  totalMatching: number;
  onChange: (next: JobFilters) => void;
  onReset: () => void;
}

export function SearchFilterBar({
  filters,
  totalMatching,
  onChange,
  onReset,
}: SearchFilterBarProps) {
  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== 'All' ||
    filters.city !== 'All' ||
    filters.education !== 'All' ||
    filters.sortBy !== 'latest';

  return (
    <section
      aria-label="Job search and filters"
      className="rounded-xl border border-emerald-950/10 bg-white p-4 sm:p-6"
    >
      {/* Search Input Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search by job title, department, city, or qualification..."
            aria-label="Search jobs by title, department, city, or qualification"
            className="h-11 w-full rounded-lg border border-emerald-950/15 bg-[#F7FAF8] pl-10 pr-4 text-sm text-[#0B1611] placeholder:text-slate-500 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          />
        </div>

        {/* Category Segmented Filter */}
        <div
          role="group"
          aria-label="Job sector filter"
          className="inline-flex h-11 items-center gap-1 rounded-lg bg-[#F1F6F3] p-1 shrink-0"
        >
          {(['All', 'Government', 'Private'] as const).map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  onChange({ ...filters, category: cat as 'All' | JobCategory })
                }
                className={`h-9 rounded-md px-3.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:bg-white hover:text-[#0B1611]'
                }`}
              >
                {cat === 'All' ? 'All Sectors' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown Filters & Sort Row */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filter-city" className="block text-xs font-medium text-slate-600 mb-1">
            City
          </label>
          <select
            id="filter-city"
            value={filters.city}
            onChange={(e) =>
              onChange({ ...filters, city: e.target.value as 'All' | CityName })
            }
            className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="All">All Cities in Pakistan</option>
            {MAJOR_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-education"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            Education Level
          </label>
          <select
            id="filter-education"
            value={filters.education}
            onChange={(e) =>
              onChange({
                ...filters,
                education: e.target.value as 'All' | EducationLevel,
              })
            }
            className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="All">All Qualifications</option>
            {EDUCATION_LEVELS.map((edu) => (
              <option key={edu} value={edu}>
                {edu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className="block text-xs font-medium text-slate-600 mb-1">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as SortOption })
            }
            className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="latest">Latest Posted</option>
            <option value="deadline">Closing Soonest</option>
            <option value="vacancies">Most Vacancies</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        <div className="flex items-end justify-between gap-3 sm:justify-end">
          <div className="text-xs text-slate-600 pb-3">
            <span className="font-mono font-semibold tabular-nums text-[#0B1611]">
              {totalMatching}
            </span>{' '}
            {totalMatching === 1 ? 'listing' : 'listings'} found
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-emerald-950/15 bg-[#F7FAF8] px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 hover:bg-emerald-50 hover:text-emerald-900"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
