import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Users, BookOpen } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/lib/stores/auth';
import { useAppStore } from '@/lib/stores/app';
import { Layout } from '@/components/Layout';
import { Card, Button } from '@/components/UI';
import { SkeletonCard, SkeletonLine, SkeletonGrid } from '@/components/Skeletons';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, statsLoading, fetchDashboardStats, fetchChallenges, fetchStartups } = useAppStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchChallenges(0, 10);
    fetchStartups(0, 10);
  }, [fetchDashboardStats, fetchChallenges, fetchStartups]);

  // Mock chart data
  const chartData = [
    { month: 'Jan', proposals: 40, pilots: 24 },
    { month: 'Feb', proposals: 30, pilots: 13 },
    { month: 'Mar', proposals: 20, pilots: 9 },
    { month: 'Apr', proposals: 27, pilots: 39 },
    { month: 'May', proposals: 18, pilots: 48 },
    { month: 'Jun', proposals: 23, pilots: 38 },
  ];

  const pieData = [
    { name: 'Open', value: 45 },
    { name: 'Evaluating', value: 30 },
    { name: 'Pilot Running', value: 20 },
    { name: 'Completed', value: 5 },
  ];

  const COLORS = ['#0ea5e9', '#a855f7', '#f59e0b', '#10b981'];

  const statsCards = [
    {
      label: user?.role === 'startup' ? 'Proposals' : 'Challenges',
      value: stats?.proposals || stats?.challenges || 0,
      icon: BookOpen,
      color: 'primary',
    },
    {
      label: 'Pilots',
      value: stats?.pilots || 0,
      icon: Award,
      color: 'secondary',
    },
    {
      label: 'Verification Score',
      value: stats?.verification_score?.toFixed(1) || 'N/A',
      icon: Target,
      color: 'success',
    },
    {
      label: 'Status',
      value: stats?.is_verified ? 'Verified' : 'Pending',
      icon: Users,
      color: stats?.is_verified ? 'success' : 'warning',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Welcome back, {user?.full_name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {user?.role === 'startup' ? 'Explore and submit proposals for government challenges' : 'Manage your procurement challenges and evaluate startups'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statsCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ translateY: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Activity Trend</h2>
          {statsLoading ? (
            <SkeletonCard />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="proposals" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pilots" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie Chart */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Challenge Status</h2>
          {statsLoading ? (
            <SkeletonCard />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Quick Actions</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {user?.role === 'startup' ? (
              <>
                <Button variant="outline" className="w-full">
                  <Link href="/challenges">View Challenges</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/proposals">My Proposals</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/pilots">Active Pilots</Link>
                </Button>
                <Button className="w-full">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" variant="primary">
                  <Link href="/challenges/create">Create Challenge</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/challenges">All Challenges</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/startups">Browse Startups</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/pilots">Manage Pilots</Link>
                </Button>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

DashboardPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default DashboardPage;
