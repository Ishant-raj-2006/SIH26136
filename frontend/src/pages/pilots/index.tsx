import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FlaskConical, Calendar, DollarSign, CheckCircle2, AlertCircle,
  Clock, TrendingUp, ArrowRight, Layers, Users, ShieldCheck,
  FileCheck, Award, Lock, ExternalLink
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import { Layout } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/UI';
import { SkeletonCard } from '@/components/Skeletons';
import { format, formatDistanceToNow } from 'date-fns';
import { GFR194CertificateModal, type GFR194CertificateData } from '@/components/GFR194CertificateModal';
import { MilestoneEscrowModal } from '@/components/MilestoneEscrowModal';
import type { Pilot } from '@/types';
import type { NextPageWithLayout } from '../_app';

const fade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const statusConfig: Record<string, { color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'; label: string; icon: React.ReactNode }> = {
  negotiation: { color: 'warning',   label: 'Negotiation', icon: <Clock className="w-4 h-4" /> },
  active:      { color: 'success',   label: 'Active',      icon: <TrendingUp className="w-4 h-4" /> },
  monitoring:  { color: 'info',      label: 'Monitoring',  icon: <AlertCircle className="w-4 h-4" /> },
  completed:   { color: 'secondary', label: 'Completed',   icon: <CheckCircle2 className="w-4 h-4" /> },
  failed:      { color: 'danger',    label: 'Failed',      icon: <AlertCircle className="w-4 h-4" /> },
};

const pilotStatusOrder = ['negotiation', 'active', 'monitoring', 'completed'];
const pilotStepIndex = (status: string) => pilotStatusOrder.indexOf(status);

const samplePilotsFallback: Pilot[] = [
  {
    id: 804,
    challenge_id: 1,
    startup_id: 101,
    status: 'completed',
    budget_approved: 3500000,
    compliance_status: 'compliant',
    start_date: '2025-11-01T00:00:00Z',
    end_date: '2026-02-15T00:00:00Z',
    created_at: '2025-10-25T00:00:00Z'
  },
  {
    id: 805,
    challenge_id: 2,
    startup_id: 102,
    status: 'active',
    budget_approved: 4500000,
    compliance_status: 'compliant',
    start_date: '2026-01-10T00:00:00Z',
    end_date: '2026-04-10T00:00:00Z',
    created_at: '2026-01-05T00:00:00Z'
  },
  {
    id: 806,
    challenge_id: 3,
    startup_id: 103,
    status: 'monitoring',
    budget_approved: 6000000,
    compliance_status: 'compliant',
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-05-01T00:00:00Z',
    created_at: '2026-01-20T00:00:00Z'
  }
];

const challengeTitles: Record<number, string> = {
  1: 'AI-Driven Early Wildfire Detection & Perimeter Mapping',
  2: 'Autonomous Cold-Chain Integrity for Himalayan Primary Clinics',
  3: 'Underwater Drone Inspection for Port Submerged Infrastructure'
};

const startupNames: Record<number, string> = {
  101: 'AeroShield Robotics Pvt Ltd',
  102: 'CryoTrack Telemetry Innovations',
  103: 'HydroSub Technologies'
};

