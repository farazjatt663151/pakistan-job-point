import { EDUCATION_LEVELS } from '../types/job';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const FOOTER_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta'];

export function Footer({ onNavigate }: FooterProps) {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-[#0B1611] text-slate-300 border-t border-emerald-900/40">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Summary */}
          <div>
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="font-display text-lg font-bold tracking-tight text-white"
            >
              Pakistan Job Point
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
              An independent Pakistani career information portal indexing verified public-sector and private employment notices by city and qualification.
            </p>
            <p className="mt-4 text-xs text-emerald-300/90">
              Free public access · Zero recruitment fees
            </p>
          </div>

          {/* Categories & Cities */}
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Browse by City</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="/jobs/government"
                  onClick={(e) => handleLink(e, '/jobs/government')}
                  className="hover:text-white transition-colors"
                >
                  Government Jobs
                </a>
              </li>
              <li>
                <a
                  href="/jobs/private"
                  onClick={(e) => handleLink(e, '/jobs/private')}
                  className="hover:text-white transition-colors"
                >
                  Private Jobs
                </a>
              </li>
              {FOOTER_CITIES.map((city) => (
                <li key={city}>
                  <a
                    href={`/jobs/city/${city.toLowerCase()}`}
                    onClick={(e) => handleLink(e, `/jobs/city/${city.toLowerCase()}`)}
                    className="hover:text-white transition-colors"
                  >
                    Jobs in {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Levels */}
          <div>
            <h2 className="font-display text-sm font-semibold text-white">By Qualification</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {EDUCATION_LEVELS.map((edu) => (
                <li key={edu}>
                  <a
                    href={`/jobs/education/${edu.toLowerCase()}`}
                    onClick={(e) => handleLink(e, `/jobs/education/${edu.toLowerCase()}`)}
                    className="hover:text-white transition-colors"
                  >
                    {edu} Pass Jobs
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Pages */}
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Information &amp; Legal</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLink(e, '/about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, '/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLink(e, '/privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => handleLink(e, '/disclaimer')}
                  className="hover:text-white transition-colors"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => handleLink(e, '/terms-and-conditions')}
                  className="hover:text-white transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pakistan Job Point. Informational job directory.</p>
          <p>Always verify official deadlines on the employer’s official portal before applying.</p>
        </div>
      </div>
    </footer>
  );
}
