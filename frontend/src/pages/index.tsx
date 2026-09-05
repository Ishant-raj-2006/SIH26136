import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import type { NextPageWithLayout } from './_app';

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
};

HomePage.getLayout = (page: React.ReactElement) => <Layout requireAuth={false}>{page}</Layout>;

export default HomePage;
