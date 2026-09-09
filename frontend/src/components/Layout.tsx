import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/stores/auth';
import { apiClient } from '@/lib/api';
import { Header, Sidebar } from './Navigation';
import toast, { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, requireAuth = true }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (!requireAuth || user || isLoading || router.pathname.startsWith('/auth')) {
      return;
    }

    if (apiClient.getToken()) {
      getCurrentUser().catch(() => router.replace('/?auth=signin'));
    } else {
      router.replace('/?auth=signin');
    }
  }, [user, isLoading, requireAuth, router, getCurrentUser]);

  // Enforce subdomain access control
  useEffect(() => {
    if (user && !isLoading && requireAuth) {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      const role = user.role?.toLowerCase() || '';

      const isSubdomainMatch = 
        (subdomain === 'startup' && role === 'startup') ||
        (subdomain === 'ministry' && role === 'ministry') ||
        (subdomain === 'department' && role === 'department') ||
        (subdomain === 'maintenance' && role === 'admin');

      const isProtectedSubdomain = ['startup', 'ministry', 'department', 'maintenance'].includes(subdomain);

      if (isProtectedSubdomain && !isSubdomainMatch) {
        useAuthStore.getState().logout();
        toast.error(`Access Denied! You cannot access the ${subdomain} portal with a ${role} account.`);
        router.replace('/?auth=signin');
      }
    }
  }, [user, isLoading, requireAuth, router]);

  if (requireAuth && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg animate-spin" />
            <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-lg" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth || isAuthenticated) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
        {user && <Header />}
        <div className="flex flex-1 overflow-hidden">
          {user && <Sidebar />}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return null;
};
