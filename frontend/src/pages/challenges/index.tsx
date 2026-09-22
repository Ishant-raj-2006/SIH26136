import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, Tag, Search, Plus, TrendingUp, Edit3, Trash2, X, Check, Building2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Badge, Select, Textarea } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { usePagination, useDebouncedSearch } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import type { Challenge } from '@/types';
import type { NextPageWithLayout } from '../_app';

const ChallengesPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const { challenges, challengesLoading, fetchChallenges } = useAppStore();
  const { currentPage, totalPages, skip, goToPage, nextPage, prevPage } = usePagination(50, 10);
  const { search, setSearch } = useDebouncedSearch((query) => {
    goToPage(1);
  });

  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (router.isReady && router.query.status && typeof router.query.status === 'string') {
      setStatusFilter(router.query.status);
    }
  }, [router.isReady, router.query.status]);
  const [viewMyOnly, setViewMyOnly] = useState(false);

  // Edit Challenge Modal state
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [updating, setUpdating] = useState(false);
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

  // Delete Challenge Modal state
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);
  const [confirmBudget, setConfirmBudget] = useState('');
  const [confirmChoice, setConfirmChoice] = useState<'yes' | 'no' | ''>('');
  const [deletingLoading, setDeletingLoading] = useState(false);

  useEffect(() => {
    const creatorId = viewMyOnly && user ? user.id : undefined;
    fetchChallenges(skip, 10, statusFilter || undefined, undefined, creatorId);
  }, [skip, statusFilter, viewMyOnly, user, fetchChallenges]);

  const openEditModal = (e: React.MouseEvent, challenge: Challenge) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChallenge(challenge);
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
  };

  const openDeleteModal = (e: React.MouseEvent, challenge: Challenge) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingChallenge(challenge);
    setConfirmBudget('');
    setConfirmChoice('');
  };

  const handleUpdateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    setUpdating(true);
    try {
      const tagsArray = editForm.tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await apiClient.updateChallenge(editingChallenge.id, {
        title: editForm.title,
        category: editForm.category,
        budget: Number(editForm.budget),
        status: editForm.status,
        description: editForm.description,
        problem_statement: editForm.problem_statement,
        expected_outcome: editForm.expected_outcome,
        tags: tagsArray,
      });

      toast.success('Challenge updated successfully!');
      setEditingChallenge(null);

      // Refresh challenge list
      const creatorId = viewMyOnly && user ? user.id : undefined;
      fetchChallenges(skip, 10, statusFilter || undefined, undefined, creatorId);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update challenge');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingChallenge) return;

    // Strict Rule 1: Check Budget
    const entered = Number(confirmBudget);
    const actual = Number(deletingChallenge.budget);

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
      await apiClient.deleteChallenge(deletingChallenge.id);
      toast.success('Challenge deleted successfully!');
      setDeletingChallenge(null);

      // Refresh list
      const creatorId = viewMyOnly && user ? user.id : undefined;
      fetchChallenges(skip, 10, statusFilter || undefined, undefined, creatorId);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to delete challenge');
    } finally {
      setDeletingLoading(false);
    }
  };

  const statusColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    open: 'success',
    evaluating: 'primary',
    pilot_running: 'secondary',
    completed: 'success',
    cancelled: 'danger',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Challenges</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {user?.role === 'startup' ? 'Find and apply to government challenges' : 'Explore and manage national procurement challenges'}
          </p>
        </div>
        {user?.role === 'department' && (
          <Button variant="primary" className="sm:w-auto">
            <Link href="/challenges/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Challenge
            </Link>
          </Button>
        )}
      </motion.div>

      {/* Role View Tabs for Government / Department or logged in users */}
      {user && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Button
            variant={!viewMyOnly ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMyOnly(false)}
          >
            All Public Challenges
          </Button>
          <Button
            variant={viewMyOnly ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMyOnly(true)}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            My Posted Challenges 🏛️
          </Button>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={itemVariants} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
        <Select
          options={[
            { label: 'All Status', value: '' },
            { label: 'Open', value: 'open' },
            { label: 'Evaluating', value: 'evaluating' },
            { label: 'Pilot Running', value: 'pilot_running' },
            { label: 'Completed', value: 'completed' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          options={[
            { label: 'Latest', value: 'latest' },
            { label: 'Budget: High to Low', value: 'budget_high' },
            { label: 'Budget: Low to High', value: 'budget_low' },
          ]}
        />
      </motion.div>

      {/* Challenges Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {challengesLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : challenges.map((challenge, i) => {
              const canEdit = user && (user.id === challenge.creator_id || user.role === 'department' || user.role === 'admin');

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ translateY: -4 }}
                >
                  <Card className="h-full cursor-pointer group flex flex-col relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div>
                        <Badge variant="primary" className="mb-2">
                          {challenge.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {challenge.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={statusColors[challenge.status] || 'primary'}>
                          <span className="capitalize text-xs">{challenge.status.replace('_', ' ')}</span>
                        </Badge>

                        {/* Edit & Delete Buttons for Department / Creator */}
                        {canEdit && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => openEditModal(e, challenge)}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 dark:text-amber-300 transition-colors"
                              title="Edit Challenge"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit ✏️</span>
                            </button>
                            <button
                              onClick={(e) => openDeleteModal(e, challenge)}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-900 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 transition-colors"
                              title="Delete Challenge"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete 🗑️</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                      {challenge.description}
                    </p>

                    {/* Footer */}
                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{(challenge.budget / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{challenge.deadline ? formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true }) : 'Active'}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {challenge.tags && challenge.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {challenge.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Link href={`/challenges/${challenge.id}`}>
                        <Button variant="outline" className="w-full text-sm">
                          View Details →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
      </motion.div>

      {/* No Results */}
      {!challengesLoading && challenges.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No challenges found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {viewMyOnly ? 'You have not posted any challenges yet.' : 'Try adjusting your filters or come back later.'}
            </p>
            {user?.role === 'department' && (
              <Button variant="primary">
                <Link href="/challenges/create">Create First Challenge</Link>
              </Button>
            )}
          </Card>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  onClick={() => goToPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </motion.div>
      )}

      {/* Interactive Edit Challenge Modal */}
      <AnimatePresence>
        {editingChallenge && (
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
                    Modifying Challenge ID: <span className="font-semibold text-slate-700 dark:text-slate-300">PS-SIH26136-CH{editingChallenge.id}</span>
                  </p>
                </div>
                <button
                  onClick={() => setEditingChallenge(null)}
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
                    onClick={() => setEditingChallenge(null)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updating}
                  >
                    {updating ? 'Saving Changes...' : 'Save Changes 💾'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Strict Delete Challenge Confirmation Modal */}
      <AnimatePresence>
        {deletingChallenge && (
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
                    Deleting: <span className="font-semibold text-slate-700 dark:text-slate-300">{deletingChallenge.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setDeletingChallenge(null)}
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
                    placeholder={`Enter budget (Exact: ${deletingChallenge.budget})`}
                    value={confirmBudget}
                    onChange={(e) => setConfirmBudget(e.target.value)}
                    required
                  />
                  <span className="text-[11px] text-slate-500">
                    Challenge Grant Budget: ₹{deletingChallenge.budget.toLocaleString('en-IN')}
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
                        name="confirmChoice"
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
                        name="confirmChoice"
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
                    onClick={() => setDeletingChallenge(null)}
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
    </motion.div>
  );
};

ChallengesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default ChallengesPage;

