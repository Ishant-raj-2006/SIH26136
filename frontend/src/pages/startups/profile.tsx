import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Globe, Users, Zap, Tag, ShieldCheck, AlertCircle,
  Save, Building2, Calendar, CheckCircle2, FileText, Upload,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Textarea, Select, Badge } from '@/components/UI';
import { DpiitVerificationModal, type DpiitVerificationResult } from '@/components/DpiitVerificationModal';
import toast from 'react-hot-toast';
import type { Startup } from '@/types';
import type { NextPageWithLayout } from '../_app';

const fade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// Eligibility checklist per PS requirements
const eligibilityChecklist = [
  { id: 'dpiit', label: 'DPIIT / Startup India Recognition', description: 'Valid DPIIT registration certificate' },
  { id: 'gst', label: 'GST Registration', description: 'Active GST number (if applicable)' },
  { id: 'incorporation', label: 'Company Incorporation', description: 'MCA certificate of incorporation' },
  { id: 'bank', label: 'Bank Account (Business)', description: 'Active business bank account' },
  { id: 'pan', label: 'PAN Card', description: 'Company PAN card' },
];

const fundingStageOptions = [
  { label: 'Pre-Seed', value: 'pre_seed' },
  { label: 'Seed', value: 'seed' },
  { label: 'Series A', value: 'series_a' },
  { label: 'Series B', value: 'series_b' },
  { label: 'Series C+', value: 'series_c' },
  { label: 'Bootstrapped', value: 'bootstrapped' },
];

const teamSizeOptions = [
  { label: '1–5 people', value: '3' },
  { label: '6–10 people', value: '8' },
  { label: '11–50 people', value: '25' },
  { label: '51–200 people', value: '100' },
  { label: '200+ people', value: '200' },
];

const industryOptions = [
  { label: 'AgriTech', value: 'AgriTech' },
  { label: 'CleanTech / GreenTech', value: 'CleanTech' },
  { label: 'EdTech', value: 'EdTech' },
  { label: 'FinTech', value: 'FinTech' },
  { label: 'HealthTech', value: 'HealthTech' },
  { label: 'Logistics & Supply Chain', value: 'Logistics' },
  { label: 'Smart Cities & Infrastructure', value: 'SmartCity' },
  { label: 'Water & Sanitation', value: 'WaterSanitation' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'AI / ML', value: 'AI_ML' },
  { label: 'IoT / Hardware', value: 'IoT' },
  { label: 'Blockchain', value: 'Blockchain' },
  { label: 'Other', value: 'Other' },
];

