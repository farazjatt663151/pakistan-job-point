import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NAV_LINKS = [
  { label: 'Latest Jobs', path: '/' },
  { label: 'Government', path: '/jobs/government' },
  { label: 'Private', path: '/jobs/private' },
  { label: 'Cities', path: '/cities' },
  { label: 'About', path: '/about' },
];

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleNav(e, '/')}
          className="font-display text-lg font-bold tracking-tight text-[#0B1611] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Pakistan Job Point
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNav(e, item.path)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 py-1 border-b-2 ${
                  isActive
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-slate-600 hover:text-[#0B1611] hover:border-emerald-700/40'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/admin"
            onClick={(e) => handleNav(e, '/admin')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#0B1611] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Admin Panel
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-950/15 text-[#0B1611] md:hidden hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-emerald-950/10 bg-white px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact Us
            </a>
            <div className="pt-2 mt-1 border-t border-emerald-950/10">
              <a
                href="/admin"
                onClick={(e) => handleNav(e, '/admin')}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#0B1611] px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Admin Panel
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
