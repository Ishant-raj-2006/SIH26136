import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Globe, Users, Target, Star, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Badge } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { usePagination, useDebouncedSearch } from '@/hooks';
import { useInView } from 'react-intersection-observer';
import type { NextPageWithLayout } from '../_app';

const StartupsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const { startups, startupsLoading, fetchStartups } = useAppStore();
  const { currentPage, totalPages, skip, goToPage } = usePagination(50, 10);
  const { search, setSearch } = useDebouncedSearch(() => goToPage(1));
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    fetchStartups(skip, 10, search);
  }, [skip, search, fetchStartups]);

  const fundingStageColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    pre_seed: 'warning',
    seed: 'primary',
    series_a: 'secondary',
    series_b: 'success',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Discover Startups</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Find innovative startups ready to solve your challenges
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <Input
          placeholder="Search startups by name, industry, or technology..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="text-lg py-3"
        />
      </motion.div>

      {/* Startups Grid */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {startupsLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : startups.map((startup, i) => (
              <motion.div
                key={startup.id}
                variants={itemVariants}
                whileHover={{ translateY: -4 }}
              >
                <Link href={`/startups/${startup.id}`}>
                  <Card className="h-full cursor-pointer group flex flex-col">
                    {/* Logo & Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {startup.logo_url && (
                          <img
                            src={startup.logo_url}
                            alt={startup.name}
                            className="w-12 h-12 rounded-lg mb-2 object-cover"
                          />
                        )}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {startup.name}
                        </h3>
                      </div>
                      {startup.is_verified && (
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                      )}
                    </div>

                    {/* Funding Stage */}
                    <div className="mb-4">
                      <Badge variant={fundingStageColors[startup.funding_stage as keyof typeof fundingStageColors]}>
                        {startup.funding_stage.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                      {startup.description}
                    </p>

                    {/* Verification Score */}
                    {startup.verification_score > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Verification Score
                          </span>
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                            {startup.verification_score.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(startup.verification_score / 10) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {startup.team_size} people
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {startup.founded_year}
                        </span>
                      </div>
                    </div>

                    {/* Technologies */}
                    {startup.technologies.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-1">
                          {startup.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" size="sm">
                              {tech}
                            </Badge>
                          ))}
                          {startup.technologies.length > 3 && (
                            <Badge variant="secondary" size="sm">
                              +{startup.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Button */}
                    <Button variant="outline" className="w-full text-sm mt-auto">
                      View Profile →
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </motion.div>

      {/* Lazy Load Trigger */}
      <div ref={ref} />

      {/* No Results */}
      {!startupsLoading && startups.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <Target className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No startups found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try searching with different keywords
            </p>
          </Card>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                onClick={() => goToPage(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

StartupsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default StartupsPage;
