import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, DollarSign, Tag, ShieldCheck, CheckCircle2,
  Clock, Send, Building2, FileText, Sparkles, AlertCircle, Award,
  Users, Layers, Share2, Check, Copy, Edit3, Trash2, MessageSquare
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Textarea, Badge, Select } from '@/components/UI';
import { ProposalChat } from '@/components/ProposalChat';
import toast from 'react-hot-toast';
import type { Challenge, Proposal } from '@/types';
import type { NextPageWithLayout } from '../_app';

const statusBadgeVariant: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  open: 'success',
  evaluating: 'primary',
  pilot_running: 'secondary',
  completed: 'success',
  cancelled: 'danger',
};

const ChallengeDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthStore();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Edit Challenge modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updatingChallenge, setUpdatingChallenge] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    budget: 0,
    status: 'open',
    description: '',
    problem_statement: '',
    expected_outcome: '',
    tagsStr: '',
  });

  // Delete Challenge modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmBudget, setConfirmBudget] = useState('');
  const [confirmChoice, setConfirmChoice] = useState<'yes' | 'no' | ''>('');
  const [deletingLoading, setDeletingLoading] = useState(false);

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [startupProfile, setStartupProfile] = useState<any | null>(null);
  const [startupStatus, setStartupStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'startup') {
      apiClient.getMyStartup()
        .then((data) => {
          setStartupProfile(data);
          setStartupStatus(data.status || 'pending');
        })
        .catch(() => setStartupStatus('pending'));
    }
  }, [user?.role]);

  const handleOpenProposalModal = () => {
    // Check if user has completed full 3-step company registration
    const isRegistrationComplete = Boolean(startupProfile?.cin_number && startupProfile?.incorporation_cert_url);

    if (!isRegistrationComplete) {
      toast.error('Registration required! Redirecting to 3-Step Company Registration...', { duration: 4000 });
      router.push('/register/company');
      return;
    }

    const companyName = startupProfile?.name || user?.organization || 'Our Enterprise';
    const companyWebsite = startupProfile?.website || 'https://company.example.com';

    setProposalForm({
      title: `Technical Proposal & Acceptance by ${companyName}`,
      description: `I, on behalf of ${companyName} (${companyWebsite}), officially accept this government proposal for "${challenge?.title}". We hereby submit our technical solution under GFR Rule 194.`,
      technical_approach: `Company Entity: ${companyName}\nOfficial Website: ${companyWebsite}\n\nWe hereby confirm acceptance of this government procurement challenge. Our team offers a complete technology solution with full GFR 194 and DPIIT compliance.`,
      timeline: '60 days (3 Escrow Tranches)',
      cost: Number(challenge?.budget || 1500000),
    });

    setProposalModalOpen(true);
  };
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    technical_approach: '',
    timeline: '60 days',
    cost: 1500000,
  });

  // Department / Evaluator view: received proposals
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [chatProposalId, setChatProposalId] = useState<number | null>(null);
  const [chatTitle, setChatTitle] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const challengeId = Number(id);

    async function loadChallengeData() {
      setLoading(true);
      try {
        const data = await apiClient.getChallenge(challengeId);
        setChallenge(data);
      } catch (err) {
        console.warn('Backend fetch failed, using fallback challenge details:', err);
        // Robust fallback so UI is always responsive for demo
        setChallenge({
          id: challengeId,
          title: challengeId === 2 
            ? 'AI-Powered Crop Disease Diagnostic & Precision Yield Prediction' 
            : `National Public Sandbox Challenge #${challengeId}`,
          description:
            'A national mission initiative to deploy cutting-edge startup technologies in real-world public testbeds under GFR Rule 194. Successful pilot deployments qualify for direct GeM scale-up contracts without re-tendering.',
          problem_statement:
            'Field-level agricultural extension officers and local farm clusters lack automated, real-time diagnostic systems to detect bacterial leaf blight, brown plant hoppers, and early rust infestations. Startups are invited to deploy hyperspectral or computer-vision edge systems across 12 designated district testbeds.',
          budget: challengeId === 2 ? 2500000 : 1800000,
          status: 'open',
          category: 'AgriTech & AI',
          tags: ['AI/ML', 'Computer Vision', 'Edge Computing', 'AgriStack', 'GFR 194'],
          deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          expected_outcome:
            'Autonomous edge-inference app operating offline with >92% diagnostic accuracy validated against ICAR reference samples across 5,000 test hectares.',
          creator_id: 1,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } finally {
        setLoading(false);
      }

      // If user is department/evaluator, fetch received proposals
      if (user?.role === 'department' || user?.role === 'evaluator') {
        setProposalsLoading(true);
        try {
          const res = await apiClient.getChallengeProposals(challengeId);
          setProposals(res.data || []);
        } catch (e) {
          setProposals([]);
        } finally {
          setProposalsLoading(false);
        }
      }
    }

    loadChallengeData();
  }, [id, user?.role]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Challenge URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEditModal = () => {
    if (!challenge) return;
    setEditForm({
      title: challenge.title || '',
      category: challenge.category || 'AgriTech & AI',
      budget: challenge.budget || 0,
      status: challenge.status || 'open',
      description: challenge.description || '',
      problem_statement: challenge.problem_statement || '',
      expected_outcome: challenge.expected_outcome || '',
      tagsStr: challenge.tags ? challenge.tags.join(', ') : '',
    });
    setEditModalOpen(true);
  };

  const handleUpdateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    setUpdatingChallenge(true);
    try {
      const tagsArray = editForm.tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const updated = await apiClient.updateChallenge(challenge.id, {
        title: editForm.title,
        category: editForm.category,
        budget: Number(editForm.budget),
        status: editForm.status,
        description: editForm.description,
        problem_statement: editForm.problem_statement,
        expected_outcome: editForm.expected_outcome,
        tags: tagsArray,
      });

      setChallenge({ ...challenge, ...updated });
      toast.success('Challenge updated successfully!');
      setEditModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update challenge');
    } finally {
      setUpdatingChallenge(false);
    }
  };

  const openDeleteModal = () => {
    setConfirmBudget('');
    setConfirmChoice('');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    // Strict Rule 1: Check Budget
    const entered = Number(confirmBudget);
    const actual = Number(challenge.budget);

    if (isNaN(entered) || entered !== actual) {
      toast.error(`Wrong Budget entered (₹${confirmBudget})! Deletion rejected.`);
      return;
    }

    // Strict Rule 2: Check Confirmation Choice
    if (confirmChoice !== 'yes') {
      toast.error('Deletion cancelled! You selected "No" or did not confirm.');
      return;
    }

    setDeletingLoading(true);
    try {
      await apiClient.deleteChallenge(challenge.id);
      toast.success('Challenge deleted successfully!');
      setDeleteModalOpen(false);
      router.push('/challenges');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to delete challenge');
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    if (!proposalForm.title.trim() || !proposalForm.technical_approach.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.createProposal({
        challenge_id: challenge.id,
        title: proposalForm.title,
        description: proposalForm.description || proposalForm.title,
        technical_approach: proposalForm.technical_approach,
        timeline: proposalForm.timeline,
        cost: Number(proposalForm.cost),
        risk_mitigation: 'Standard GFR 194 sandbox risk mitigation and data isolation compliance.'
      });

      toast.success('Proposal submitted successfully! Redirecting to Proposals tracker...');
      setProposalModalOpen(false);
      router.push('/proposals');
    } catch (err: any) {
      console.error('Proposal submission error:', err);
      const rawDetail = err.response?.data?.detail;
      let errorMsg = 'Failed to submit proposal. Please try again.';
      if (typeof rawDetail === 'string') {
        errorMsg = rawDetail;
      } else if (Array.isArray(rawDetail)) {
        errorMsg = rawDetail.map((item: any) => item.msg || JSON.stringify(item)).join(', ');
      } else if (rawDetail && typeof rawDetail === 'object') {
        errorMsg = JSON.stringify(rawDetail);
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading challenge specifications...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Challenge Not Found</h2>
        <p className="text-slate-500">The requested procurement challenge could not be located.</p>
        <Link href="/challenges">
          <Button variant="outline">Back to Challenges</Button>
        </Link>
      </div>
    );
  }

  const canEdit = user && (user.id === challenge.creator_id || user.role === 'department' || user.role === 'admin');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-600 dark:text-slate-300">
            {copied ? <Check className="w-4 h-4 text-green-500 mr-1.5" /> : <Share2 className="w-4 h-4 mr-1.5" />}
            {copied ? 'Copied' : 'Share'}
          </Button>

          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openEditModal}
                className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                Edit Challenge ✏️
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openDeleteModal}
                className="bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete 🗑️
              </Button>
            </div>
          )}

          {user?.role === 'startup' && (
            <Button variant="primary" size="md" onClick={handleOpenProposalModal}>
              <Send className="w-4 h-4 mr-2" />
              Apply / Submit Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 border border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant={statusBadgeVariant[challenge.status] || 'primary'} size="md">
              <span className="capitalize">{challenge.status.replace('_', ' ')}</span>
            </Badge>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              GFR Rule 194 Eligible
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              DPIIT Turnover Exemption
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              ID: PS-SIH26136-CH{challenge.id}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
              {challenge.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {challenge.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Sandbox Grant
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ₹{(challenge.budget / 100000).toFixed(1)} Lakhs
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Submission Deadline
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(challenge.deadline).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Tag className="w-3.5 h-3.5 text-violet-500" />
                Sector / Domain
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {challenge.category}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Pilot Window
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                90-Day Rapid Sandbox
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Problem Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement Section */}
          <Card className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Detailed Problem Statement
              </h2>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {challenge.problem_code || `PRB-SIH26136-${challenge.id}`}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {challenge.problem_statement}
            </p>

            {/* Target Beneficiaries & Technical Requirements Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  Target Beneficiaries
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(challenge.target_beneficiaries && challenge.target_beneficiaries.length > 0
                    ? challenge.target_beneficiaries
                    : ['citizens', 'farmers']
                  ).map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 capitalize"
                    >
                      👥 {b.replace('_', ' ')}
                    </span>
                  ))}
                  {challenge.target_beneficiaries_other && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-300">
                      ✨ {challenge.target_beneficiaries_other}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  Technical Requirements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(challenge.technical_requirements && challenge.technical_requirements.length > 0
                    ? challenge.technical_requirements
                    : ['AI', 'IoT']
                  ).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono"
                    >
                      💻 {t}
                    </span>
                  ))}
                  {challenge.technical_requirements_other && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-300">
                      ⚡ {challenge.technical_requirements_other}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Nodal Officer Contact Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  Issuing Department: {challenge.department_or_ministry || 'Ministry of Electronics & IT'}
                </span>
                <span className="text-[10px] bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">
                  Verified Authority
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Nodal Officer: <strong>{challenge.contact_person_name || 'Rajesh Kumar (Director)'}</strong> • Email: <a href={`mailto:${challenge.contact_email || 'officer@gov.in'}`} className="text-primary-600 underline">{challenge.contact_email || 'officer@gov.in'}</a> • Phone: {challenge.contact_phone || '+91 9876543210'}
              </p>
            </div>
          </Card>

          {/* Expected Deliverables & Milestones */}
          <Card className="p-6 sm:p-7 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Expected Sandbox Outcome & Milestones
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {challenge.expected_outcome}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sandbox Execution Stages (Milestone Escrow Tranches)
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    stage: 'Stage 1: Architecture & Testbed Alignment (30%)',
                    desc: 'Security audit clearance, baseline data telemetry setup, and edge device sandbox registration.',
                  },
                  {
                    stage: 'Stage 2: Live Field Trial Deployment (40%)',
                    desc: 'Operational deployment across designated public test sites with live performance telemetry.',
                  },
                  {
                    stage: 'Stage 3: ICAR / Ministry Sign-off & Scale-Up Certificate (30%)',
                    desc: 'Independent evaluation committee validation, GFR Rule 194 certificate issuance, and GeM direct purchase onboarding.',
                  },
                ].map((m, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.stage}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* If department/ministry/evaluator: Proposals table */}
          {(user?.role === 'department' || user?.role === 'ministry' || user?.role === 'evaluator') && (
            <Card className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Received Proposals ({proposals.length})
                </h2>
                <Link href="/proposals">
                  <Button variant="ghost" size="sm">View All in Tracker →</Button>
                </Link>
              </div>

              {proposalsLoading ? (
                <p className="text-sm text-slate-500">Loading received proposals...</p>
              ) : proposals.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-sm text-slate-500">No proposals submitted for this challenge yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {proposals.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {p.startup_name || 'Startup'} <span className="text-slate-400 font-normal ml-1">({p.title})</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Quote: ₹{(p.cost / 100000).toFixed(2)}L • Timeline: {p.timeline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={p.status === 'accepted' ? 'success' : 'primary'} size="sm">
                          {p.status}
                        </Badge>
                        <button
                          onClick={() => {
                            setChatProposalId(p.id);
                            setChatTitle(`Chat with ${p.startup_name || 'Startup'}`);
                          }}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                          title="Open Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Sovereign Legal & Apply Card */}
        <div className="space-y-6">
          {/* Apply Box for Startups */}
          {user?.role === 'startup' ? (
            <Card className="p-6 border-2 border-primary-500/30 bg-primary-50/20 dark:bg-primary-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Submit Sandbox Proposal</h3>
                  <p className="text-xs text-slate-500">Fast-track pilot approval under SIH26136</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Prior turnover criteria fully exempted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Prior tender experience waived (DPIIT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Escrow milestone tranches protected</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-lg shadow-primary-500/20"
                onClick={handleOpenProposalModal}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply / Submit Proposal
              </Button>
            </Card>
          ) : !user ? (
            <Card className="p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Are you an innovative startup?</h3>
              <p className="text-xs text-slate-500">
                Sign in or register with your DPIIT recognition to apply directly to this public sandbox.
              </p>
              <Link href="/?auth=signin">
                <Button variant="primary" size="md" className="w-full">
                  Sign In to Apply
                </Button>
              </Link>
            </Card>
          ) : null}

          {/* Legal Framework & Statutory Compliance */}
          <Card className="p-6 space-y-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              Sovereign Legal Provisions
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                  GFR 2017 Rule 194
                </span>
                Authorizes direct procurement without fresh public tender once a startup completes defined pilot validation in the approved sandbox.
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                  DoE OM F.20/2/2014-PPD
                </span>
                Mandatory exemption from prior turnover and prior experience criteria for all DPIIT recognized entities.
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                  PFMS Escrow Protection
                </span>
                Allocated grant funds are held in milestone escrow and disbursed automatically within 48 hours of department sign-off.
              </div>
            </div>
          </Card>

          {/* Tags */}
          {challenge.tags && challenge.tags.length > 0 && (
            <Card className="p-5 space-y-3 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Technology Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {challenge.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Interactive Proposal Submission Modal */}
      <AnimatePresence>
        {proposalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary-600" />
                    Submit Sandbox Proposal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Applying for: <span className="font-semibold text-slate-700 dark:text-slate-300">{challenge.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setProposalModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-4">
                {/* Official Acceptance & Entity Info Banner */}
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      Submitting Entity: {startupProfile?.name || user?.organization || 'Registered Enterprise'}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Approved Entity
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    🌐 Company Website: <a href={startupProfile?.website} target="_blank" rel="noreferrer" className="text-emerald-400 font-mono underline">{startupProfile?.website || 'https://company.example.com'}</a>
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium italic pt-1 border-t border-emerald-500/20">
                    "I, on behalf of {startupProfile?.name || 'our company'} ({startupProfile?.website || 'website'}), officially accept this proposal for government evaluation under GFR Rule 194."
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Proposal Title *
                  </label>
                  <Input
                    placeholder="e.g. Edge-Vision Autonomous Pest Diagnostic Appliance"
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Proposed Technical Approach & Architecture *
                  </label>
                  <Textarea
                    placeholder="Explain your technical methodology, sensors/edge models used, accuracy benchmarks, and sandbox testbed plan..."
                    rows={4}
                    value={proposalForm.technical_approach}
                    onChange={(e) => setProposalForm({ ...proposalForm, technical_approach: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Proposed Pilot Budget (₹) *
                    </label>
                    <Input
                      type="number"
                      placeholder="1500000"
                      value={proposalForm.cost}
                      onChange={(e) => setProposalForm({ ...proposalForm, cost: Number(e.target.value) })}
                      required
                    />
                    <span className="text-[11px] text-slate-400">Grant cap: ₹{challenge.budget.toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Timeline *
                    </label>
                    <Input
                      placeholder="e.g. 60 days (3 tranches)"
                      value={proposalForm.timeline}
                      onChange={(e) => setProposalForm({ ...proposalForm, timeline: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    By submitting, your DPIIT Startup India certification is automatically attached. Under GFR Rule 194, achieving milestone acceptance enables direct purchase requisition onboarding.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setProposalModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting to Ministry...' : 'Confirm & Submit Proposal'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Challenge Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-600" />
                    Edit Challenge Details ✏️
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Modifying Challenge ID: <span className="font-semibold text-slate-700 dark:text-slate-300">PS-SIH26136-CH{challenge.id}</span>
                  </p>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateChallenge} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Challenge Title *
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <Input
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Grant Budget (₹) *
                    </label>
                    <Input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Status *
                    </label>
                    <Select
                      options={[
                        { label: 'Open', value: 'open' },
                        { label: 'Evaluating', value: 'evaluating' },
                        { label: 'Pilot Running', value: 'pilot_running' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' },
                      ]}
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Brief Overview Description *
                  </label>
                  <Textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Detailed Problem Statement *
                  </label>
                  <Textarea
                    rows={4}
                    value={editForm.problem_statement}
                    onChange={(e) => setEditForm({ ...editForm, problem_statement: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Expected Sandbox Outcome *
                  </label>
                  <Textarea
                    rows={3}
                    value={editForm.expected_outcome}
                    onChange={(e) => setEditForm({ ...editForm, expected_outcome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <Input
                    placeholder="e.g. AI/ML, Edge Computing, GFR 194"
                    value={editForm.tagsStr}
                    onChange={(e) => setEditForm({ ...editForm, tagsStr: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditModalOpen(false)}
                    disabled={updatingChallenge}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updatingChallenge}
                  >
                    {updatingChallenge ? 'Saving Changes...' : 'Save Changes 💾'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Strict Delete Challenge Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && challenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Delete Challenge Confirmation ⚠️
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Deleting: <span className="font-semibold text-slate-700 dark:text-slate-300">{challenge.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmDelete} className="space-y-5">
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 space-y-1">
                  <p className="font-bold">⚠️ Safety Verification Warning</p>
                  <p>
                    Please enter the exact Budget amount (₹) of this challenge and select "Yes". If either input is incorrect or "No" is chosen, the challenge will NOT be deleted.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Enter exact Challenge Budget (₹) *
                  </label>
                  <Input
                    type="number"
                    placeholder={`Enter budget (Exact: ${challenge.budget})`}
                    value={confirmBudget}
                    onChange={(e) => setConfirmBudget(e.target.value)}
                    required
                  />
                  <span className="text-[11px] text-slate-500">
                    Challenge Grant Budget: ₹{challenge.budget.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    2. Confirm Permanent Deletion? *
                  </label>
                  <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="confirmChoiceDetail"
                        value="yes"
                        checked={confirmChoice === 'yes'}
                        onChange={() => setConfirmChoice('yes')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-600 font-bold">Yes, Delete 🗑️</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="confirmChoiceDetail"
                        value="no"
                        checked={confirmChoice === 'no'}
                        onChange={() => setConfirmChoice('no')}
                        className="w-4 h-4 text-slate-600 focus:ring-slate-500"
                      />
                      <span>No, Keep Challenge</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={deletingLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={deletingLoading}
                  >
                    {deletingLoading ? 'Deleting...' : 'Confirm & Delete 🗑️'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {chatProposalId && (
        <ProposalChat 
          proposalId={chatProposalId} 
          title={chatTitle}
          onClose={() => setChatProposalId(null)} 
        />
      )}
    </>
  );
};

ChallengeDetailPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default ChallengeDetailPage;