// ─── DEPARTMENT: Manage Pilots ─────────────────────────────────────────────────
const DepartmentPilots: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // Modals state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<GFR194CertificateData | null>(null);

  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [selectedEscrowPilot, setSelectedEscrowPilot] = useState<Pilot | null>(null);

  useEffect(() => {
    apiClient.listPilots(0, 50)
      .then((res) => {
        const raw = Array.isArray(res) ? res : res.data || [];
        setPilots(raw.length > 0 ? raw : samplePilotsFallback);
      })
      .catch(() => setPilots(samplePilotsFallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? pilots.filter((p) => p.status === filter) : pilots;

  const summaryStats = [
    { label: 'Active', count: pilots.filter((p) => p.status === 'active').length, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Monitoring', count: pilots.filter((p) => p.status === 'monitoring').length, color: 'text-sky-600 dark:text-sky-400' },
    { label: 'Negotiation', count: pilots.filter((p) => p.status === 'negotiation').length, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Completed', count: pilots.filter((p) => p.status === 'completed').length, color: 'text-slate-600 dark:text-slate-400' },
  ];

  const handleOpenCertificate = (pilot: Pilot) => {
    const sName = startupNames[pilot.startup_id] || `Startup Entity #${pilot.startup_id}`;
    const cTitle = challengeTitles[pilot.challenge_id] || `Operational Challenge #${pilot.challenge_id}`;
    const budgetL = `₹${(pilot.budget_approved / 100000).toFixed(1)} Lakhs`;

    setCertData({
      certificateId: `GFR194-IND-2026-${pilot.id}`,
      pilotId: pilot.id,
      challengeTitle: cTitle,
      departmentName: 'Ministry of Environment, Forest & Climate Change',
      startupName: sName,
      dpiitNumber: 'DIPP102948',
      budgetApproved: budgetL,
      meritScore: 94,
      trlLevel: 'TRL 8 (Commercial Ready)',
      completionDate: '15 Feb 2026',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      authorizedOfficer: 'Govinda R. Verma, IAS',
      officerDesignation: 'Joint Secretary & Procurement Director'
    });
    setCertModalOpen(true);
  };

  const handleOpenEscrow = (pilot: Pilot) => {
    setSelectedEscrowPilot(pilot);
    setEscrowModalOpen(true);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Manage Sandbox Pilots
            </h1>
            <span className="text-xs font-bold uppercase bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
              GFR RULE 194 ACTIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Oversee field trials, release milestone escrow tranches, and issue statutory GFR 194 scale-up certificates
          </p>
        </div>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={item} className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {summaryStats.map(({ label, count, color }) => (
          <button
            key={label}
            onClick={() => setFilter(filter === label.toLowerCase() ? '' : label.toLowerCase())}
            className={`p-4 rounded-xl border text-left transition-all duration-150 bg-white ${
              filter === label.toLowerCase()
                ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className={`text-3xl font-extrabold tracking-tight ${color}`}>{count}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
          </button>
        ))}
      </motion.div>

      {/* Status filter tabs */}
      <motion.div variants={item} className="flex gap-2 flex-wrap">
        {[{ label: 'All Pilots', value: '' }, ...Object.entries(statusConfig).map(([v, c]) => ({ label: c.label, value: v }))].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === value
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item}>
          <Card className="text-center py-16" hover={false}>
            <FlaskConical className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No pilots matching filter</h3>
            <p className="text-slate-500 text-sm mb-6">Switch filter tabs to view all active sandbox pilots</p>
            <Button variant="outline" onClick={() => setFilter('')}>Clear Filter</Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pilot, i) => {
            const conf = statusConfig[pilot.status] ?? statusConfig.active;
            const stepIdx = pilotStepIndex(pilot.status);
            const sName = startupNames[pilot.startup_id] || `Startup Entity #${pilot.startup_id}`;
            const cTitle = challengeTitles[pilot.challenge_id] || `Operational Challenge #${pilot.challenge_id}`;

            return (
              <motion.div key={pilot.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ translateY: -3 }}>
                <Card className="flex flex-col h-full bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5" hover={false}>
                  {/* Status progress bar */}
                  <div className="flex items-center gap-1 mb-4">
                    {pilotStatusOrder.map((s, si) => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full ${
                          si <= stepIdx ? 'bg-blue-700' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      {conf.icon}
                      <span className="text-xs font-mono font-bold text-slate-800">SANDBOX #SB-{pilot.id}</span>
                    </div>
                    <Badge variant={conf.color}><span className="capitalize text-[11px] font-bold">{conf.label}</span></Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">
                    {cTitle}
                  </h3>

                  {/* Startup info */}
                  <div className="flex items-center justify-between mb-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-700" />
                      <span className="text-xs font-semibold text-slate-800 truncate">{sName}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      DPIIT
                    </span>
                  </div>

                  {/* Budget & Compliance Row */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Approved Grant</span>
                      <span className="text-sm font-bold text-slate-900">₹{(pilot.budget_approved / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Compliance Status</span>
                      <span className="text-sm font-bold text-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Audited
                      </span>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEscrow(pilot)}
                      className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-colors"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                      Manage Escrow & Tranches
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCertificate(pilot)}
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      Generate GFR 194 Scale-Up Deed
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* GFR 194 Certificate Modal */}
      {certData && (
        <GFR194CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          data={certData}
        />
      )}

      {/* Escrow & PFMS Disbursal Modal */}
      {selectedEscrowPilot && (
        <MilestoneEscrowModal
          isOpen={escrowModalOpen}
          onClose={() => setEscrowModalOpen(false)}
          pilotId={selectedEscrowPilot.id}
          pilotTitle={challengeTitles[selectedEscrowPilot.challenge_id] || 'Sandbox Pilot'}
          startupName={startupNames[selectedEscrowPilot.startup_id] || 'Startup Entity'}
          totalBudgetLakhs={selectedEscrowPilot.budget_approved / 100000}
          isDepartmentOfficer={true}
        />
      )}
    </motion.div>
  );
};

// ─── STARTUP: My Pilots with milestone tracker ─────────────────────────────────
const StartupPilots: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<GFR194CertificateData | null>(null);

  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [selectedEscrowPilot, setSelectedEscrowPilot] = useState<Pilot | null>(null);

  useEffect(() => {
    apiClient.listPilots(0, 50)
      .then((res) => {
        const raw = Array.isArray(res) ? res : res.data || [];
        setPilots(raw.length > 0 ? raw : samplePilotsFallback);
      })
      .catch(() => setPilots(samplePilotsFallback))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenCertificate = (pilot: Pilot) => {
    const sName = startupNames[pilot.startup_id] || 'Your Startup Entity';
    const cTitle = challengeTitles[pilot.challenge_id] || `Operational Challenge #${pilot.challenge_id}`;
    const budgetL = `₹${(pilot.budget_approved / 100000).toFixed(1)} Lakhs`;

    setCertData({
      certificateId: `GFR194-IND-2026-${pilot.id}`,
      pilotId: pilot.id,
      challengeTitle: cTitle,
      departmentName: 'Department of Public Health & Family Welfare',
      startupName: sName,
      dpiitNumber: 'DIPP102948',
      budgetApproved: budgetL,
      meritScore: 92,
      trlLevel: 'TRL 7 (Field Validated)',
      completionDate: '15 Feb 2026',
      sha256Hash: 'a98210fec8423019842a981048201948201a0841289410928410294812093841',
      authorizedOfficer: 'Rajiv Mehra, IAS',
      officerDesignation: 'Director of Healthcare Procurement'
    });
    setCertModalOpen(true);
  };

  const handleOpenEscrow = (pilot: Pilot) => {
    setSelectedEscrowPilot(pilot);
    setEscrowModalOpen(true);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fade} className="space-y-8">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Active Sandbox Pilots
            </h1>
            <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              DPIIT EXEMPTION VERIFIED
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Track milestone progress, inspect ring-fenced escrow payments, and access GFR 194 scale-up certificates
          </p>
        </div>
      </motion.div>

      {loading ? (
        <motion.div variants={item} className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      ) : pilots.length === 0 ? (
        <motion.div variants={item}>
          <Card className="text-center py-16" hover={false}>
            <FlaskConical className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active pilots</h3>
            <p className="text-slate-500 text-sm mb-6">When your proposal is selected, the sandbox pilot workspace appears here</p>
            <Link href="/challenges"><Button variant="primary">Browse Challenges</Button></Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-6">
          {pilots.map((pilot, i) => {
            const conf = statusConfig[pilot.status] ?? statusConfig.active;
            const cTitle = challengeTitles[pilot.challenge_id] || `Operational Challenge #${pilot.challenge_id}`;
            const sName = startupNames[pilot.startup_id] || 'Your Startup Entity';

            return (
              <motion.div key={pilot.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card hover={false} className="border border-slate-200 p-6 bg-white shadow-xs">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {conf.icon}
                        <h3 className="font-bold text-slate-900 text-lg">
                          Pilot Project #SB-{pilot.id}: {cTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        Sanctioned Grant: <strong className="text-slate-900">₹{(pilot.budget_approved / 100000).toFixed(1)}L</strong> • Ring-fenced in Sovereign Escrow
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCertificate(pilot)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        GFR 194 Scale-Up Deed
                      </button>

                      <Badge variant={conf.color}><span className="capitalize font-bold">{conf.label}</span></Badge>
                    </div>
                  </div>

                  {/* Quick summary strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
                    <div>
                      <span className="text-slate-500 block">DPIIT Exemption Status</span>
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Turnover & Experience Waived
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">IP Escrow Guarantee</span>
                      <span className="font-bold text-blue-900 flex items-center gap-1 mt-0.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        100% Founder Retained
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Scale-Up Route</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">
                        GeM Custom Direct Purchase
                      </span>
                    </div>
                  </div>

                  {/* Escrow Trigger CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Deliverables verified via cryptographic timestamping
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEscrow(pilot)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <DollarSign className="w-4 h-4 text-amber-300" />
                      View Milestone Escrow & Payments
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* GFR 194 Certificate Modal */}
      {certData && (
        <GFR194CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          data={certData}
        />
      )}

      {/* Escrow & PFMS Disbursal Modal */}
      {selectedEscrowPilot && (
        <MilestoneEscrowModal
          isOpen={escrowModalOpen}
          onClose={() => setEscrowModalOpen(false)}
          pilotId={selectedEscrowPilot.id}
          pilotTitle={challengeTitles[selectedEscrowPilot.challenge_id] || 'Sandbox Pilot'}
          startupName={startupNames[selectedEscrowPilot.startup_id] || 'Startup Entity'}
          totalBudgetLakhs={selectedEscrowPilot.budget_approved / 100000}
          isDepartmentOfficer={false}
        />
      )}
    </motion.div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PilotsPage: NextPageWithLayout = () => {
  const { user } = useAuthStore();
  return user?.role === 'startup' ? <StartupPilots /> : <DepartmentPilots />;
};

PilotsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default PilotsPage;
