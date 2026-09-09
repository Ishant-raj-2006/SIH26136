import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessagesSquare, DollarSign, Calendar, ArrowRight, FileText,
  Clock, Check, X, Eye, ChevronRight, Search, ShieldCheck, MessageSquare,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { useAppStore } from '@/lib/stores/app';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button, Input, Select } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { ProposalChat } from '@/components/ProposalChat';
import { formatDistanceToNow } from 'date-fns';
import type { Proposal } from '@/types';
import type { NextPageWithLayout } from '../_app';
import toast from 'react-hot-toast';

const safeDate = (d: any) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? new Date() : date;
};

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Status configs ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  submitted:      { color: 'primary',   label: 'Submitted' },
  under_review:   { color: 'warning',   label: 'Under Review' },
  shortlisted:    { color: 'info',      label: 'Shortlisted' },
  accepted:       { color: 'success',   label: 'Accepted' },
  rejected:       { color: 'danger',    label: 'Rejected' },
  pilot_selected: { color: 'secondary', label: 'Pilot Selected' },
};

// Pipeline steps for startup view
const PIPELINE_STEPS = ['Submitted', 'Under Review', 'Shortlisted', 'Decision'];
const stepIndex = (status: string) => {
  const map: Record<string, number> = {
    submitted: 0, under_review: 1, shortlisted: 2, accepted: 3, rejected: 3, pilot_selected: 3,
  };
  return map[status] ?? 0;
};

