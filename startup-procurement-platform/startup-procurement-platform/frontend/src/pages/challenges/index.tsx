import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Tag, Search, Plus, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Badge, Select } from '@/components/UI';
import { SkeletonCard, SkeletonGrid } from '@/components/Skeletons';
import { usePagination, useDebouncedSearch } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';

const ChallengesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { challenges, challengesLoading, fetchChallenges } = useAppStore();
  const { currentPage, totalPages, skip, goToPage, nextPage, prevPage } = usePagination(50, 10);
  const { search, setSearch } = useDebouncedSearch((query) => {
    goToPage(1);
    // Filter would happen here
  });

  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    fetchChallenges(skip, 10, statusFilter);
  }, [skip, statusFilter, fetchChallenges]);

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
            {user?.role === 'startup' ? 'Find and apply to government challenges' : 'Manage your procurement challenges'}
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
          : challenges.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ translateY: -4 }}
              >
                <Link href={`/challenges/${challenge.id}`}>
                  <Card className="h-full cursor-pointer group flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="primary" className="mb-2">
                          {challenge.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {challenge.title}
                        </h3>
                      </div>
                      <Badge variant={statusColors[challenge.status]}>
                        <span className="capitalize text-xs">{challenge.status.replace('_', ' ')}</span>
                      </Badge>
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
                          <span>{formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true })}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {challenge.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {challenge.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button variant="outline" className="w-full text-sm">
                        View Details →
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </motion.div>

      {/* No Results */}
      {!challengesLoading && challenges.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No challenges found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or come back later
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
    </motion.div>
  );
};

ChallengesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default ChallengesPage;
