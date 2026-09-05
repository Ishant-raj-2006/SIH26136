import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { Button, Input, Select, Alert } from '@/components/UI';
import { Layout } from '@/components/Layout';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'startup',
    organization: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        organization: formData.organization || undefined,
      });

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 py-8">
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Join the startup procurement platform</p>

          {(error || formError) && (
            <Alert type="error" dismissible onClose={clearError} className="mb-6">
              {error || formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Select
              label="Account Type"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { label: 'Startup', value: 'startup' },
                { label: 'Department', value: 'department' },
                { label: 'Evaluator', value: 'evaluator' },
              ]}
            />

            {formData.role !== 'startup' && (
              <Input
                label="Organization"
                type="text"
                placeholder="Your organization name"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            )}

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

RegisterPage.getLayout = (page: React.ReactElement) => <Layout requireAuth={false}>{page}</Layout>;

export default RegisterPage;
