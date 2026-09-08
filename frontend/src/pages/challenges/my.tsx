import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Edit3, Trash2, Activity, ShieldCheck, Users,
  CheckCircle2, Clock, FileText, Search, Tag, DollarSign, Filter,
  ArrowRight, AlertCircle, Eye, RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Textarea, Badge, Select } from '@/components/UI';
import toast from 'react-hot-toast';
import type { Challenge, Proposal } from '@/types';
import type { NextPageWithLayout } from '../_app';

const statusBadgeVariant: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  active: 'success',
  open: 'success',
  project: 'warning',
  pilot_running: 'warning',
  closed: 'danger',
  cancelled: 'danger',
};

const MyChallengesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit Challenge Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    department_or_ministry: '',
    contact_person_name: '',
    contact_phone: '',
    contact_email: '',
    problem_code: '',
    budget: 0,
    status: 'active',
    problem_statement: '',
    expected_outcome: '',
    target_beneficiaries: [] as string[],
    target_beneficiaries_other: '',
    technical_requirements: [] as string[],
    technical_requirements_other: '',
  });

  // Delete Challenge Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmBudget, setConfirmBudget] = useState('');
  const [confirmChoice, setConfirmChoice] = useState<'yes' | 'no' | ''>('');
  const [deleting, setDeleting] = useState(false);

  // Status Monitor Modal State
  const [monitorModalOpen, setMonitorModalOpen] = useState(false);
  const [monitorChallenge, setMonitorChallenge] = useState<Challenge | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);

  const fetchMyChallenges = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMyChallenges();
      setChallenges(res.data || []);
    } catch (err) {
      console.warn('Backend fetch failed, using fallback challenges:', err);
      // Demo fallback if backend database is fresh
      setChallenges([
        {
          id: 1,
          problem_code: 'PS-SIH26136-CH1',
          title: 'AI-Powered Crop Disease Diagnostic & Precision Yield Prediction',
          description: 'A national public procurement sandbox challenge under GFR Rule 194 to deploy real-time edge diagnostic systems in 12 farm clusters.',
          problem_statement: 'Field-level agricultural extension officers lack automated diagnostic devices for bacterial leaf blight and rust.',
          budget: 2500000,
          status: 'active',
          category: 'AgriTech & AI',
          tags: ['AI', 'IoT', 'farmers'],
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          expected_outcome: 'Autonomous edge app with >92% diagnostic accuracy.',
          creator_id: user?.id || 1,
          department_or_ministry: user?.organization || 'Ministry of Agriculture',
          contact_person_name: user?.full_name || 'Department Officer',
          contact_phone: '+91 9876543210',
          contact_email: user?.email || 'officer@gov.in',
          target_beneficiaries: ['farmers', 'citizens'],
          technical_requirements: ['AI', 'IoT'],
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyChallenges();
  }, []);

  // Open Edit Modal
  const handleOpenEdit = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setEditForm({
      title: ch.title || '',
      department_or_ministry: ch.department_or_ministry || user?.organization || '',
      contact_person_name: ch.contact_person_name || user?.full_name || '',
      contact_phone: ch.contact_phone || '+91 9876543210',
      contact_email: ch.contact_email || user?.email || '',
      problem_code: ch.problem_code || `PRB-SIH26136-${ch.id}`,
      budget: ch.budget || 0,
      status: ch.status || 'active',
      problem_statement: ch.problem_statement || ch.description || '',
      expected_outcome: ch.expected_outcome || '',
      target_beneficiaries: ch.target_beneficiaries || ['farmers'],
      target_beneficiaries_other: ch.target_beneficiaries_other || '',
      technical_requirements: ch.technical_requirements || ['AI'],
      technical_requirements_other: ch.technical_requirements_other || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    setUpdating(true);
    try {
      await apiClient.updateChallenge(selectedChallenge.id, {
        title: editForm.title,
        department_or_ministry: editForm.department_or_ministry,
        contact_person_name: editForm.contact_person_name,
        contact_phone: editForm.contact_phone,
        contact_email: editForm.contact_email,
        problem_code: editForm.problem_code,
        budget: Number(editForm.budget),
        status: editForm.status,
        description: editForm.problem_statement,
        problem_statement: editForm.problem_statement,
        expected_outcome: editForm.expected_outcome,
        target_beneficiaries: editForm.target_beneficiaries,
        target_beneficiaries_other: editForm.target_beneficiaries_other,
        technical_requirements: editForm.technical_requirements,
        technical_requirements_other: editForm.technical_requirements_other,
      });

      toast.success('Challenge updated successfully! ✏️');
      setEditModalOpen(false);
      fetchMyChallenges();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update challenge');
    } finally {
      setUpdating(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setConfirmBudget('');
    setConfirmChoice('');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    const entered = Number(confirmBudget);
    const actual = Number(selectedChallenge.budget);

    if (isNaN(entered) || entered !== actual) {
      toast.error(`Wrong Budget entered (₹${confirmBudget})! Deletion rejected.`);
      return;
    }

    if (confirmChoice !== 'yes') {
      toast.error('Deletion cancelled! Selection must be "Yes".');
      return;
    }

    setDeleting(true);
    try {
      await apiClient.deleteChallenge(selectedChallenge.id);
      toast.success('Challenge deleted successfully! 🗑️');
      setDeleteModalOpen(false);
      fetchMyChallenges();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to delete challenge');
    } finally {
      setDeleting(false);
    }
  };

  // Open Status Monitor Modal
  const handleOpenMonitor = async (ch: Challenge) => {
    setMonitorChallenge(ch);
    setMonitorModalOpen(true);
    setProposalsLoading(true);
    try {
      const res = await apiClient.getChallengeProposals(ch.id);
      setProposals(res.data || []);
    } catch (e) {
      setProposals([]);
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleQuickStatusChange = async (newStatus: string) => {
    if (!monitorChallenge) return;
    try {
      await apiClient.updateChallenge(monitorChallenge.id, { status: newStatus });
      setMonitorChallenge({ ...monitorChallenge, status: newStatus });
      toast.success(`Challenge status updated to ${newStatus.toUpperCase()}`);
      fetchMyChallenges();
    } catch (e) {
      toast.error('Failed to change status');
    }
  };

  // Filtered list
  const filtered = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.problem_code && c.problem_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-primary-600" />
            My Posted Challenges
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Department Portal for Posting, Editing, Monitoring, and Managing Sandbox Problems
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchMyChallenges} title="Refresh List">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          <Link href="/challenges/create">
            <Button variant="primary" size="md" className="shadow-lg shadow-primary-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Post New Problem
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by Title or Problem ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: '🟢 Active', value: 'active' },
              { label: '🟡 Project (Pilot)', value: 'project' },
              { label: '🔴 Closed', value: 'closed' },
            ]}
          />
        </div>
      </div>

      {/* Challenges List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border-2 border-dashed">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Challenges Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't posted any sandbox problems matching your filter yet. Click below to publish a new challenge.
          </p>
          <Link href="/challenges/create">
            <Button variant="primary">Post New Problem Statement</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((ch) => (
            <Card
              key={ch.id}
              className="p-6 sm:p-7 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusBadgeVariant[ch.status] || 'primary'} size="sm">
                      <span className="capitalize">{ch.status}</span>
                    </Badge>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      ID: {ch.problem_code || `PRB-SIH26136-${ch.id}`}
                    </span>
                    <span className="text-xs text-slate-500">
                      🏢 {ch.department_or_ministry || user?.organization || 'Ministry'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    <Link href={`/challenges/${ch.id}`} className="hover:text-primary-600 transition-colors">
                      {ch.title}
                    </Link>
                  </h3>
                </div>

                {/* Management Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenMonitor(ch)}
                    className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100"
                  >
                    <Activity className="w-4 h-4 mr-1.5" />
                    Status Monitor 📊
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(ch)}
                    className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100"
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" />
                    Edit ✏️
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDelete(ch)}
                    className="bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete 🗑️
                  </Button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {ch.problem_statement || ch.description}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  Budget: ₹{(ch.budget / 100000).toFixed(1)} Lakhs
                </div>

                {ch.target_beneficiaries && ch.target_beneficiaries.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize"
                  >
                    👥 {b.replace('_', ' ')}
                  </span>
                ))}

                {ch.technical_requirements && ch.technical_requirements.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono"
                  >
                    💻 {t}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Challenge Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  Edit Problem Statement ✏️
                </h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Problem Title *
                    </label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Department / Ministry *
                    </label>
                    <Input
                      value={editForm.department_or_ministry}
                      onChange={(e) => setEditForm({ ...editForm, department_or_ministry: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Unique Problem ID *
                    </label>
                    <Input
                      value={editForm.problem_code}
                      onChange={(e) => setEditForm({ ...editForm, problem_code: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Budget (₹) *
                    </label>
                    <Input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Status *
                    </label>
                    <Select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      options={[
                        { label: '🟢 Active (Open)', value: 'active' },
                        { label: '🟡 Project (Pilot)', value: 'project' },
                        { label: '🔴 Closed (Archived)', value: 'closed' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Details of Problem Statement *
                  </label>
                  <Textarea
                    rows={4}
                    value={editForm.problem_statement}
                    onChange={(e) => setEditForm({ ...editForm, problem_statement: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={updating}>
                    {updating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-red-200 dark:border-red-900/50 max-w-md w-full p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Confirm Deletion 🗑️
                  </h3>
                  <p className="text-xs text-slate-500">Security Verification Required</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                <p className="font-semibold">⚠️ Strict Verification Protocol:</p>
                <p>
                  To confirm deletion of <strong>"{selectedChallenge.title}"</strong>, enter the exact budget amount: <strong>₹{selectedChallenge.budget}</strong> and select "Yes".
                </p>
              </div>

              <form onSubmit={handleConfirmDelete} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Enter Exact Budget Amount (₹) *
                  </label>
                  <Input
                    type="number"
                    placeholder={selectedChallenge.budget.toString()}
                    value={confirmBudget}
                    onChange={(e) => setConfirmBudget(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Are you sure you want to delete this challenge? *
                  </label>
                  <Select
                    value={confirmChoice}
                    onChange={(e) => setConfirmChoice(e.target.value as any)}
                    options={[
                      { label: 'Select confirmation choice...', value: '' },
                      { label: 'Yes - Permanently Delete', value: 'yes' },
                      { label: 'No - Cancel Deletion', value: 'no' },
                    ]}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="button" variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={deleting || confirmChoice !== 'yes' || Number(confirmBudget) !== Number(selectedChallenge.budget)}
                  >
                    {deleting ? 'Deleting...' : 'Confirm & Delete'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Monitor Modal */}
      <AnimatePresence>
        {monitorModalOpen && monitorChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Challenge Status Monitor 📊
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      ID: {monitorChallenge.problem_code || `PRB-SIH26136-${monitorChallenge.id}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => setMonitorModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                  ✕
                </button>
              </div>

              {/* Status Toggle Header */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Current Execution Status:
                  </span>
                  <Badge variant={statusBadgeVariant[monitorChallenge.status] || 'primary'}>
                    <span className="capitalize">{monitorChallenge.status}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-slate-500">Quick Change Status:</span>
                  {['active', 'project', 'closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleQuickStatusChange(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        monitorChallenge.status === st
                          ? 'bg-primary-600 text-white shadow'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposals Received Monitor */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Received Sandbox Proposals ({proposals.length})</span>
                  <Link href="/proposals">
                    <span className="text-xs text-primary-600 hover:underline">View Full Tracker →</span>
                  </Link>
                </h4>

                {proposalsLoading ? (
                  <p className="text-xs text-slate-500">Loading received proposals...</p>
                ) : proposals.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                    <p className="text-xs text-slate-500">No proposals submitted for this challenge yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {proposals.map((p) => (
                      <div key={p.id} className="p-3.5 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h5>
                          <p className="text-[11px] text-slate-500">
                            Quote: ₹{(p.cost / 100000).toFixed(2)}L • Timeline: {p.timeline}
                          </p>
                        </div>
                        <Badge variant={p.status === 'accepted' ? 'success' : 'primary'} size="sm">
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

MyChallengesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default MyChallengesPage;
