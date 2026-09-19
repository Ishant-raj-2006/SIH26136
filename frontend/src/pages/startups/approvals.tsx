import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  FileText,
  ExternalLink,
  ShieldCheck,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  RefreshCw,
  Eye,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { apiClient, getFileUrl } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import toast from 'react-hot-toast';

export default function CompanyApprovalsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedStartupModal, setSelectedStartupModal] = useState<any | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.listStartups(0, 100, search);
      setStartups(res.data || []);
    } catch (err: any) {
      toast.error('Failed to load company registration applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const handleUpdateStatus = async (startupId: number, targetStatus: 'approved' | 'rejected' | 'pending') => {
    setUpdatingId(startupId);
    try {
      const updated = await apiClient.updateStartupStatus(startupId, targetStatus);
      toast.success(`Company status updated to ${targetStatus.toUpperCase()}!`);
      
      // Update local state
      setStartups((prev) =>
        prev.map((s) => (s.id === startupId ? { ...s, status: targetStatus, is_verified: targetStatus === 'approved' } : s))
      );
      if (selectedStartupModal?.id === startupId) {
        setSelectedStartupModal({ ...selectedStartupModal, status: targetStatus, is_verified: targetStatus === 'approved' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update company status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter startups by tab
  const filteredStartups = startups.filter((s) => {
    const sStatus = s.status || 'pending';
    if (activeTab === 'pending') return sStatus === 'pending';
    if (activeTab === 'approved') return sStatus === 'approved';
    if (activeTab === 'rejected') return sStatus === 'rejected';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Head>
        <title>New Companies Registration Approval | Government Portal</title>
      </Head>

      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => router.back()}
                className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 shadow-sm"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ministry & Department Governance Portal
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              New Company Registration Approvals
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review incorporation certificates, statutory CIN/PAN details, and grant sandbox approval to new companies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'pending', label: 'Pending Approvals', count: startups.filter((s) => (s.status || 'pending') === 'pending').length, color: 'amber' },
              { id: 'approved', label: 'Approved', count: startups.filter((s) => s.status === 'approved').length, color: 'emerald' },
              { id: 'rejected', label: 'Rejected', count: startups.filter((s) => s.status === 'rejected').length, color: 'rose' },
              { id: 'all', label: 'All Registered Entities', count: startups.length, color: 'slate' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, CIN, GST..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-400">Loading registration applications from database...</p>
            </div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No {activeTab} company applications found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no company registration records matching your filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((company) => {
              const currentStatus = company.status || 'pending';

              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Status & Type Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {company.logo_url ? (
                          <img
                            src={getFileUrl(company.logo_url)}
                            alt={company.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
                            {company.name?.charAt(0) || 'C'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-100 text-base line-clamp-1">{company.name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {company.headquarters_city || 'India'}, {company.state || ''}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${
                          currentStatus === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : currentStatus === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    {/* Statutory Specs Grid */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-500">CIN / LLPIN:</span>
                        <span className="font-mono text-emerald-400 font-bold">{company.cin_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-500">DPIIT Reg:</span>
                        <span className="font-mono text-slate-300">{company.dpiit_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                        <span className="text-slate-500">GST Number:</span>
                        <span className="font-mono text-slate-300">{company.gst_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Founder / CEO:</span>
                        <span className="text-slate-200 font-medium">{company.founder_ceo_name || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Incorporation Certificate Link */}
                    {company.incorporation_cert_url && (
                      <a
                        href={getFileUrl(company.incorporation_cert_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-xs text-emerald-400 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="flex-1 truncate font-medium">View PNG Incorporation Certificate</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStartupModal(company)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Full Details</span>
                    </button>

                    {user?.role !== 'ministry' && (
                      <div className="flex items-center gap-2">
                        {currentStatus !== 'approved' && (
                          <button
                            type="button"
                            disabled={updatingId === company.id}
                            onClick={() => handleUpdateStatus(company.id, 'approved')}
                            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve ✅</span>
                          </button>
                        )}

                        {currentStatus !== 'rejected' && (
                          <button
                            type="button"
                            disabled={updatingId === company.id}
                            onClick={() => handleUpdateStatus(company.id, 'rejected')}
                            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject ❌</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal for Company Dossier */}
        <AnimatePresence>
          {selectedStartupModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl"
              >
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    {selectedStartupModal.logo_url && (
                      <img
                        src={getFileUrl(selectedStartupModal.logo_url)}
                        alt="Logo"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedStartupModal.name}</h2>
                      <p className="text-xs text-slate-400">
                        {selectedStartupModal.company_type?.toUpperCase() || 'COMPANY'} • Founded {selectedStartupModal.founded_year}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStartupModal(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Dossier Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">Company Identification</span>
                    <p><strong className="text-slate-300">CIN / LLPIN:</strong> <span className="font-mono text-emerald-400">{selectedStartupModal.cin_number || 'N/A'}</span></p>
                    <p><strong className="text-slate-300">DPIIT Number:</strong> {selectedStartupModal.dpiit_number || 'N/A'}</p>
                    <p><strong className="text-slate-300">GST Number:</strong> <span className="font-mono">{selectedStartupModal.gst_number || 'N/A'}</span></p>
                    <p><strong className="text-slate-300">Udyam Reg:</strong> {selectedStartupModal.udyam_number || 'N/A'}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">Executive Leadership & Compliance</span>
                    <p><strong className="text-slate-300">Founder / CEO:</strong> {selectedStartupModal.founder_ceo_name || 'N/A'}</p>
                    <p><strong className="text-slate-300">Auth Representative:</strong> {selectedStartupModal.auth_rep_name || 'N/A'} ({selectedStartupModal.auth_rep_designation || 'N/A'})</p>
                    <p><strong className="text-slate-300">PAN Number:</strong> <span className="font-mono text-emerald-400">{selectedStartupModal.pan_number || 'N/A'}</span></p>
                    <p><strong className="text-slate-300">Aadhaar Number:</strong> <span className="font-mono">{selectedStartupModal.aadhaar_number || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold block mb-1">Contact & Web</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {selectedStartupModal.official_email || 'N/A'}</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedStartupModal.contact_number || 'N/A'}</p>
                    <p className="flex items-center gap-1.5 truncate"><Globe className="w-3.5 h-3.5 text-emerald-400" /> {selectedStartupModal.website || 'N/A'}</p>
                  </div>
                </div>

                {/* Work Description */}
                <div className="bg-slate-950 p-4 rounded-xl space-y-1.5 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold block">Company Work & Past Projects:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedStartupModal.work_description || selectedStartupModal.description}</p>
                </div>

                {/* Document Downloads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStartupModal.incorporation_cert_url && (
                    <a
                      href={getFileUrl(selectedStartupModal.incorporation_cert_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between hover:bg-emerald-500/20 transition-all"
                    >
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Incorporation Cert (PNG)</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {selectedStartupModal.relevant_doc_url && (
                    <a
                      href={getFileUrl(selectedStartupModal.relevant_doc_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between hover:bg-cyan-500/20 transition-all"
                    >
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Relevant Document</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Status Update Action Bar inside Modal */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Current Status: <span className="font-extrabold uppercase text-white">{selectedStartupModal.status || 'pending'}</span>
                  </div>

                  {user?.role !== 'ministry' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={updatingId === selectedStartupModal.id}
                        onClick={() => handleUpdateStatus(selectedStartupModal.id, 'approved')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1 transition-all"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Approve Application ✅
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === selectedStartupModal.id}
                        onClick={() => handleUpdateStatus(selectedStartupModal.id, 'rejected')}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all"
                      >
                        <X className="w-4 h-4" /> Reject ❌
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
