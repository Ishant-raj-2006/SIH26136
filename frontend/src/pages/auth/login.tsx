import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { Button, Input, Alert } from '@/components/UI';
import { Layout } from '@/components/Layout';
import type { NextPageWithLayout } from '../_app';

const seededAccounts = [
  { label: 'Government', email: 'government@procurement.com', password: 'Government@123', role: 'Department' },
  { label: 'Admin', email: 'admin@procurement.com', password: 'Admin@123', role: 'Platform admin' },
  { label: 'Registered company', email: 'startup@procurement.com', password: 'Startup@123', role: 'Startup' },
  { label: 'Maintenance', email: 'maintenance@procurement.com', password: 'Maintenance@123', role: 'Operations' },
];

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { login, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Login failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const useSeededAccount = (account: (typeof seededAccounts)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SP</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <Alert type="error" dismissible onClose={clearError} className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              icon={!isLoading && <Mail className="w-4 h-4" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or</span>
            </div>
          </div>

          <div className="mb-6 border-y border-stone-200 py-5 dark:border-slate-800">
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Seeded access</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select an account to fill the sign-in form.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {seededAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => useSeededAccount(account)}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-left transition-smooth hover:border-primary-500 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500"
                >
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-50">{account.label}</span>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{account.role}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

LoginPage.getLayout = (page: React.ReactElement) => <Layout requireAuth={false}>{page}</Layout>;

export default LoginPage;
