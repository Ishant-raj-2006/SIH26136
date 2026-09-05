import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Star, MessageSquare, ChevronDown, ChevronUp,
  Check, AlertCircle, Clock, TrendingUp,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button, Textarea, Select } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { formatDistanceToNow } from 'date-fns';
import type { Evaluation } from '@/types';
import type { NextPageWithLayout } from '../_app';

const fade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// ─── Score bar ─────────────────────────────────────────────────────────────────
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

// ─── Slider input ──────────────────────────────────────────────────────────────
const ScoreSlider: React.FC<{
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, description, value, onChange }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <span className={`text-xl font-bold w-12 text-center ${value >= 8 ? 'text-green-600' : value >= 5 ? 'text-amber-600' : 'text-red-500'}`}>
        {value}
      </span>
    </div>
    <input
      type="range"
      min={0}
      max={10}
      step={0.5}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 appearance-none rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer accent-primary-600"
    />
    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
      <span>0</span><span>5</span><span>10</span>
    </div>
  </div>
);

// ─── Mock pending proposals for evaluators ─────────────────────────────────────
const pendingProposals = [
  { id: 12, title: 'AI-Based Traffic Prediction System', startup: 'FlowAI Labs', challengeId: 3, challengeTitle: 'Smart Traffic Management', deadline: '2 days', urgent: true },
  { id: 15, title: 'Blockchain-Based Land Records System', startup: 'LedgerTech Solutions', challengeId: 5, challengeTitle: 'Digital Land Registry', deadline: '5 days', urgent: false },
  { id: 19, title: 'IoT-Enabled Water Quality Monitor', startup: 'AquaSense Co.', challengeId: 7, challengeTitle: 'Smart Water Management', deadline: '8 days', urgent: false },
];

