import {
  Check,
  Copy,
  Download,
  Edit3,
  KeyRound,
  Lock,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  EDUCATION_LEVELS,
  MAJOR_CITIES,
  type CityName,
  type EducationLevel,
  type JobCategory,
  type JobListing,
} from '../types/job';
import { hasLocalWorkspaceOverrides, validateJobArray } from '../utils/jobStorage';
import {
  generateSalt,
  hashPasscode,
  sanitizeExternalUrl,
  slugify,
} from '../utils/security';

const VAULT_KEY = 'pjp_admin_vault_v1';

interface VaultRecord {
  salt: string;
  hash: string;
}

function readVault(): VaultRecord | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VaultRecord>;
    if (typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      return { salt: parsed.salt, hash: parsed.hash };
    }
    return null;
  } catch {
    return null;
  }
}

interface AdminDashboardProps {
  jobs: JobListing[];
  onSaveJobs: (nextJobs: JobListing[]) => void;
  onResetDemo: () => void;
  onOpenJob: (slug: string) => void;
}

interface JobFormState {
  id?: string;
  title: string;
  category: JobCategory;
  department: string;
  city: CityName;
  education: EducationLevel;
  salary: string;
  ageLimit: string;
  vacancies: string;
  deadline: string;
  officialApplyUrl: string;
  description: string;
  procedureText: string;
  isDemo: boolean;
  featured: boolean;
}

const EMPTY_FORM: JobFormState = {
  title: '',
  category: 'Government',
  department: '',
  city: 'Islamabad',
  education: 'Bachelor',
  salary: '',
  ageLimit: '18 – 30 Years',
  vacancies: '1',
  deadline: '2026-12-31',
  officialApplyUrl: 'https://',
  description: '',
  procedureText:
    'Review the official advertisement and eligibility criteria.\nPrepare scanned copies of CNIC, academic degrees, and domicile.\nSubmit your online form on the official portal before the closing date.',
  isDemo: false,
  featured: true,
};

