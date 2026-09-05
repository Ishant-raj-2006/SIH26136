import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Star, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { formatDistanceToNow } from 'date-fns';
import type { Evaluation } from '@/types';
import type { NextPageWithLayout } from '../_app';

const ScoreBar: React.FC<{ label: string; value: number; max?: number }> = ({ label, value, max = 10 }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
      <span>{label}</span>
      <span className="font-semibold text-slate-700 dark:text-slate-300">{value}/{max}</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
      />
    </div>
  </div>
);

const EvaluationsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evaluators see their own evaluations; for now we load with a placeholder
    // In a full implementation you'd have a /api/evaluations endpoint for the current user
    const fetchEvaluations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try proposal ID 0 to get recent evaluations or use a dedicated endpoint
        const response = await apiClient.getProposalEvaluations(0);
        setEvaluations(Array.isArray(response) ? response : response.data || []);
      } catch {
        setError('Could not load evaluations.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const recommendationColor = (rec: string): 'success' | 'danger' | 'warning' => {
    if (rec === 'accept') return 'success';
    if (rec === 'reject') return 'danger';
    return 'warning';
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Evaluations</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {user?.role === 'evaluator'
            ? 'Your submitted evaluations'
            : 'Evaluations on proposals'}
        </p>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : error || evaluations.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <ClipboardList className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No evaluations yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Evaluations will appear here once they are submitted
            </p>
            {error && (
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            )}
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {evaluations.map((evaluation, i) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Proposal #{evaluation.proposal_id}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {evaluation.overall_score.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Overall</p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="space-y-3 mb-4">
                  <ScoreBar label="Technical" value={evaluation.technical_score} />
                  <ScoreBar label="Feasibility" value={evaluation.feasibility_score} />
                  <ScoreBar label="Innovation" value={evaluation.innovation_score} />
                  <ScoreBar label="Cost Efficiency" value={evaluation.cost_score} />
                </div>

                {/* Recommendation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Badge variant={recommendationColor(evaluation.recommendation)}>
                    <span className="capitalize text-xs">{evaluation.recommendation}</span>
                  </Badge>
                </div>

                {/* Feedback */}
                {evaluation.feedback && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Feedback</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

EvaluationsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default EvaluationsPage;