// ─── EVALUATOR VIEW ────────────────────────────────────────────────────────────
const EvaluatorEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProposal, setActiveProposal] = useState<number | null>(null);

  // Scoring state
  const [scores, setScores] = useState({
    technical: 5,
    feasibility: 5,
    innovation: 5,
    cost: 5,
  });
  const [feedback, setFeedback] = useState('');
  const [recommendation, setRecommendation] = useState('review');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number[]>([]);

  useEffect(() => {
    apiClient.getProposalEvaluations(0)
      .then((res) => setEvaluations(Array.isArray(res) ? res : res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const overall = ((scores.technical + scores.feasibility + scores.innovation + scores.cost) / 4).toFixed(1);

  const handleSubmitEvaluation = async (proposalId: number) => {
    setSubmitting(true);
    try {
      await apiClient.createEvaluation({
        proposal_id: proposalId,
        technical_score: scores.technical,
        feasibility_score: scores.feasibility,
        innovation_score: scores.innovation,
        cost_score: scores.cost,
        overall_score: parseFloat(overall),
        feedback,
        recommendation,
      });
      setSubmitted((prev) => [...prev, proposalId]);
      setActiveProposal(null);
      setScores({ technical: 5, feasibility: 5, innovation: 5, cost: 5 });
      setFeedback('');
      setRecommendation('review');
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">My Evaluations</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Evaluate startup proposals with structured scoring criteria
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 grid-cols-3">
        <Card hover={false} className="text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingProposals.filter(p => !submitted.includes(p.id)).length}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{evaluations.length + submitted.length}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">7.4</p>
          <p className="text-xs text-slate-500 mt-1">Avg Score</p>
        </Card>
      </motion.div>

      {/* Pending proposals queue */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Pending Review Queue
        </h2>
        <div className="space-y-4">
          {pendingProposals.filter(p => !submitted.includes(p.id)).map((proposal) => (
            <div key={proposal.id}>
              {/* Proposal header */}
              <div
                onClick={() => setActiveProposal(activeProposal === proposal.id ? null : proposal.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  proposal.urgent
                    ? 'border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                } ${activeProposal === proposal.id ? 'ring-2 ring-primary-200 dark:ring-primary-800' : 'hover:border-primary-200 dark:hover:border-primary-800/40 hover:shadow-sm'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  proposal.urgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  {proposal.urgent
                    ? <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    : <ClipboardList className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">{proposal.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{proposal.startup} · Challenge: {proposal.challengeTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={proposal.urgent ? 'danger' : 'warning'}>
                        <span className="text-xs">Due in {proposal.deadline}</span>
                      </Badge>
                      {activeProposal === proposal.id
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded evaluation form */}
              <AnimatePresence>
                {activeProposal === proposal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <Card hover={false} className="mt-1 border-t-0 rounded-t-none border-primary-200 dark:border-primary-800/40 bg-primary-50/30 dark:bg-primary-900/10">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-5">
                        Evaluation Form — Proposal #{proposal.id}
                      </h3>

                      {/* Scoring criteria */}
                      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 mb-6">
                        <ScoreSlider
                          label="Technical Soundness"
                          description="Quality of technical approach & architecture"
                          value={scores.technical}
                          onChange={(v) => setScores((s) => ({ ...s, technical: v }))}
                        />
                        <ScoreSlider
                          label="Feasibility"
                          description="Realistic timeline & resource requirements"
                          value={scores.feasibility}
                          onChange={(v) => setScores((s) => ({ ...s, feasibility: v }))}
                        />
                        <ScoreSlider
                          label="Innovation"
                          description="Novelty & differentiation of the solution"
                          value={scores.innovation}
                          onChange={(v) => setScores((s) => ({ ...s, innovation: v }))}
                        />
                        <ScoreSlider
                          label="Cost Efficiency"
                          description="Value for money & budget justification"
                          value={scores.cost}
                          onChange={(v) => setScores((s) => ({ ...s, cost: v }))}
                        />
                      </div>

                      {/* Overall score display */}
                      <div className={`flex items-center gap-4 p-4 rounded-xl mb-5 ${
                        parseFloat(overall) >= 7 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40'
                        : parseFloat(overall) >= 5 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40'
                      }`}>
                        <div className="text-center">
                          <p className="text-4xl font-black text-slate-900 dark:text-slate-50">{overall}</p>
                          <p className="text-xs text-slate-500">Overall Score</p>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                          <span className="text-slate-500">Technical: <strong>{scores.technical}</strong></span>
                          <span className="text-slate-500">Feasibility: <strong>{scores.feasibility}</strong></span>
                          <span className="text-slate-500">Innovation: <strong>{scores.innovation}</strong></span>
                          <span className="text-slate-500">Cost: <strong>{scores.cost}</strong></span>
                        </div>
                      </div>

                      {/* Feedback & recommendation */}
                      <div className="grid gap-4 mb-5">
                        <Textarea
                          label="Feedback (required)"
                          placeholder="Provide detailed feedback on the proposal's strengths, weaknesses, and specific areas for improvement..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={4}
                        />
                        <Select
                          label="Recommendation"
                          value={recommendation}
                          onChange={(e) => setRecommendation(e.target.value)}
                          options={[
                            { label: '✅ Accept — Proceed to Pilot', value: 'accept' },
                            { label: '🔄 Review — Needs Revision', value: 'review' },
                            { label: '❌ Reject — Not Suitable', value: 'reject' },
                          ]}
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          onClick={() => handleSubmitEvaluation(proposal.id)}
                          isLoading={submitting}
                          disabled={!feedback.trim() || submitting}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Submit Evaluation
                        </Button>
                        <Button variant="ghost" onClick={() => setActiveProposal(null)}>Cancel</Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submitted indicator */}
              {submitted.includes(proposal.id) && (
                <div className="mt-1 flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">Evaluation submitted</span>
                </div>
              )}
            </div>
          ))}

          {pendingProposals.filter(p => !submitted.includes(p.id)).length === 0 && (
            <Card hover={false} className="text-center py-10">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">All caught up!</h3>
              <p className="text-sm text-slate-500">No pending evaluations</p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Past evaluations */}
      {evaluations.length > 0 && (
        <motion.div variants={item}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Completed Evaluations
          </h2>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {evaluations.map((evaluation, i) => (
              <motion.div key={evaluation.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Proposal #{evaluation.proposal_id}</p>
                        <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{evaluation.overall_score.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">/ 10</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <ScoreBar label="Technical"   value={evaluation.technical_score}   />
                    <ScoreBar label="Feasibility" value={evaluation.feasibility_score} />
                    <ScoreBar label="Innovation"  value={evaluation.innovation_score}  />
                    <ScoreBar label="Cost"        value={evaluation.cost_score}        />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Badge variant={evaluation.recommendation === 'accept' ? 'success' : evaluation.recommendation === 'reject' ? 'danger' : 'warning'}>
                      <span className="capitalize text-xs">{evaluation.recommendation}</span>
                    </Badge>
                  </div>
                  {evaluation.feedback && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1"><MessageSquare className="w-3 h-3" /> Feedback</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{evaluation.feedback}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── DEPARTMENT VIEW (read-only evaluations on their challenges) ───────────────
const DepartmentEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProposalEvaluations(0)
      .then((res) => setEvaluations(Array.isArray(res) ? res : res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">Expert Evaluations</h1>
        <p className="text-slate-500 dark:text-slate-400">Independent expert evaluations on proposals for your challenges</p>
      </motion.div>

      {loading ? (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : evaluations.length === 0 ? (
        <motion.div variants={item}>
          <Card className="text-center py-16" hover={false}>
            <ClipboardList className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No evaluations yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Expert evaluations appear here once evaluators submit their assessments</p>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {evaluations.map((evaluation, i) => (
            <motion.div key={evaluation.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Proposal #{evaluation.proposal_id}</p>
                    <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{evaluation.overall_score.toFixed(1)}</p>
                    <p className="text-xs text-slate-500">/ 10</p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  <ScoreBar label="Technical"   value={evaluation.technical_score}   />
                  <ScoreBar label="Feasibility" value={evaluation.feasibility_score} />
                  <ScoreBar label="Innovation"  value={evaluation.innovation_score}  />
                  <ScoreBar label="Cost"        value={evaluation.cost_score}        />
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Badge variant={evaluation.recommendation === 'accept' ? 'success' : evaluation.recommendation === 'reject' ? 'danger' : 'warning'}>
                    <span className="capitalize text-xs">Expert recommends: {evaluation.recommendation}</span>
                  </Badge>
                </div>
                {evaluation.feedback && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Expert Feedback</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{evaluation.feedback}</p>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const EvaluationsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  return user?.role === 'evaluator' ? <EvaluatorEvaluations /> : <DepartmentEvaluations />;
};

EvaluationsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default EvaluationsPage;
