import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  FileText,
  ExternalLink,
  Lock,
  Building2,
  Receipt,
  Download,
  Check,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface MilestoneTranche {
  id: number;
  title: string;
  deliverables: string[];
  amountInLakhs: number;
  percentage: number;
  status: 'disbursed' | 'ready_for_review' | 'pending';
  pfmsTxnId?: string;
  disbursalDate?: string;
  proofUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pilotId: string | number;
  pilotTitle: string;
  startupName: string;
  totalBudgetLakhs: number;
  isDepartmentOfficer?: boolean;
}

export const MilestoneEscrowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pilotId,
  pilotTitle,
  startupName,
  totalBudgetLakhs = 35.0,
  isDepartmentOfficer = true
}) => {
  const [tranches, setTranches] = useState<MilestoneTranche[]>([
    {
      id: 1,
      title: 'Phase 1: Architecture Ingress & Sandbox Setup',
      deliverables: ['Detailed Technical Architecture Spec', 'Security Gateway Setup', 'Base Algorithm Verification'],
      amountInLakhs: totalBudgetLakhs * 0.25,
      percentage: 25,
      status: 'disbursed',
      pfmsTxnId: 'PFMS-TXN-2026-981245',
      disbursalDate: '12 Jan 2026',
      proofUrl: 'https://github.com/gov-sandbox/telemetry-proof'
    },
    {
      id: 2,
      title: 'Phase 2: Live Field Trial & IoT Telemetry Integration',
      deliverables: ['Field Sensor Deployment Telemetry', 'Accuracy Matrix > 90%', 'NIC Cloud Data Pipeline'],
      amountInLakhs: totalBudgetLakhs * 0.35,
      percentage: 35,
      status: 'ready_for_review',
      proofUrl: 'https://nic-sandbox.gov.in/telemetry/sb-804'
    },
    {
      id: 3,
      title: 'Phase 3: Load Hardening & Vulnerability Assessment',
      deliverables: ['Third-party VAPT Security Clearance', 'Sub-second Failover Benchmarks'],
      amountInLakhs: totalBudgetLakhs * 0.25,
      percentage: 25,
      status: 'pending'
    },
    {
      id: 4,
      title: 'Phase 4: Final Scale-Up Handover & GFR 194 Transition',
      deliverables: ['Operational SOP Documentation', 'Departmental User Training Sign-off', 'GeM Direct Award Package'],
      amountInLakhs: totalBudgetLakhs * 0.15,
      percentage: 15,
      status: 'pending'
    }
  ]);

  const [activeSigningTranche, setActiveSigningTranche] = useState<MilestoneTranche | null>(null);
  const [officerPin, setOfficerPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [lastGeneratedTxn, setLastGeneratedTxn] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalDisbursed = tranches
    .filter((t) => t.status === 'disbursed')
    .reduce((acc, t) => acc + t.amountInLakhs, 0);

  const totalPending = totalBudgetLakhs - totalDisbursed;

  const handleOpenSignModal = (tranche: MilestoneTranche) => {
    setActiveSigningTranche(tranche);
    setOfficerPin('1234'); // Pre-fill default demo PIN for effortless evaluation
  };

  const handleExecuteDisbursal = () => {
    if (!activeSigningTranche) return;

    if (officerPin !== '1234') {
      toast.error('Invalid Officer PIN. Please use test PIN 1234.');
      return;
    }

    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      const generatedTxnId = `PFMS-TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Update tranche status
      setTranches((prev) =>
        prev.map((t) =>
          t.id === activeSigningTranche.id
            ? {
                ...t,
                status: 'disbursed',
                pfmsTxnId: generatedTxnId,
                disbursalDate: now
              }
            : t
        )
      );

      setLastGeneratedTxn({
        txnId: generatedTxnId,
        amount: activeSigningTranche.amountInLakhs,
        title: activeSigningTranche.title,
        date: now,
        startup: startupName,
        pilotId: pilotId
      });

      setActiveSigningTranche(null);
      toast.success(`Tranche Released! PFMS Reference: ${generatedTxnId}`);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-8 border border-slate-200"
        >
          {/* Top Tricolor Strip */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

          {/* Modal Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shadow-sm">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Milestone Escrow & PFMS Disbursal Workflow
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                    PILOT #{pilotId}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{pilotTitle} • {startupName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Escrow Financial Balance Ribbon */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/50 p-4 text-center text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Total Approved Grant</span>
              <span className="text-base font-bold text-slate-900">₹{totalBudgetLakhs.toFixed(1)} Lakhs</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Total Disbursed (PFMS)</span>
              <span className="text-base font-bold text-emerald-800">₹{totalDisbursed.toFixed(1)} Lakhs</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Escrow Ring-Fenced</span>
              <span className="text-base font-bold text-blue-900">₹{totalPending.toFixed(1)} Lakhs</span>
            </div>
          </div>

          {/* Body: Tranche Pipeline */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Last Disbursed PFMS Banner if available */}
            {lastGeneratedTxn && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-950"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold block">
                      Disbursal Processed: ₹{lastGeneratedTxn.amount.toFixed(1)} Lakhs credited
                    </span>
                    <span className="font-mono text-emerald-800">
                      PFMS Ref: {lastGeneratedTxn.txnId} • {lastGeneratedTxn.date}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-white font-mono font-bold text-emerald-800 border border-emerald-300">
                  TREASURY_RELEASED
                </span>
              </motion.div>
            )}

            {/* List of Tranches */}
            <div className="space-y-3">
              {tranches.map((tranche, idx) => (
                <div
                  key={tranche.id}
                  className={`p-4 rounded-xl border transition-all ${
                    tranche.status === 'disbursed'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : tranche.status === 'ready_for_review'
                      ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          tranche.status === 'disbursed'
                            ? 'bg-emerald-600 text-white'
                            : tranche.status === 'ready_for_review'
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {tranche.status === 'disbursed' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{tranche.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        ₹{tranche.amountInLakhs.toFixed(1)}L ({tranche.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          tranche.status === 'disbursed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : tranche.status === 'ready_for_review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tranche.status === 'disbursed'
                          ? 'DISBURSED'
                          : tranche.status === 'ready_for_review'
                          ? 'PENDING SIGN-OFF'
                          : 'LOCKED'}
                      </span>
                    </div>
                  </div>

                  {/* Deliverables checklist */}
                  <div className="pl-8 text-xs text-slate-600 space-y-1 my-2">
                    {tranche.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            tranche.status === 'disbursed'
                              ? 'text-emerald-600'
                              : tranche.status === 'ready_for_review'
                              ? 'text-blue-600'
                              : 'text-slate-400'
                          }`}
                        />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions / Disbursal Details */}
                  <div className="pl-8 pt-2 mt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      {tranche.pfmsTxnId ? (
                        <span className="font-mono text-[11px] text-emerald-800 font-semibold">
                          PFMS Reference: {tranche.pfmsTxnId} • Paid on {tranche.disbursalDate}
                        </span>
                      ) : tranche.proofUrl ? (
                        <a
                          href={tranche.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Submitted Deliverable Proofs
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Deliverables not yet submitted</span>
                      )}
                    </div>

                    {tranche.status === 'ready_for_review' && isDepartmentOfficer && (
                      <button
                        type="button"
                        onClick={() => handleOpenSignModal(tranche)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Sign & Release Escrow Tranche
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Integrated with Public Financial Management System (PFMS) & Central Vigilance Guidelines
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* Digital Signature Confirmation Prompt */}
        {activeSigningTranche && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h4 className="text-lg font-bold text-slate-900">Authorize Escrow Release</h4>
                <p className="text-xs text-slate-600 mt-1">
                  You are digitally approving the release of{' '}
                  <strong className="text-slate-900">₹{activeSigningTranche.amountInLakhs.toFixed(1)} Lakhs</strong> to{' '}
                  <strong className="text-slate-900">{startupName}</strong> for {activeSigningTranche.title}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Department Officer:</span>
                  <span className="font-bold">Govinda R. Verma</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>PFMS Treasury Gateway:</span>
                  <span className="font-mono font-bold text-emerald-800">ONLINE • READY</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Officer Security Authorization PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={officerPin}
                  onChange={(e) => setOfficerPin(e.target.value)}
                  placeholder="Enter 4-digit PIN (Demo: 1234)"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-400 text-center block mt-1">
                  Test Demo PIN: <strong>1234</strong>
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSigningTranche(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isAuthorizing}
                  onClick={handleExecuteDisbursal}
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAuthorizing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Disbursing Funds...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Sign & Disburse
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
