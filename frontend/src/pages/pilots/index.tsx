import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { formatDistanceToNow, format } from 'date-fns';
import type { Pilot } from '@/types';
import type { NextPageWithLayout } from '../_app';

const statusConfig: Record<string, { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'; icon: React.ReactNode }> = {
  negotiation: { color: 'warning', icon: <Clock className="w-4 h-4" /> },
  active:      { color: 'success', icon: <TrendingUp className="w-4 h-4" /> },
  monitoring:  { color: 'info',    icon: <AlertCircle className="w-4 h-4" /> },
  completed:   { color: 'secondary', icon: <CheckCircle2 className="w-4 h-4" /> },
  failed:      { color: 'danger',  icon: <AlertCircle className="w-4 h-4" /> },
};

const PilotsPage: NextPageWithLayout = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPilots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.listPilots(0, 50);
        setPilots(Array.isArray(response) ? response : response.data || []);
      } catch {
        setError('Could not load pilots. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPilots();
  }, []);

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
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Pilots</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor your active and past pilot projects</p>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{error}</h3>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </motion.div>
      ) : pilots.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <FlaskConical className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No pilots yet</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Pilots appear here once a proposal is selected for a pilot project
            </p>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pilots.map((pilot, i) => {
            const config = statusConfig[pilot.status] ?? statusConfig.active;
            return (
              <motion.div
                key={pilot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ translateY: -3 }}
              >
                <Card className="flex flex-col h-full">
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      {config.icon}
                      <span className="text-sm font-medium">Pilot #{pilot.id}</span>
                    </div>
                    <Badge variant={config.color}>
                      <span className="capitalize text-xs">{pilot.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Budget Approved</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                        ₹{(pilot.budget_approved / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Compliance</p>
                    <Badge variant={pilot.compliance_status === 'compliant' ? 'success' : 'warning'}>
                      <span className="capitalize text-xs">{pilot.compliance_status || 'Pending'}</span>
                    </Badge>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    {pilot.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Started {format(new Date(pilot.start_date), 'dd MMM yyyy')}</span>
                      </div>
                    )}
                    {pilot.end_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Ends {formatDistanceToNow(new Date(pilot.end_date), { addSuffix: true })}</span>
                      </div>
                    )}
                    {!pilot.start_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Created {formatDistanceToNow(new Date(pilot.created_at), { addSuffix: true })}</span>
                      </div>
                    )}
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

PilotsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default PilotsPage;