export function AdminDashboard({
  jobs,
  onSaveJobs,
  onResetDemo,
  onOpenJob,
}: AdminDashboardProps) {
  const [vault, setVault] = useState<VaultRecord | null>(() => readVault());
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Auth inputs (kept only in memory)
  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard tabs & state
  const [activeTab, setActiveTab] = useState<'manage' | 'publish' | 'architecture'>('manage');
  const [adminSearch, setAdminSearch] = useState('');
  const [editingForm, setEditingForm] = useState<JobFormState | null>(null);
  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [importText, setImportText] = useState('');

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (passcodeInput.length < 6) {
      setAuthError('Please choose an Admin Passcode with at least 6 characters.');
      return;
    }
    if (passcodeInput !== confirmPasscodeInput) {
      setAuthError('Passcodes do not match.');
      return;
    }

    const salt = generateSalt();
    const hash = await hashPasscode(passcodeInput, salt);
    const nextVault = { salt, hash };
    localStorage.setItem(VAULT_KEY, JSON.stringify(nextVault));
    setVault(nextVault);
    setPasscodeInput('');
    setConfirmPasscodeInput('');
    setIsUnlocked(true);
  };

  const handleUnlockVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!vault) return;

    const candidateHash = await hashPasscode(passcodeInput, vault.salt);
    if (candidateHash !== vault.hash) {
      setAuthError('Incorrect Admin Passcode. Please try again.');
      return;
    }

    setPasscodeInput('');
    setIsUnlocked(true);
  };

  const handleResetLocalVault = () => {
    localStorage.removeItem(VAULT_KEY);
    setVault(null);
    setIsUnlocked(false);
    setPasscodeInput('');
    setConfirmPasscodeInput('');
    setAuthError('');
  };

  const filteredJobs = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q)
    );
  }, [jobs, adminSearch]);

  const totalVacancies = useMemo(
    () => jobs.reduce((sum, j) => sum + (j.vacancies || 0), 0),
    [jobs]
  );

  const openCreateForm = () => {
    setFormError('');
    setEditingForm({ ...EMPTY_FORM });
  };

  const openEditForm = (job: JobListing) => {
    setFormError('');
    setEditingForm({
      id: job.id,
      title: job.title,
      category: job.category,
      department: job.department,
      city: job.city,
      education: job.education,
      salary: job.salary,
      ageLimit: job.ageLimit,
      vacancies: String(job.vacancies),
      deadline: job.deadline,
      officialApplyUrl: job.officialApplyUrl,
      description: job.description,
      procedureText: job.applicationProcedure.join('\n'),
      isDemo: job.isDemo,
      featured: Boolean(job.featured),
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;
    setFormError('');

    if (editingForm.title.trim().length < 3) {
      setFormError('Job title must be at least 3 characters.');
      return;
    }
    if (editingForm.department.trim().length < 2) {
      setFormError('Department or organization name is required.');
      return;
    }

    const validUrl = sanitizeExternalUrl(editingForm.officialApplyUrl);
    if (!validUrl) {
      setFormError('Official application URL must start with https:// or http://');
      return;
    }

    const parsedVacancies = Math.max(1, parseInt(editingForm.vacancies, 10) || 1);
    const steps = editingForm.procedureText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const today = new Date().toISOString().slice(0, 10);

    if (editingForm.id) {
      const updated = jobs.map((item) =>
        item.id === editingForm.id
          ? {
              ...item,
              title: editingForm.title.trim(),
              slug: slugify(editingForm.title) || item.slug,
              category: editingForm.category,
              department: editingForm.department.trim(),
              city: editingForm.city,
              education: editingForm.education,
              salary: editingForm.salary.trim() || 'Market Competitive',
              ageLimit: editingForm.ageLimit.trim() || '18 – 35 Years',
              vacancies: parsedVacancies,
              deadline: editingForm.deadline,
              description: editingForm.description.trim(),
              applicationProcedure: steps,
              officialApplyUrl: validUrl,
              isDemo: editingForm.isDemo,
              featured: editingForm.featured,
            }
          : item
      );
      onSaveJobs(updated);
      showToast('Job listing updated in local workspace.');
    } else {
      const newId = `job-${Date.now()}`;
      const baseSlug = slugify(`${editingForm.title}-${editingForm.city}`);
      const newJob: JobListing = {
        id: newId,
        slug: `${baseSlug}-${newId.slice(-4)}`,
        title: editingForm.title.trim(),
        category: editingForm.category,
        department: editingForm.department.trim(),
        city: editingForm.city,
        education: editingForm.education,
        salary: editingForm.salary.trim() || 'Market Competitive',
        ageLimit: editingForm.ageLimit.trim() || '18 – 35 Years',
        vacancies: parsedVacancies,
        deadline: editingForm.deadline,
        postedDate: today,
        description: editingForm.description.trim(),
        applicationProcedure: steps,
        officialApplyUrl: validUrl,
        isDemo: editingForm.isDemo,
        featured: editingForm.featured,
      };
      onSaveJobs([newJob, ...jobs]);
      showToast('New job listing added to local workspace.');
    }

    setEditingForm(null);
  };

  const handleDeleteJob = (id: string) => {
    const next = jobs.filter((j) => j.id !== id);
    onSaveJobs(next);
    setConfirmDeleteId(null);
    showToast('Job listing deleted.');
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded jobs.json for GitHub publishing.');
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jobs, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      showToast('Clipboard permission denied.');
    }
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importText);
      const validated = validateJobArray(parsed);
      if (validated.length === 0) {
        showToast('No valid job records found in JSON input.');
        return;
      }
      onSaveJobs(validated);
      setImportText('');
      setActiveTab('manage');
      showToast(`Imported ${validated.length} job listings successfully.`);
    } catch {
      showToast('Invalid JSON syntax. Please check the pasted content.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImportText(reader.result);
      }
    };
    reader.readAsText(file);
  };

  // Unauthenticated First-Run Setup or Unlock View
  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-[520px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-semibold">Admin Access</span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold text-[#0B1611]">
            {vault ? 'Unlock Admin Dashboard' : 'Set Your Admin Passcode'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {vault
              ? 'Enter the passcode you configured on this browser to add, edit, delete, or export jobs.'
              : 'No default passwords are ever stored in source code. Create your own Admin Passcode to lock your local publishing workspace on this device.'}
          </p>

          {authError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
            >
              {authError}
            </p>
          )}

          <form
            onSubmit={vault ? handleUnlockVault : handleCreateVault}
            className="mt-6 space-y-4"
          >
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                {vault ? 'Admin Passcode' : 'Create Passcode (min. 6 characters)'}
              </label>
              <input
                id="admin-passcode"
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            {!vault && (
              <div>
                <label
                  htmlFor="admin-passcode-confirm"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Confirm Passcode
                </label>
                <input
                  id="admin-passcode-confirm"
                  type="password"
                  required
                  value={confirmPasscodeInput}
                  onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                  placeholder="Re-enter passcode"
                  className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm text-[#0B1611] focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              {vault ? 'Unlock Dashboard' : 'Create Passcode & Enter'}
            </button>
          </form>

          {vault && (
            <div className="mt-6 border-t border-emerald-950/10 pt-4 text-xs text-slate-500 flex items-center justify-between gap-2">
              <span>Forgot local browser passcode?</span>
              <button
                type="button"
                onClick={handleResetLocalVault}
                className="font-semibold text-emerald-800 hover:underline"
              >
                Reset Local Passcode
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-emerald-950/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-800">Pakistan Job Point · Admin</p>
          <h1 className="mt-1 font-display text-xl font-bold text-[#0B1611] sm:text-2xl">
            Job Management Console
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Job
          </button>

          <button
            type="button"
            onClick={() => setIsUnlocked(false)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-emerald-950/15 bg-[#F7FAF8] px-3.5 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-100"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Lock Session
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900"
        >
          {statusMessage}
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-emerald-950/10 bg-white p-4">
          <p className="text-xs text-slate-500">Total Listings</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#0B1611]">
            {jobs.length}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-950/10 bg-white p-4">
          <p className="text-xs text-slate-500">Government Jobs</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-800">
            {jobs.filter((j) => j.category === 'Government').length}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-950/10 bg-white p-4">
          <p className="text-xs text-slate-500">Private Jobs</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#0B1611]">
            {jobs.filter((j) => j.category === 'Private').length}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-950/10 bg-white p-4">
          <p className="text-xs text-slate-500">Total Vacancies</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#0B1611]">
            {totalVacancies}
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950/10 pb-3">
        {[
          { id: 'manage', label: 'Manage Jobs' },
          { id: 'publish', label: 'Export & Publish (jobs.json)' },
          { id: 'architecture', label: 'Backend & Security Guide' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0B1611] text-white'
                : 'bg-white text-slate-700 border border-emerald-950/10 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add / Edit Job Form Modal/Panel */}
      {editingForm && (
        <section
          aria-label={editingForm.id ? 'Edit job form' : 'Add job form'}
          className="rounded-xl border border-emerald-700/30 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-4 border-b border-emerald-950/10 pb-4">
            <h2 className="font-display text-lg font-bold text-[#0B1611]">
              {editingForm.id ? 'Edit Job Listing' : 'Publish New Job Listing'}
            </h2>
            <button
              type="button"
              onClick={() => setEditingForm(null)}
              className="text-xs font-semibold text-slate-600 hover:text-[#0B1611]"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
            >
              {formError}
            </p>
          )}

          <form onSubmit={handleSaveForm} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="job-title" className="block text-xs font-medium text-slate-700 mb-1">
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                required
                value={editingForm.title}
                onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                placeholder="e.g., Assistant Director (BPS-17)"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="job-department"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Department / Organization
              </label>
              <input
                id="job-department"
                type="text"
                required
                value={editingForm.department}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, department: e.target.value })
                }
                placeholder="e.g., Federal Public Service Commission"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="job-category"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Category
              </label>
              <select
                id="job-category"
                value={editingForm.category}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    category: e.target.value as JobCategory,
                  })
                }
                className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label htmlFor="job-city" className="block text-xs font-medium text-slate-700 mb-1">
                City
              </label>
              <select
                id="job-city"
                value={editingForm.city}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, city: e.target.value as CityName })
                }
                className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm"
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job-education"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Required Education
              </label>
              <select
                id="job-education"
                value={editingForm.education}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    education: e.target.value as EducationLevel,
                  })
                }
                className="h-11 w-full rounded-lg border border-emerald-950/15 bg-white px-3 text-sm"
              >
                {EDUCATION_LEVELS.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="job-salary" className="block text-xs font-medium text-slate-700 mb-1">
                Salary / Pay Scale
              </label>
              <input
                id="job-salary"
                type="text"
                value={editingForm.salary}
                onChange={(e) => setEditingForm({ ...editingForm, salary: e.target.value })}
                placeholder="e.g., PKR 90,000 – 120,000 / month"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="job-age" className="block text-xs font-medium text-slate-700 mb-1">
                Age Limit
              </label>
              <input
                id="job-age"
                type="text"
                value={editingForm.ageLimit}
                onChange={(e) => setEditingForm({ ...editingForm, ageLimit: e.target.value })}
                placeholder="e.g., 21 – 30 Years"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="job-vacancies"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Number of Vacancies
              </label>
              <input
                id="job-vacancies"
                type="number"
                min={1}
                value={editingForm.vacancies}
                onChange={(e) => setEditingForm({ ...editingForm, vacancies: e.target.value })}
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="job-deadline"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Application Deadline
              </label>
              <input
                id="job-deadline"
                type="date"
                required
                value={editingForm.deadline}
                onChange={(e) => setEditingForm({ ...editingForm, deadline: e.target.value })}
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="job-url" className="block text-xs font-medium text-slate-700 mb-1">
                Official Application URL (must begin with https://)
              </label>
              <input
                id="job-url"
                type="url"
                required
                value={editingForm.officialApplyUrl}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, officialApplyUrl: e.target.value })
                }
                placeholder="https://official-department.gov.pk/careers"
                className="h-11 w-full rounded-lg border border-emerald-950/15 px-3.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="job-desc" className="block text-xs font-medium text-slate-700 mb-1">
                Job Description
              </label>
              <textarea
                id="job-desc"
                rows={4}
                required
                value={editingForm.description}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, description: e.target.value })
                }
                placeholder="Summarize duties, domicile rules, and experience requirements..."
                className="w-full rounded-lg border border-emerald-950/15 p-3.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="job-steps" className="block text-xs font-medium text-slate-700 mb-1">
                Application Procedure (one step per line)
              </label>
              <textarea
                id="job-steps"
                rows={3}
                value={editingForm.procedureText}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, procedureText: e.target.value })
                }
                className="w-full rounded-lg border border-emerald-950/15 p-3.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={editingForm.isDemo}
                  onChange={(e) =>
                    setEditingForm({ ...editingForm, isDemo: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700"
                />
                Mark as Demo Sample Listing
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={editingForm.featured}
                  onChange={(e) =>
                    setEditingForm({ ...editingForm, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700"
                />
                Show in Featured Latest Section
              </label>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                {editingForm.id ? 'Save Changes' : 'Publish to Workspace'}
              </button>
              <button
                type="button"
                onClick={() => setEditingForm(null)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-emerald-950/15 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 1: MANAGE JOBS */}
      {activeTab === 'manage' && (
        <section className="rounded-xl border border-emerald-950/10 bg-white overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-emerald-950/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Filter admin table by title, department, or city..."
              aria-label="Filter jobs in admin table"
              className="h-10 w-full max-w-md rounded-lg border border-emerald-950/15 bg-[#F7FAF8] px-3.5 text-sm"
            />
            {hasLocalWorkspaceOverrides() && (
              <span className="text-xs font-medium text-emerald-800">
                Unsynced local browser edits active — export jobs.json to publish globally.
              </span>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-600">No job listings match your filter.</p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-emerald-950/10 bg-[#F7FAF8] text-xs font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Job Title &amp; Department</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Education</th>
                    <th className="px-4 py-3 text-right">Posts</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/10">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#F7FAF8]/70">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onOpenJob(job.slug)}
                          className="text-left font-semibold text-[#0B1611] hover:text-emerald-800 hover:underline"
                        >
                          {job.title}
                        </button>
                        <div className="text-xs text-slate-500">
                          {job.isDemo && (
                            <span className="mr-1.5 font-mono font-bold text-amber-800">
                              DEMO ·
                            </span>
                          )}
                          {job.department}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">
                        {job.category}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{job.city}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{job.education}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-[#0B1611]">
                        {job.vacancies}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-700">
                        {job.deadline}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {confirmDeleteId === job.id ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(job.id)}
                              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(job)}
                              aria-label={`Edit ${job.title}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-950/15 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(job.id)}
                              aria-label={`Delete ${job.title}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-950/15 text-slate-700 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: EXPORT & PUBLISH */}
      {activeTab === 'publish' && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-950/10 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#0B1611]">
              Publish Changes to Free Cloudflare Pages
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Because the free starter version runs without a paid database server, edits made here are saved instantly to your browser for previewing. To make your new verified jobs visible to every visitor worldwide on Cloudflare Pages:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Click <strong>Download jobs.json</strong> or <strong>Copy JSON</strong> below.</li>
              <li>Open your GitHub repository on your Android phone or computer.</li>
              <li>Replace the contents of <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">public/data/jobs.json</code> and commit.</li>
              <li>Cloudflare Pages rebuilds automatically in under 60 seconds for $0.</li>
            </ol>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download jobs.json
              </button>
              <button
                type="button"
                onClick={handleCopyJson}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-emerald-950/15 bg-[#F7FAF8] px-4 py-2 text-xs font-semibold text-[#0B1611] hover:bg-emerald-50"
              >
                {copiedJson ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    Copied JSON
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-950/10 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#0B1611]">
              Import JSON or Reset Demo Data
            </h2>
            <div>
              <label htmlFor="import-file" className="block text-xs font-medium text-slate-700 mb-1.5">
                Load jobs.json file from your phone or computer
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100"
              />
            </div>

            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Or paste valid jobs.json array here..."
              className="w-full rounded-lg border border-emerald-950/15 p-3 font-mono text-xs"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleImportJson}
                disabled={!importText.trim()}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0B1611] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                Import Listings
              </button>

              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemo();
                      setConfirmReset(false);
                      showToast('Workspace reset to default Demo listings.');
                    }}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-emerald-950/15 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset Demo Jobs
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: BACKEND & SECURITY GUIDE */}
      {activeTab === 'architecture' && (
        <section className="rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1611]">
                Security &amp; Backend Upgrade Roadmap
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Why no admin passwords or API keys are embedded in this frontend codebase, and how to scale when ready.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-950/10 bg-[#F7FAF8] p-5 space-y-2">
              <h3 className="font-display text-sm font-bold text-[#0B1611]">
                Stage 1 (Current): $0 Static Cloudflare Pages
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                All public job listings load from <code className="font-mono">public/data/jobs.json</code>. Zero database costs, instant global CDN caching, and zero exposed secrets in JavaScript bundles. Your Admin Passcode is hashed locally via Web Crypto SHA-256 to protect browser drafts.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-950/10 bg-[#F7FAF8] p-5 space-y-2">
              <h3 className="font-display text-sm font-bold text-[#0B1611]">
                Stage 2 (Optional): Live Multi-Device Admin API
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                When you want live database writes from any phone without re-uploading <code className="font-mono">jobs.json</code>, add a <strong>Cloudflare Pages Function</strong> (<code className="font-mono">/functions/api/jobs.ts</code>) backed by <strong>Cloudflare D1</strong> (free SQLite tier) or Supabase. Store <code className="font-mono">ADMIN_PASSCODE</code> strictly inside Cloudflare Dashboard → Settings → Environment Variables, never in frontend React code.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
