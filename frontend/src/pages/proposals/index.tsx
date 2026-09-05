import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessagesSquare, DollarSign, Calendar, ArrowRight, FileText, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { formatDistanceToNow } from 'date-fns';
import type { Proposal } from '@/types';
import type { NextPageWithLayout } from '../_app';

const statusColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
  submitted: 'primary',
  under_review: 'warning',
  shortlisted: 'info',
  accepted: 'success',
  rejected: 'danger',
  pilot_selected: 'secondary',
};

const ProposalsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch proposals — the API returns paginated data
        const response = await apiClient.getChallengeProposals(0, 0, 50);
        setProposals(Array.isArray(response) ? response : response.data || []);
      } catch (err: any) {
        // Fallback: try listing without a challenge filter if endpoint requires it
        setError('Could not load proposals. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">My Proposals</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track the status of your submitted proposals
          </p>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <MessagesSquare className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{error}</h3>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </motion.div>
      ) : proposals.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <FileText className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No proposals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Browse challenges and submit your first proposal
            </p>
            <Link href="/challenges">
              <Button variant="primary">Browse Challenges</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {proposals.map((proposal, i) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ translateY: -3 }}
            >
              <Card className="flex flex-col h-full">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg leading-snug line-clamp-2">
                    {proposal.title}
                  </h3>
                  <Badge variant={statusColors[proposal.status] ?? 'primary'} className="ml-2 whitespace-nowrap">
                    <span className="capitalize text-xs">{proposal.status?.replace(/_/g, ' ')}</span>
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                  {proposal.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{(proposal.cost / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{proposal.timeline}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(proposal.submitted_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Score if available */}
                {proposal.evaluation_score > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Evaluation Score:</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${Math.min(100, proposal.evaluation_score)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {proposal.evaluation_score.toFixed(1)}
                    </span>
                  </div>
                )}

                <Link href={`/challenges/${proposal.challenge_id}`} className="mt-4">
                  <Button variant="outline" className="w-full text-sm flex items-center gap-2">
                    View Challenge <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

ProposalsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default ProposalsPage;
