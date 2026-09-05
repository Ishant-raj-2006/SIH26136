import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useForm } from '@/hooks';
import { Layout } from '@/components/Layout';
import { Card, Button, Input, Textarea, Select, Alert } from '@/components/UI';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CreateChallengePage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = React.useState('');

  const { data, handleChange, handleSubmit, loading } = useForm(
    {
      title: '',
      description: '',
      problem_statement: '',
      budget: '',
      category: 'technology',
      tags: '',
      deadline: '',
      expected_outcome: '',
    },
    async (formData: any) => {
      try {
        const payload = {
          ...formData,
          budget: parseFloat(formData.budget),
          tags: formData.tags.split(',').map((t: string) => t.trim()),
          deadline: new Date(formData.deadline).toISOString(),
        };
        await apiClient.createChallenge(payload);
        toast.success('Challenge created successfully!');
        router.push('/challenges');
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || 'Failed to create challenge';
        setError(errorMsg);
        throw err;
      }
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Create Challenge</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Publish a new challenge for startups to solve
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        {error && (
          <Alert type="error" onClose={() => setError('')} className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Challenge Title"
              placeholder="e.g., Mobile Payment Solution for Rural Areas"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
            />

            <Select
              label="Category"
              name="category"
              value={data.category}
              onChange={handleChange}
              options={[
                { label: 'Technology', value: 'technology' },
                { label: 'Healthcare', value: 'healthcare' },
                { label: 'Education', value: 'education' },
                { label: 'Infrastructure', value: 'infrastructure' },
                { label: 'Agriculture', value: 'agriculture' },
                { label: 'Environment', value: 'environment' },
              ]}
            />
          </div>

          <Textarea
            label="Challenge Description"
            placeholder="Describe the challenge in detail..."
            name="description"
            value={data.description}
            onChange={handleChange}
            required
            rows={4}
          />

          <Textarea
            label="Problem Statement"
            placeholder="What problem are we trying to solve?"
            name="problem_statement"
            value={data.problem_statement}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Budget (₹)"
              type="number"
              placeholder="5000000"
              name="budget"
              value={data.budget}
              onChange={handleChange}
              required
            />

            <Input
              label="Application Deadline"
              type="datetime-local"
              name="deadline"
              value={data.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="mobile-payment, fintech, rural, digital"
            name="tags"
            value={data.tags}
            onChange={handleChange}
            helperText="Add up to 5 tags to help startups find your challenge"
          />

          <Textarea
            label="Expected Outcome"
            placeholder="What do you expect from the solution?"
            name="expected_outcome"
            value={data.expected_outcome}
            onChange={handleChange}
            required
            rows={3}
          />

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Challenge'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

CreateChallengePage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CreateChallengePage;
