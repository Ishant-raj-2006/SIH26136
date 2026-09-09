import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Button } from './UI/Button';
import type { ProgressUpdate } from '@/types';
import { format } from 'date-fns';
import { useAuthStore } from '@/lib/stores/auth';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilotId: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose, pilotId }) => {
  const { user } = useAuthStore();
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [percentage, setPercentage] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isStartup = user?.role === 'startup';

  const fetchUpdates = async () => {
    try {
      const data = await apiClient.getPilotProgress(pilotId);
      setUpdates(data);
      if (data.length > 0) {
        const lastPercentage = data[data.length - 1].percentage;
        setPercentage(Math.min(lastPercentage + 10, 100));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUpdates();
    }
  }, [isOpen, pilotId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.submitPilotProgress(pilotId, {
        percentage,
        description,
        photo_url: photoUrl || undefined
      });
      setDescription('');
      setPhotoUrl('');
      await fetchUpdates();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Work Progress Tracker</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              No progress updates submitted yet.
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              {updates.map((update) => (
                <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-xs">
                    {update.percentage}%
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <time className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
                    </time>
                    <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{update.description}</p>
                    {update.photo_url && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={update.photo_url} alt="Progress update" className="w-full h-auto max-h-48 object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isStartup && percentage <= 100 && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-sm mb-4">Submit New Update</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Progress</label>
                  <select 
                    value={percentage} 
                    onChange={e => setPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).filter(p => p >= (updates.length > 0 ? updates[updates.length - 1].percentage + 10 : 10)).map(p => (
                      <option key={p} value={p}>{p}%</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Photo URL (Optional)</label>
                  <input 
                    type="url" 
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Work Description (Required)</label>
                <textarea 
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the work completed in this margin..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" disabled={submitting || !description.trim()}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Submit Update
                </Button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