const StartupProfilePage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Partial<Startup>>({
    name: user?.organization || '',
    description: '',
    website: '',
    industry: '',
    founded_year: new Date().getFullYear(),
    team_size: 5,
    funding_stage: 'seed',
    technologies: [],
    verification_score: 8,
    is_verified: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [checked, setChecked] = useState<string[]>(['dpiit', 'incorporation', 'pan']);
  const [activeTab, setActiveTab] = useState<'profile' | 'eligibility' | 'documents'>('profile');

  // DPIIT Verification Modal State
  const [dpiitModalOpen, setDpiitModalOpen] = useState(false);
  const [dpiitResult, setDpiitResult] = useState<DpiitVerificationResult | null>(null);

  useEffect(() => {
    // Attempt to load existing verification from localStorage
    try {
      const stored = localStorage.getItem('gopilot_dpiit_verified');
      if (stored) {
        setDpiitResult(JSON.parse(stored));
      } else {
        // Provide default pre-verified mock result for instant demo
        const initialMock: DpiitVerificationResult = {
          dippNumber: 'DIPP102948',
          entityName: user?.organization || 'AeroShield Robotics Pvt Ltd',
          incorporationDate: '14 May 2021',
          entityAgeYears: 3.4,
          dpiitRecognitionDate: '02 Aug 2021',
          industrySector: 'Artificial Intelligence & Robotics',
          turnoverEligibility: 'Statutory Cap Compliant (< ₹100 Cr)',
          priorExperienceExemption: true,
          priorTurnoverExemption: true,
          verifiedAt: '12 Jan 2026',
          certificateHash: 'sha256:d8f1e92a40b91c8413f990117a2e582b9941a80c98f5a113'
        };
        setDpiitResult(initialMock);
      }
    } catch (e) {}

    setLoading(false);
  }, [user?.organization]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.createStartup({
        ...profile,
        technologies: profile.technologies || [],
        team_size: Number(profile.team_size),
        founded_year: Number(profile.founded_year),
      });
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !(profile.technologies || []).includes(t)) {
      setProfile((p) => ({ ...p, technologies: [...(p.technologies || []), t] }));
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    setProfile((p) => ({ ...p, technologies: (p.technologies || []).filter((t) => t !== tech) }));
  };

  const verificationPct = Math.min(100, (profile.verification_score ?? 0) / 10 * 100);
  const profileCompleteness = [
    profile.name, profile.description, profile.industry,
    profile.website, (profile.technologies || []).length > 0,
  ].filter(Boolean).length / 5 * 100;

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'eligibility', label: 'Eligibility & Docs', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Upload', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">My Startup Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Complete your profile to improve visibility and unlock more challenges
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Save className="w-4 h-4" /> Save Profile
        </Button>
      </motion.div>

      {/* Status cards */}
      <motion.div variants={item} className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Verification status */}
        <Card hover={false} className={`border-2 ${profile.is_verified ? 'border-green-200 dark:border-green-800/40' : 'border-amber-200 dark:border-amber-800/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            {profile.is_verified
              ? <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              : <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            }
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {profile.is_verified ? 'Verified ✓' : 'Pending Verification'}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.is_verified ? 'Eligible for all challenges' : 'Complete checklist to get verified'}
          </p>
        </Card>

        {/* Profile score */}
        <Card hover={false}>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Profile Score</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{(profile.verification_score ?? 0).toFixed(1)}/10</p>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${verificationPct}%` }} />
          </div>
        </Card>

        {/* Completeness */}
        <Card hover={false}>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Profile Completeness</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{profileCompleteness.toFixed(0)}%</p>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${profileCompleteness}%` }} />
          </div>
        </Card>
      </motion.div>

      {/* Statutory DPIIT GFR Exemption Banner */}
      <motion.div variants={item} className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                DPIIT Recognition & Statutory Turnover Exemption
              </h3>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Registration No: <strong className="font-mono text-emerald-800">{dpiitResult?.dippNumber || 'DIPP102948'}</strong> • GFR 2017 Prior Turnover & Prior Experience Clauses Formally Waived
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDpiitModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          Verify / View Exemption Deed
        </button>
      </motion.div>

      {/* Tab bar */}
      <motion.div variants={item} className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-150 -mb-px ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <motion.div variants={item}>
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card hover={false}>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary-500" /> Company Information
              </h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Input
                  label="Startup Name *"
                  value={profile.name || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. EcoTech Solutions Pvt. Ltd."
                />
                <Input
                  label="Website"
                  value={profile.website || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://yourcompany.com"
                  icon={<Globe className="w-4 h-4" />}
                />
                <Select
                  label="Industry *"
                  value={profile.industry || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
                  options={[{ label: 'Select Industry', value: '' }, ...industryOptions]}
                />
                <Select
                  label="Funding Stage *"
                  value={profile.funding_stage || 'seed'}
                  onChange={(e) => setProfile((p) => ({ ...p, funding_stage: e.target.value }))}
                  options={fundingStageOptions}
                />
                <Input
                  label="Founded Year *"
                  type="number"
                  value={profile.founded_year || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, founded_year: parseInt(e.target.value) }))}
                  placeholder="e.g. 2021"
                  icon={<Calendar className="w-4 h-4" />}
                />
                <Select
                  label="Team Size *"
                  value={String(profile.team_size || 5)}
                  onChange={(e) => setProfile((p) => ({ ...p, team_size: parseInt(e.target.value) }))}
                  options={teamSizeOptions}
                />
              </div>
            </Card>

            <Card hover={false}>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" /> Description
              </h2>
              <Textarea
                label="About your Startup *"
                value={profile.description || ''}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your startup's mission, the problem you solve, and your unique value proposition for government procurement..."
                rows={5}
              />
            </Card>

            <Card hover={false}>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-500" /> Technologies & Expertise
              </h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="e.g. Python, Computer Vision, IoT..."
                  icon={<Tag className="w-4 h-4" />}
                />
                <Button variant="outline" onClick={addTech} className="whitespace-nowrap">Add</Button>
              </div>
              {(profile.technologies || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(profile.technologies || []).map((tech) => (
                    <button
                      key={tech}
                      onClick={() => removeTech(tech)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors group"
                    >
                      {tech}
                      <span className="text-primary-400 group-hover:text-red-500 transition-colors ml-1">×</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">Add technologies to help departments find you for relevant challenges</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <Card hover={false}>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-500" /> Eligibility Checklist
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Complete this checklist to qualify for government procurement challenges.
              Per the PS guidelines, all documents must be valid and up-to-date.
            </p>
            <div className="space-y-4">
              {eligibilityChecklist.map((elig) => {
                const isDone = checked.includes(elig.id);
                return (
                  <div
                    key={elig.id}
                    onClick={() => setChecked((prev) => isDone ? prev.filter(i => i !== elig.id) : [...prev, elig.id])}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isDone
                        ? 'border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800/40'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isDone ? 'border-green-500 bg-green-500' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isDone ? 'text-green-800 dark:text-green-300' : 'text-slate-900 dark:text-slate-50'}`}>
                        {elig.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{elig.description}</p>
                    </div>
                    {isDone && <Badge variant="success"><span className="text-xs">✓ Confirmed</span></Badge>}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Checklist Progress</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{checked.length}/{eligibilityChecklist.length}</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(checked.length / eligibilityChecklist.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card hover={false}>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary-500" /> Document Upload
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Upload required documents for eligibility verification. All documents are kept secure and reviewed by platform administrators.
            </p>
            <div className="space-y-4">
              {[
                { label: 'DPIIT / Startup India Certificate', required: true },
                { label: 'GST Registration Certificate', required: false },
                { label: 'Certificate of Incorporation (MCA)', required: true },
                { label: 'PAN Card (Company)', required: true },
                { label: 'Last 2 Years Audited Financial Statements', required: false },
                { label: 'IP / Patent Certificates (if any)', required: false },
              ].map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {doc.label}
                      {doc.required && <span className="ml-1 text-red-500 text-xs">*</span>}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">PDF, JPG, PNG up to 10MB</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">Upload</Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">* Required for eligibility verification</p>
          </Card>
        )}
      </motion.div>

      {/* DPIIT Verification Engine Modal */}
      <DpiitVerificationModal
        isOpen={dpiitModalOpen}
        onClose={() => setDpiitModalOpen(false)}
        onVerified={(res) => setDpiitResult(res)}
        defaultDippNumber={dpiitResult?.dippNumber || 'DIPP102948'}
      />
    </motion.div>
  );
};

StartupProfilePage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default StartupProfilePage;
