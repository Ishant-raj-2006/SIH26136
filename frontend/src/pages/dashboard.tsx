import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  TrendingUp, Plus, ArrowRight, MessagesSquare,
  CheckSquare, Clock, DollarSign, ShieldCheck, Rocket,
  ClipboardList, FlaskConical, AlertCircle, BarChart2, Star, Target,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuthStore } from '@/lib/stores/auth';
import { useAppStore } from '@/lib/stores/app';
import { Layout } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import type { NextPageWithLayout } from './_app';

const COLORS = ['#0ea5e9', '#a855f7', '#f59e0b', '#10b981'];

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  gradient?: string;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, sub, gradient = 'from-primary-500 to-secondary-500' }) => (
  <motion.div whileHover={{ translateY: -4 }} transition={{ duration: 0.2 }}>
    <Card className="relative overflow-hidden" hover={false}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-8 -mt-8`} />
      <div className="relative z-10">
        <div className={`w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
          {icon}
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
        {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>}
      </div>
    </Card>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTION CARD
// ─────────────────────────────────────────────────────────────────────────────
interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  primary?: boolean;
}
const ActionCard: React.FC<ActionCardProps> = ({ title, description, href, icon, primary }) => (
  <Link href={href}>
    <motion.div
      whileHover={{ translateY: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
        primary
          ? 'border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 dark:border-primary-800/40 hover:shadow-md'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800/40 hover:shadow-sm'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        primary
          ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-sm'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900 dark:text-slate-50">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
    </motion.div>
  </Link>
);

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const DepartmentDashboard: React.FC<{ stats: any; loading: boolean; challenges: any[] }> = ({
  stats, loading, challenges,
}) => {
  const router = useRouter();
  const activityData = stats?.activity_data?.length > 0 ? stats.activity_data : [
    { month: 'Apr', proposals: 0, pilots: 0 },
    { month: 'May', proposals: 0, pilots: 0 },
    { month: 'Jun', proposals: 0, pilots: 0 },
    { month: 'Jul', proposals: 0, pilots: 0 },
    { month: 'Aug', proposals: 0, pilots: 0 },
    { month: 'Sep', proposals: 0, pilots: 0 },
  ];
  const statusData = stats?.status_data?.length > 0 ? stats.status_data.map((s: any) => ({
    name: s.name.charAt(0).toUpperCase() + s.name.slice(1).replace('_', ' '),
    value: s.value
  })) : [
    { name: 'No Data', value: 1 },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">Department Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your procurement challenges and track startup pilots
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Active Challenges"  value={stats?.challenges ?? 0}      icon={<ClipboardList className="w-5 h-5" />} gradient="from-blue-500 to-cyan-500" />
            <StatCard label="Proposals Received" value={stats?.proposals ?? 0}       icon={<MessagesSquare className="w-5 h-5" />}               gradient="from-violet-500 to-purple-500" />
            <StatCard label="Running Pilots"     value={stats?.pilots ?? 0}          icon={<FlaskConical className="w-5 h-5" />} gradient="from-amber-500 to-orange-500" />
            <StatCard label="Budget Allocated"   value={`₹${((stats?.total_budget ?? 0) / 100000).toFixed(0)}L`} icon={<DollarSign className="w-5 h-5" />} gradient="from-emerald-500 to-green-500" sub="Total across challenges" />
          </>
        )}
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card hover={false} className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary-500" /> Procurement Activity
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="proposals" name="Proposals" fill="#0ea5e9" radius={[4, 4, 0, 0]} onClick={() => router.push('/proposals')} style={{ cursor: 'pointer' }} />
              <Bar dataKey="pilots"    name="Pilots"    fill="#a855f7" radius={[4, 4, 0, 0]} onClick={() => router.push('/pilots')} style={{ cursor: 'pointer' }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card hover={false}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
            <Target className="w-4 h-4 text-secondary-500" /> Challenge Status
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {statusData.map((_, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]} 
                    onClick={() => router.push(`/challenges?status=${statusData[index].name.toLowerCase().replace(' ', '_')}`)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">Quick Actions</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <ActionCard primary href="/challenges/create" icon={<Plus className="w-5 h-5" />}          title="Create New Challenge"   description="Post a problem statement for startups to solve" />
          <ActionCard       href="/proposals"           icon={<CheckSquare className="w-5 h-5" />}    title="Review Proposals"        description="Evaluate incoming startup proposals" />
          <ActionCard       href="/startups"            icon={<Rocket className="w-5 h-5" />}          title="Discover Startups"       description="Browse verified eligible startups" />
          <ActionCard       href="/pilots"              icon={<FlaskConical className="w-5 h-5" />}    title="Manage Pilots"           description="Track milestone progress & compliance" />
        </div>
      </motion.div>

      {/* Recent Challenges */}
      {challenges.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Recent Challenges</h2>
            <Link href="/challenges" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {challenges.slice(0, 4).map((c) => (
              <Link key={c.id} href={`/challenges/${c.id}`}>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800/40 hover:shadow-sm transition-all duration-150 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.category} · ₹{(c.budget / 100000).toFixed(1)}L</p>
                  </div>
                  <Badge variant={c.status === 'open' ? 'success' : c.status === 'evaluating' ? 'warning' : 'primary'}>
                    <span className="capitalize text-xs">{c.status?.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STARTUP DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const StartupDashboard: React.FC<{ stats: any; loading: boolean; challenges: any[]; user: any }> = ({
  stats, loading, challenges, user,
}) => {
  const pipelineSteps = ['Submitted', 'Under Review', 'Shortlisted', 'Accepted'];
  const trendData = [
    { month: 'Apr', views: 5 },
    { month: 'May', views: 12 },
    { month: 'Jun', views: 8 },
    { month: 'Jul', views: 19 },
    { month: 'Aug', views: 14 },
    { month: 'Sep', views: 23 },
  ];

  const verificationScore = stats?.verification_score ?? 0;
  const verificationPct = Math.min(100, (verificationScore / 10) * 100);

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Discover government challenges and grow your startup
          </p>
        </div>
        <Link href="/startups/profile">
          <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
            <Rocket className="w-4 h-4" /> Edit Profile
          </Button>
        </Link>
      </motion.div>

      {/* Verification status — prominent for startups */}
      <motion.div variants={item}>
        <Card hover={false} className={`border-2 ${stats?.is_verified ? 'border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-900/10' : 'border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {stats?.is_verified ? (
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {stats?.is_verified ? 'Startup Verified ✓' : 'Verification Pending'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats?.is_verified
                    ? 'Your startup is eligible to apply to all challenges'
                    : 'Complete your profile to unlock all challenges'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 min-w-[180px]">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Profile Score</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{verificationScore.toFixed(1)}/10</span>
                </div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${verificationPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${stats?.is_verified ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Available Challenges" value={challenges.length}         icon={<ClipboardList className="w-5 h-5" />} gradient="from-blue-500 to-cyan-500"     />
            <StatCard label="Proposals Sent"    value={stats?.proposals ?? 0}        icon={<MessagesSquare className="w-5 h-5" />}       gradient="from-violet-500 to-purple-500" />
            <StatCard label="Active Pilots"     value={stats?.pilots ?? 0}       icon={<FlaskConical className="w-5 h-5" />} gradient="from-amber-500 to-orange-500" />
            <StatCard label="Profile Score"     value={`${verificationScore.toFixed(1)}/10`} icon={<Target className="w-5 h-5" />} gradient="from-emerald-500 to-green-500" />
          </>
        )}
      </motion.div>

      {/* Proposal Pipeline + Trend */}
      <motion.div variants={item} className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Proposal pipeline viz */}
        <Card hover={false}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5">Proposal Pipeline</h2>
          <div className="flex items-center gap-1">
            {pipelineSteps.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1 ${
                    i === 0 ? 'bg-blue-500 text-white' : i === 1 ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{step}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full ${i < 1 ? 'bg-primary-300' : 'bg-slate-200 dark:bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Submitted</span><span className="font-semibold text-slate-900 dark:text-slate-50">{stats?.proposals ?? 0}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Under Review</span><span className="font-semibold text-slate-900 dark:text-slate-50">—</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Active Pilots</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats?.pilots ?? 0}</span></div>
          </div>
        </Card>

        {/* Profile views trend */}
        <Card hover={false}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Profile Visibility
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="views" name="Profile Views" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Quick Actions (Only for verified startups) */}
      {stats?.is_verified && (
        <motion.div variants={item}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">Quick Actions</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <ActionCard primary href="/challenges"        icon={<ClipboardList className="w-5 h-5" />} title="Browse Challenges"   description="Find govt. challenges matching your expertise" />
            <ActionCard       href="/proposals"           icon={<MessagesSquareIcon />}                  title="My Proposals"       description="Track your submitted proposals & statuses" />
            <ActionCard       href="/pilots"              icon={<FlaskConical className="w-5 h-5" />}   title="My Pilots"          description="View active pilots and milestone payments" />
            <ActionCard       href="/startups/profile"   icon={<Rocket className="w-5 h-5" />}          title="Update Profile"     description="Improve profile score to unlock more challenges" />
          </div>
        </motion.div>
      )}

      {/* Open Challenges to explore (Only for verified startups) */}
      {stats?.is_verified && challenges.filter(c => c.status === 'open').length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Open Challenges For You</h2>
            <Link href="/challenges" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {challenges.filter(c => c.status === 'open').slice(0, 3).map((c) => (
              <Link key={c.id} href={`/challenges/${c.id}`}>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800/40 hover:shadow-sm transition-all duration-150 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.category} · ₹{(c.budget / 100000).toFixed(1)}L budget</p>
                  </div>
                  <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">Apply →</Button>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const EvaluatorDashboard: React.FC<{ stats: any; loading: boolean; user: any }> = ({
  stats, loading, user,
}) => {
  const scoreData = [
    { month: 'Apr', avg: 6.2 }, { month: 'May', avg: 7.1 }, { month: 'Jun', avg: 6.8 },
    { month: 'Jul', avg: 7.5 }, { month: 'Aug', avg: 7.2 }, { month: 'Sep', avg: 7.9 },
  ];

  // Mock pending evaluations for display
  const pendingEvals = [
    { id: 1, proposalId: 12, challengeTitle: 'Smart Waste Management System', startup: 'EcoTech Solutions', deadline: '2 days', urgent: true },
    { id: 2, proposalId: 15, challengeTitle: 'AI-Powered Traffic Control', startup: 'FlowAI Labs', deadline: '5 days', urgent: false },
    { id: 3, proposalId: 19, challengeTitle: 'Digital Health Records Platform', startup: 'MediChain Inc.', deadline: '8 days', urgent: false },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">
          Evaluator Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Welcome back, {user?.full_name?.split(' ')[0]}. Review and evaluate startup proposals.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Pending Review"    value={pendingEvals.length}  icon={<Clock className="w-5 h-5" />}         gradient="from-amber-500 to-orange-500"  sub="awaiting evaluation" />
            <StatCard label="Completed"          value={stats?.proposals ?? 0} icon={<CheckSquare className="w-5 h-5" />}   gradient="from-emerald-500 to-green-500" />
            <StatCard label="Avg. Score Given"   value="7.4"                  icon={<Star className="w-5 h-5" />}          gradient="from-blue-500 to-cyan-500"     sub="out of 10" />
            <StatCard label="Challenges Covered" value={stats?.challenges ?? 0} icon={<ClipboardList className="w-5 h-5" />} gradient="from-violet-500 to-purple-500" />
          </>
        )}
      </motion.div>

      {/* Pending evaluations — most important section */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Pending Evaluations
          </h2>
          <Link href="/evaluations">
            <Button variant="primary" size="sm">View All</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {pendingEvals.map((ev) => (
            <Link key={ev.id} href="/evaluations">
              <div className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150 hover:shadow-md ${
                ev.urgent
                  ? 'border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800/40'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  ev.urgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  {ev.urgent
                    ? <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    : <CheckSquare className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-50 truncate">{ev.challengeTitle}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ev.startup} · Proposal #{ev.proposalId}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={ev.urgent ? 'danger' : 'warning'}>
                    <span className="text-xs">Due in {ev.deadline}</span>
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Score trend */}
      <motion.div variants={item} className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Average Scores Given
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="avg" name="Avg Score" stroke="#a855f7" strokeWidth={2} dot={{ r: 4, fill: '#a855f7' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick actions */}
        <Card hover={false}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <ActionCard primary href="/evaluations" icon={<CheckSquare className="w-5 h-5" />} title="Start Evaluating"    description="Open your evaluation queue" />
            <ActionCard       href="/challenges"    icon={<ClipboardList className="w-5 h-5" />} title="Browse Challenges"  description="See all active procurement challenges" />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Small icon helpers
const MessagesSquareIcon = () => <MessagesSquare className="w-5 h-5" />;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const DashboardPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  const { stats, statsLoading, fetchDashboardStats, challenges, fetchChallenges } = useAppStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchChallenges(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user?.role === 'startup') {
    return <StartupDashboard stats={stats} loading={statsLoading} challenges={challenges} user={user} />;
  }
  if (user?.role === 'evaluator') {
    return <EvaluatorDashboard stats={stats} loading={statsLoading} user={user} />;
  }
  // Default: department (and admin)
  return <DepartmentDashboard stats={stats} loading={statsLoading} challenges={challenges} />;
};

DashboardPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default DashboardPage;
