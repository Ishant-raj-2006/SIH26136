import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Building2, Save, Shield, ShieldCheck, Mail, MapPin, Briefcase, Globe, Info } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Button, Input } from '@/components/UI';
import { apiClient } from '@/lib/api';
import type { NextPageWithLayout } from '../_app';

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CompanySettings: NextPageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [startup, setStartup] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    founded_year: '',
    team_size: '',
    website: '',
    headquarters_city: '',
    state: '',
    official_email: '',
    contact_number: '',
    work_description: '',
  });

  useEffect(() => {
    // Only allow startups to edit company details
    if (!isAuthenticated) {
      router.push('/?auth=signin');
      return;
    }
    if (user && user.role !== 'startup') {
      router.push('/dashboard');
      return;
    }

    const fetchStartup = async () => {
      try {
        const data = await apiClient.getMyStartup();
        setStartup(data);
        setFormData({
          name: data.name || '',
          industry: data.industry || '',
          founded_year: data.founded_year ? String(data.founded_year) : '',
          team_size: data.team_size ? String(data.team_size) : '',
          website: data.website || '',
          headquarters_city: data.headquarters_city || '',
          state: data.state || '',
          official_email: data.official_email || '',
          contact_number: data.contact_number || '',
          work_description: data.work_description || data.description || '',
        });
      } catch (err) {
        console.error('Failed to fetch startup data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartup();
  }, [isAuthenticated, user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup?.id) return;
    
    setSaving(true);
    setSuccess(false);
    
    try {
      const payload = {
        name: formData.name,
        industry: formData.industry,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        team_size: formData.team_size ? parseInt(formData.team_size) : null,
        website: formData.website,
        headquarters_city: formData.headquarters_city,
        state: formData.state,
        official_email: formData.official_email,
        contact_number: formData.contact_number,
        description: formData.work_description, // Map work_description to description if needed
        work_description: formData.work_description,
      };

      await apiClient.updateStartup(startup.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update company details', err);
      alert('Failed to update details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Company Details</h1>
          <p className="text-slate-500 dark:text-slate-400">Update your public profile and contact information</p>
        </div>
      </motion.div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-semibold text-sm">Company details updated successfully!</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" /> General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
              <Input
                label="Founded Year"
                type="number"
                value={formData.founded_year}
                onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
              />
              <Input
                label="Team Size"
                type="number"
                value={formData.team_size}
                onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Description / About Company
              </label>
              <textarea
                value={formData.work_description}
                onChange={(e) => setFormData({ ...formData, work_description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none text-sm"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-500" /> Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Official Email"
                type="email"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                value={formData.official_email}
                onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
              />
              <Input
                label="Contact Number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              />
              <Input
                label="Headquarters City"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                value={formData.headquarters_city}
                onChange={(e) => setFormData({ ...formData, headquarters_city: e.target.value })}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input
                  label="Website URL"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-800/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Shield className="w-32 h-32 text-amber-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-500">
                  Government Registration Details
                </h2>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                These official identifiers are locked to prevent tampering. To update these, contact support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">DPIIT Recognition No.</label>
                  <div className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 text-sm cursor-not-allowed font-mono">
                    {startup?.dpiit_number || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">CIN Number</label>
                  <div className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 text-sm cursor-not-allowed font-mono">
                    {startup?.cin_number || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">PAN Number</label>
                  <div className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 text-sm cursor-not-allowed font-mono">
                    {startup?.pan_number || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Aadhaar (Auth Rep)</label>
                  <div className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 text-sm cursor-not-allowed font-mono">
                    {startup?.aadhaar_number ? '•••• •••• ' + startup.aadhaar_number.slice(-4) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="min-w-[140px] flex items-center justify-center gap-2">
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

CompanySettings.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CompanySettings;