// ─── DEPARTMENT: Incoming proposals to review ─────────────────────────────────
const DepartmentProposals: React.FC = () => {
  const { user } = useAuthStore();
  const { challenges } = useAppStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [challengeFilter, setChallengeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Fetch proposals for each challenge
        const allProposals: Proposal[] = [];
        const challengesToFetch = challengeFilter
          ? [{ id: parseInt(challengeFilter) }]
          : challenges.slice(0, 5); // limit for perf

        for (const c of challengesToFetch) {
          try {
            const res = await apiClient.getChallengeProposals(c.id, 0, 20);
            const data = Array.isArray(res) ? res : res.data || [];
            allProposals.push(...data);
          } catch { /* skip */ }
        }
        setProposals(allProposals);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [challenges, search, statusFilter, challengeFilter]);

  const handleAccept = async (id: number) => {
    try {
      await apiClient.acceptProposal(id);
      setProposals(proposals.map(p => p.id === id ? { ...p, status: 'accepted' } : p));
      toast.success('Proposal accepted and Pilot created!');
    } catch (err) {
      console.error('Failed to accept proposal', err);
      toast.error('Failed to accept proposal');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await apiClient.updateProposalStatus(id, status);
      setProposals(proposals.map(p => p.id === id ? { ...p, status } : p));
      toast.success(`Proposal marked as ${status.replace('_', ' ')}`);
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update status');
    }
  };

  const filtered = proposals.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      {activeChatId && <ProposalChat proposalId={activeChatId} onClose={() => setActiveChatId(null)} />}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">Review Proposals</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Evaluate and manage startup proposals submitted to your challenges
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <MessagesSquare className="w-4 h-4" />
          <span>{filtered.length} proposal{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Input
          placeholder="Search proposals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Under Review', value: 'under_review' },
            { label: 'Shortlisted', value: 'shortlisted' },
            { label: 'Accepted', value: 'accepted' },
            { label: 'Rejected', value: 'rejected' },
          ]}
        />
        <Select
          value={challengeFilter}
          onChange={(e) => setChallengeFilter(e.target.value)}
          options={[
            { label: 'All Challenges', value: '' },
            ...challenges.map((c) => ({ label: c.title, value: String(c.id) })),
          ]}
        />
      </motion.div>

      {/* Status summary row */}
      <motion.div variants={item} className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'Submitted', status: 'submitted', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
          { label: 'Under Review', status: 'under_review', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
          { label: 'Shortlisted', status: 'shortlisted', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
          { label: 'Accepted', status: 'accepted', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
        ].map(({ label, status, color }) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
              statusFilter === status ? 'border-primary-300 ring-2 ring-primary-200 dark:ring-primary-800' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <p className={`text-2xl font-bold ${color.split(' ')[2]} ${color.split(' ')[3]}`}>
              {proposals.filter((p) => p.status === status).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </button>
        ))}
      </motion.div>

      {/* Proposals */}
      {loading ? (
        <motion.div variants={item} className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item}>
          <Card className="text-center py-16" hover={false}>
            <FileText className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No proposals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Proposals submitted to your challenges will appear here
            </p>
            <Link href="/challenges/create">
              <Button variant="primary">Create a Challenge</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-4">
          {filtered.map((proposal, i) => {
            const sc = statusConfig[proposal.status] ?? statusConfig.submitted;
            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card hover className="cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0">
                      <MessagesSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {proposal.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Turnover & Experience Waived
                          </span>
                        </div>
                        <Badge variant={sc.color}><span className="text-xs">{sc.label}</span></Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{proposal.description}</p>

                      {/* Meta row */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <DollarSign className="w-3.5 h-3.5" /> ₹{(proposal.cost / 100000).toFixed(1)}L
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" /> {proposal.timeline}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDistanceToNow(safeDate(proposal.submitted_at), { addSuffix: true })}
                        </span>
                        {proposal.evaluation_score > 0 && (
                          <span className="ml-auto text-xs font-semibold text-primary-600 dark:text-primary-400">
                            Score: {proposal.evaluation_score.toFixed(1)}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/challenges/${proposal.challenge_id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full flex items-center gap-1 text-xs">
                        <Eye className="w-3.5 h-3.5" /> View Challenge
                      </Button>
                    </Link>
                    {(proposal.status === 'submitted' || proposal.status === 'under_review' || proposal.status === 'shortlisted') && user?.role !== 'ministry' ? (
                      <>
                        {proposal.status === 'submitted' && (
                          <Button 
                            variant="outline" size="sm" 
                            onClick={() => handleUpdateStatus(proposal.id, 'under_review')}
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          >
                            Reviewing
                          </Button>
                        )}
                        {proposal.status === 'under_review' && (
                          <Button 
                            variant="outline" size="sm" 
                            onClick={() => handleUpdateStatus(proposal.id, 'shortlisted')}
                            className="text-sky-600 border-sky-200 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                          >
                            Shortlist
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAccept(proposal.id)}
                          className="flex items-center gap-1 text-xs text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(proposal.id, 'rejected')}
                          className="flex items-center gap-1 text-xs text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                        <ChevronRight className="w-3.5 h-3.5" /> Details
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveChatId(proposal.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── STARTUP: Pipeline tracker ─────────────────────────────────────────────────
const StartupProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getMyProposals();
        setProposals(Array.isArray(res) ? res : res.data || []);
      } catch {
        setError('Could not load proposals.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = statusFilter ? proposals.filter((p) => p.status === statusFilter) : proposals;

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      {activeChatId && <ProposalChat proposalId={activeChatId} onClose={() => setActiveChatId(null)} />}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">My Proposals</h1>
          <p className="text-slate-500 dark:text-slate-400">Track the status of your submitted proposals</p>
        </div>
        <Link href="/challenges">
          <Button variant="primary" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> Browse Challenges
          </Button>
        </Link>
      </motion.div>

      {/* Pipeline overview */}
      <motion.div variants={item}>
        <Card hover={false}>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Proposal Pipeline</h2>
          <div className="flex items-center">
            {PIPELINE_STEPS.map((step, i) => {
              const count = proposals.filter((p) => stepIndex(p.status) === i).length;
              return (
                <React.Fragment key={step}>
                  <div className="flex-1 text-center">
                    <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-bold mb-2 ${
                      count > 0 ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step}</p>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 rounded-full bg-slate-200 dark:bg-slate-700 mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={item} className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: '' }, ...Object.entries(statusConfig).map(([v, c]) => ({ label: c.label, value: v }))].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              statusFilter === value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : error || filtered.length === 0 ? (
        <motion.div variants={item}>
          <Card className="text-center py-16" hover={false}>
            <FileText className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No proposals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Find a challenge and submit your first proposal</p>
            <Link href="/challenges"><Button variant="primary">Browse Challenges</Button></Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {filtered.map((proposal, i) => {
            const sc = statusConfig[proposal.status] ?? statusConfig.submitted;
            const pStep = stepIndex(proposal.status);
            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ translateY: -3 }}
              >
                <Card className="flex flex-col h-full" hover>
                  {/* Pipeline progress */}
                  <div className="flex items-center gap-1 mb-4">
                    {PIPELINE_STEPS.map((s, si) => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full ${si <= pStep ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 leading-snug line-clamp-2">{proposal.title}</h3>
                    <Badge variant={sc.color}><span className="text-xs whitespace-nowrap">{sc.label}</span></Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{proposal.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ₹{(proposal.cost / 100000).toFixed(1)}L</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {proposal.timeline}</span>
                    <span className="flex items-center gap-1 ml-auto"><Calendar className="w-3.5 h-3.5" /> {formatDistanceToNow(safeDate(proposal.submitted_at), { addSuffix: true })}</span>
                  </div>

                  {proposal.evaluation_score > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Evaluation Score</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">{proposal.evaluation_score.toFixed(1)}/10</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${Math.min(100, proposal.evaluation_score * 10)}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Link href={`/challenges/${proposal.challenge_id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm flex items-center justify-center gap-2">
                        View Challenge <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="primary" 
                      onClick={() => setActiveChatId(proposal.id)}
                      className="text-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Chat
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const ProposalsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const { fetchChallenges } = useAppStore();

  useEffect(() => {
    fetchChallenges(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user?.role === 'department' || user?.role === 'ministry' || user?.role === 'admin') {
    return <DepartmentProposals />;
  }
  // startup (and evaluator redirect to evaluations)
  return <StartupProposals />;
};

ProposalsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default ProposalsPage;
