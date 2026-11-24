import { CheckCircle2, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface StaticPageProps {
  page: 'about' | 'contact' | 'privacy' | 'disclaimer' | 'terms';
  onNavigate: (path: string) => void;
}

export function StaticPages({ page, onNavigate }: StaticPageProps) {
  const [imageError, setImageError] = useState(false);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (name.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!emailValid) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setFormError('Please write a message of at least 10 characters.');
      return;
    }

    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  if (page === 'about') {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-xl border border-emerald-950/10 bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <p className="text-xs font-semibold text-emerald-800">About Pakistan Job Point</p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0B1611] sm:text-3xl text-balance">
                Clear, verified job discovery across every province of Pakistan.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Pakistan Job Point was built to help students, fresh graduates, skilled technicians, and experienced professionals find legitimate public and private sector vacancies without navigating cluttered, misleading websites.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Every listing organizes essential details upfront: department name, city, required education (Primary through Master), age limit, pay scale, closing deadline, and a direct link to the employer’s official application portal.
              </p>
            </div>

            <div className="relative min-h-[260px] bg-[#0B1611]">
              {!imageError ? (
                <img
                  src="/src/assets/images/about_editorial_team_1795496048296.jpg"
                  alt="Editorial team reviewing verified career notices at Pakistan Job Point"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B1611] to-emerald-900 p-8 text-center text-white">
                  <ShieldCheck className="h-10 w-10 text-emerald-300" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-bold">Pakistan Job Point</p>
                  <p className="mt-1 text-xs text-emerald-200">
                    Serving job seekers across Karachi, Lahore, Islamabad, Peshawar &amp; Quetta
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-950/10 bg-white p-6">
            <h2 className="font-display text-base font-bold text-[#0B1611]">01. Official Source Links</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We route applicants straight to official testing agencies, federal/provincial portals, and verified corporate career pages.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-950/10 bg-white p-6">
            <h2 className="font-display text-base font-bold text-[#0B1611]">02. City &amp; Education Filters</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Search quickly by Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, or filter by Primary, Matric, Intermediate, Bachelor, and Master.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-950/10 bg-white p-6">
            <h2 className="font-display text-base font-bold text-[#0B1611]">03. Free &amp; Transparent</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Access to job notices is completely free. We never collect CVs on behalf of third parties or charge candidate fees.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex min-h-[44px] items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Browse Latest Jobs
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-emerald-950/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1611] hover:bg-emerald-50"
          >
            Contact Editorial Team
          </button>
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-xs font-semibold text-emerald-800">Contact Us</p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0B1611] sm:text-3xl">
                Get in touch with Pakistan Job Point
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Have a verified job advertisement to share, need to report an expired or inaccurate listing, or have feedback on our portal? Send us a message below.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-950/10 bg-white p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#0B1611]">Editorial &amp; Corrections</p>
                  <p className="text-sm text-slate-600">editorial@pakistanjobpoint.example</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#0B1611]">Coverage</p>
                  <p className="text-sm text-slate-600">
                    Islamabad, Karachi, Lahore, Rawalpindi, Peshawar, Quetta &amp; Nationwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-bold text-[#0B1611]">
                  Message Recorded
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you for contacting Pakistan Job Point. Note: Because this static starter site does not use a paid mail server yet, connect Formspree, Web3Forms, or a Cloudflare Worker to receive live email submissions.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0B1611]">Send a Message</h2>

                {formError && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800">
                    {formError}
                  </p>
                )}

                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Bilal"
                    className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Verified job submission or correction"
                    className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your inquiry or include the official source URL..."
                    className="w-full rounded-lg border border-emerald-950/15 p-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (page === 'privacy') {
    return (
      <article className="mx-auto max-w-[840px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-10 space-y-6">
          <div>
            <p className="text-xs font-semibold text-emerald-800">Legal Policy</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#0B1611] sm:text-3xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-slate-500">Effective Date: November 2026</p>
          </div>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">1. Information We Collect</h2>
            <p>
              Pakistan Job Point is an informational job directory. Visitors can browse, search, and filter all job listings without creating an account or submitting personal resumes. If you contact us voluntarily via our Contact page, we only use your name and email address to respond to your inquiry.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">2. Google AdSense &amp; Cookies</h2>
            <p>
              When Google AdSense is enabled on Pakistan Job Point, third-party vendors, including Google, may use cookies to serve ads based on a user’s prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.
            </p>
            <p>
              Users may opt out of personalized advertising by visiting Google Ads Settings. We also use browser local storage solely when an administrator manages draft job listings in the Admin Panel.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">3. External Links</h2>
            <p>
              Every “Apply Now” link directs you to an external official recruitment portal or employer website. Pakistan Job Point is not responsible for the privacy practices or content of third-party websites.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">4. Policy Updates &amp; Contact</h2>
            <p>
              We may update this Privacy Policy as our platform evolves. Questions regarding this policy can be submitted through our Contact Us page.
            </p>
          </section>
        </div>
      </article>
    );
  }

  if (page === 'disclaimer') {
    return (
      <article className="mx-auto max-w-[840px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-10 space-y-6">
          <div>
            <p className="text-xs font-semibold text-emerald-800">Important Notice</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#0B1611] sm:text-3xl">
              Disclaimer
            </h1>
            <p className="mt-2 text-xs text-slate-500">Last Updated: November 2026</p>
          </div>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">1. Informational Purpose Only</h2>
            <p>
              Pakistan Job Point is an independent informational portal designed to help Pakistani job seekers discover employment announcements. We are not affiliated with any federal or provincial government ministry, public service commission, or private recruitment agency unless explicitly stated.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">2. Demo Listings Notice</h2>
            <p>
              Listings marked as “[DEMO]” or “Demo Listing” are sample records included strictly for testing website search, filters, and layout before live verified vacancies are published.
            </p>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-700">
            <h2 className="font-display text-base font-bold text-[#0B1611]">3. Anti-Fraud &amp; Zero-Fee Warning</h2>
            <p>
              Pakistan Job Point never conducts interviews, collects CNIC copies, or requests money from applicants. Never pay any individual or unverified mobile account promising government or private job placement. Always verify deadlines, test fees, and official challans directly on the hiring organization’s official website.
            </p>
          </section>
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-[840px] px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-10 space-y-6">
        <div>
          <p className="text-xs font-semibold text-emerald-800">Legal Agreement</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#0B1611] sm:text-3xl">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-xs text-slate-500">Last Updated: November 2026</p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="font-display text-base font-bold text-[#0B1611]">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Pakistan Job Point, you agree to comply with these Terms and Conditions and all applicable laws of Pakistan.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="font-display text-base font-bold text-[#0B1611]">2. Accuracy of Job Listings</h2>
          <p>
            While we strive to summarize qualification, age limit, vacancy count, and deadline details accurately from official announcements, employers may amend or cancel postings without prior notice. Always rely on the official advertisement linked via the “Apply Now” button.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="font-display text-base font-bold text-[#0B1611]">3. Permitted Use</h2>
          <p>
            You may browse, share, and bookmark job listings for personal career search. Automated scraping, republishing misleading job notices, or attempting unauthorized access to administrative endpoints is strictly prohibited.
          </p>
        </section>
      </div>
    </article>
  );
}
