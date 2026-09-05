import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/UI';
import { Layout } from '@/components/Layout';
import { AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <AlertCircle className="w-24 h-24 text-slate-400 dark:text-slate-600 mx-auto" />
        </motion.div>

        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/dashboard">
          <Button>Go Back Home</Button>
        </Link>
      </motion.div>
    </div>
  );
};

NotFoundPage.getLayout = (page: React.ReactElement) => <Layout requireAuth={false}>{page}</Layout>;

export default NotFoundPage;
