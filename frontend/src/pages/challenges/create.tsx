import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Textarea, Select, Alert } from '@/components/UI';
import { ArrowLeft, Sparkles, Building2, User, Phone, Mail, Hash, DollarSign, CheckSquare, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { NextPageWithLayout } from '../_app';

const CreateChallengePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentOrMinistry, setDepartmentOrMinistry] = useState(user?.organization || 'Ministry of Electronics & IT');
  const [contactPersonName, setContactPersonName] = useState(user?.full_name || 'Department Officer');
  const [contactPhone, setContactPhone] = useState('+91 9876543210');
  const [contactEmail, setContactEmail] = useState(user?.email || 'officer@gov.in');
  
  // Unique Problem ID
  const [problemCode, setProblemCode] = useState(`PRB-SIH26136-${Math.floor(100 + Math.random() * 900)}`);
  const [budget, setBudget] = useState('2500000');
  const [problemStatement, setProblemStatement] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [status, setStatus] = useState<'active' | 'closed' | 'project'>('active');

  // Target Beneficiaries Checkboxes
  const beneficiaryOptions = [
    { id: 'citizens', label: 'Citizens' },
    { id: 'government_employees', label: 'Government Employees' },
    { id: 'farmers', label: 'Farmers' },
    { id: 'student', label: 'Students' },
    { id: 'health_care', label: 'Health Care' },
    { id: 'other', label: 'Other' },
  ];
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(['citizens', 'farmers']);
  const [otherBeneficiaryText, setOtherBeneficiaryText] = useState('');

  // Technical Requirements Checkboxes
  const techOptions = [
    { id: 'AI', label: 'AI / Machine Learning' },
    { id: 'ITO', label: 'ITO' },
    { id: 'IoT', label: 'IoT & Edge Hardware' },
    { id: 'data_analysis', label: 'Data Analysis' },
    { id: 'mobile_application', label: 'Mobile Application' },
    { id: 'software_developer', label: 'Software Developer' },
    { id: 'other', label: 'Other' },
  ];
  const [selectedTech, setSelectedTech] = useState<string[]>(['AI', 'IoT']);
  const [otherTechText, setOtherTechText] = useState('');

  const toggleBeneficiary = (id: string) => {
    if (selectedBeneficiaries.includes(id)) {
      setSelectedBeneficiaries(selectedBeneficiaries.filter((item) => item !== id));
    } else {
      setSelectedBeneficiaries([...selectedBeneficiaries, id]);
    }
  };

  const toggleTech = (id: string) => {
    if (selectedTech.includes(id)) {
      setSelectedTech(selectedTech.filter((item) => item !== id));
    } else {
      setSelectedTech([...selectedTech, id]);
    }
  };

  const handleGenerateNewId = () => {
    const newId = `PRB-SIH26136-${Math.floor(100 + Math.random() * 900)}`;
    setProblemCode(newId);
    toast.success(`Generated unique Problem ID: ${newId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemStatement.trim() || !budget || !problemCode.trim()) {
      toast.error('Please fill in all mandatory fields (*)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title,
        description: problemStatement,
        problem_statement: problemStatement,
        department_or_ministry: departmentOrMinistry,
        contact_person_name: contactPersonName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        problem_code: problemCode.toUpperCase(),
        budget: parseFloat(budget),
        status,
        category: selectedTech.length > 0 ? selectedTech[0] : 'Technology',
        tags: [...selectedTech, ...selectedBeneficiaries],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        expected_outcome: expectedOutcome || 'Validated pilot deployment under GFR Rule 194',
        target_beneficiaries: selectedBeneficiaries,
        target_beneficiaries_other: selectedBeneficiaries.includes('other') ? otherBeneficiaryText : '',
        technical_requirements: selectedTech,
        technical_requirements_other: selectedTech.includes('other') ? otherTechText : '',
      };

      await apiClient.createChallenge(payload);
      toast.success('Government Sandbox Problem published successfully!');
      router.push('/challenges');
    } catch (err: any) {
      console.error(err);
      const rawDetail = err.response?.data?.detail;
      let errorMsg = 'Failed to publish problem statement.';
      if (typeof rawDetail === 'string') errorMsg = rawDetail;
      else if (Array.isArray(rawDetail)) errorMsg = rawDetail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-16"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/challenges">
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Challenges
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-7 h-7 text-primary-600" />
              Post Government Problem Statement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              GFR Rule 194 Public Procurement Sandbox Portal
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Main Card Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Department & Officer Information */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Department & Contact Officer Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Department / Ministry *
              </label>
              <Input
                placeholder="e.g. Ministry of Agriculture & Farmers Welfare"
                value={departmentOrMinistry}
                onChange={(e) => setDepartmentOrMinistry(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Person Name *
              </label>
              <Input
                placeholder="e.g. Rajesh Kumar (Director, Procurement)"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Official Phone Number *
              </label>
              <Input
                placeholder="+91 9876543210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Official Email ID *
              </label>
              <Input
                type="email"
                placeholder="officer@gov.in"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Problem Details & Unique Problem ID */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Hash className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Problem Specifications & Budget
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Problem Title *
              </label>
              <Input
                placeholder="e.g. AI-Powered Crop Disease Diagnostic & Precision Yield Prediction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Unique Problem ID * (Must be Unique)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="PRB-SIH26136-101"
                  value={problemCode}
                  onChange={(e) => setProblemCode(e.target.value)}
                  className="font-mono text-sm uppercase"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateNewId}
                  title="Generate Unique Problem ID"
                  className="shrink-0"
                >
                  ⚡ Auto
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Sandbox Budget Allocation (₹) *
              </label>
              <Input
                type="number"
                placeholder="2500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
              <span className="text-[11px] text-slate-400">
                Grant value: ₹{(Number(budget || 0) / 100000).toFixed(1)} Lakhs
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Status *
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { label: '🟢 Active (Open for Proposals)', value: 'active' },
                  { label: '🟡 Project (Pilot Running)', value: 'project' },
                  { label: '🔴 Closed (Archived)', value: 'closed' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Details of Problem Statement *
            </label>
            <Textarea
              placeholder="Provide complete ground-level problem description, affected clusters, target requirements, and validation benchmarks..."
              rows={5}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Expected Outcome & Pilot Deliverables
            </label>
            <Textarea
              placeholder="Specify pilot acceptance parameters e.g. accuracy >92%, 90-day sandbox trial, edge device deployment..."
              rows={3}
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </div>
        </Card>

        {/* Section 3: Target Beneficiaries (Checkboxes) */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Target Beneficiaries (Select all that apply) *
              </h2>
              <p className="text-xs text-slate-500">
                Identify who will directly benefit from this sandbox solution
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {beneficiaryOptions.map((opt) => {
              const isChecked = selectedBeneficiaries.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBeneficiary(opt.id)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              );
            })}
          </div>

          {selectedBeneficiaries.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Specify Other Target Beneficiary *
              </label>
              <Input
                placeholder="e.g. District Administrative Extension Officers, Rural Workers"
                value={otherBeneficiaryText}
                onChange={(e) => setOtherBeneficiaryText(e.target.value)}
                required
              />
            </motion.div>
          )}
        </Card>

        {/* Section 4: Technical Requirements (Checkboxes) */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4. Technical Requirements & Skillset *
              </h2>
              <p className="text-xs text-slate-500">
                These tags will be visible to companies applying for this challenge
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techOptions.map((opt) => {
              const isChecked = selectedTech.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-900 dark:text-amber-300 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTech(opt.id)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              );
            })}
          </div>

          {selectedTech.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Specify Other Technical Requirements *
              </label>
              <Input
                placeholder="e.g. Blockchain Auditing, Hyperspectral Imaging, Satellite GIS"
                value={otherTechText}
                onChange={(e) => setOtherTechText(e.target.value)}
                required
              />
            </motion.div>
          )}
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
          <Link href="/challenges" className="w-full sm:w-auto">
            <Button type="button" variant="ghost" className="w-full justify-center">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="w-full sm:w-auto justify-center px-8 shadow-lg shadow-primary-500/20"
          >
            {submitting ? 'Publishing Problem...' : '🚀 Submit & Publish Government Problem'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

CreateChallengePage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CreateChallengePage;
