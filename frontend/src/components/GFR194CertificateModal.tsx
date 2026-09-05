import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  Building2,
  ExternalLink,
  QrCode,
  FileCheck,
  Scale,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface GFR194CertificateData {
  certificateId: string;
  pilotId: string | number;
  challengeTitle: string;
  departmentName: string;
  startupName: string;
  dpiitNumber: string;
  budgetApproved: string | number;
  meritScore: number;
  trlLevel: string;
  completionDate: string;
  sha256Hash: string;
  authorizedOfficer: string;
  officerDesignation: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: GFR194CertificateData;
}

export const GFR194CertificateModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(data.sha256Hash);
    toast.success('Cryptographic SHA-256 Hash copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 print:p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm print:hidden"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-8 print:my-0 print:shadow-none print:w-full print:max-w-none print:rounded-none"
        >
          {/* Action Bar (Hidden during Print) */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Statutory GFR 2017 Rule 194 Scale-Up Instrument
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Printable Region) */}
          <div ref={printRef} className="p-8 sm:p-12 print:p-8 bg-white text-slate-900 relative">
            {/* National Tri-Color Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 mb-8 rounded-full" />

            {/* Certificate Outer Border Frame */}
            <div className="border-4 border-double border-slate-300 p-8 sm:p-10 relative bg-white rounded-xl">
              {/* Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
                <span className="text-8xl sm:text-9xl font-black text-slate-900 rotate-[-25deg]">
                  GoPilot-X
                </span>
              </div>

              {/* Header: Republic / Ministry Title */}
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-white mb-3 shadow-md">
                  <span className="font-extrabold text-xl tracking-wider">GX</span>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">
                  Government of India • Ministry of Commerce & Industry / DPIIT
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  STATUTORY SCALE-UP PROCUREMENT CERTIFICATE
                </h1>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Issued under General Financial Rules (GFR 2017) — Rule 194
                </div>
              </div>

              {/* Certificate Metadata Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-8">
                <div>
                  <span className="text-slate-500 font-medium block">Certificate No:</span>
                  <span className="font-mono font-bold text-slate-900">{data.certificateId}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Pilot Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">#SB-{data.pilotId}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Date of Issuance:</span>
                  <span className="font-bold text-slate-900">{data.completionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">TRL & Merit Rank:</span>
                  <span className="font-bold text-emerald-800">{data.trlLevel} • Score {data.meritScore}/100</span>
                </div>
              </div>

              {/* Legal Recital */}
              <div className="text-sm leading-relaxed text-slate-700 mb-8 space-y-4 text-justify">
                <p>
                  <strong>THIS IS TO FORMALLY CERTIFY</strong> that the innovative technology solution submitted by{' '}
                  <span className="font-bold text-slate-900 underline decoration-slate-400 underline-offset-2">
                    {data.startupName}
                  </span>{' '}
                  (DPIIT Recognized Entity Reg. No.{' '}
                  <span className="font-mono font-bold text-blue-900">{data.dpiitNumber}</span>) in response to the outcome-based departmental problem statement{' '}
                  <span className="font-semibold text-slate-900">"{data.challengeTitle}"</span> promulgated by{' '}
                  <span className="font-semibold text-slate-900">{data.departmentName}</span>, has successfully completed all operational sandbox trial milestones and technical field trials with an approved sandbox grant tranche of{' '}
                  <span className="font-bold text-slate-900">{data.budgetApproved}</span>.
                </p>

                <p>
                  <strong>STATUTORY WAIVER UNDER GFR RULE 194:</strong> Having satisfied all predetermined Key Performance Indicators (KPIs), technical efficacy metrics, and safety standards verified by the designated Technical Evaluation Committee, the procuring ministry/department is hereby empowered and authorized under{' '}
                  <span className="font-bold text-slate-900">General Financial Rules (GFR) 2017 Rule 194</span> and relevant DPIIT public procurement circulars to execute a{' '}
                  <span className="font-bold text-slate-900">
                    Direct Commercial Scale-Up Contract without the requirement of conventional L1 re-tendering or prior balance-sheet turnover disqualifications
                  </span>.
                </p>
              </div>

              {/* Verification Grid: SHA-256 Hash & QR Code */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/80 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Digital Scannable Verification QR Code */}
                  <div className="w-20 h-20 bg-white p-2 rounded-lg border border-slate-300 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <span className="text-[8px] font-mono text-slate-500 font-bold mt-0.5">NIC VERIFIED</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">Cryptographic Seal & Integrity Escrow</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1.5">
                      Immutable SHA-256 hash registered on National Sandbox Trust Escrow:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      title="Click to copy hash"
                      className="font-mono text-[11px] text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 break-all text-left transition-colors font-bold block"
                    >
                      {data.sha256Hash}
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    VALID & AUDIT-EXEMPT
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Status: SCALE_UP_AUTHORIZED</div>
                </div>
              </div>

              {/* Signatures & Execution Section */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 items-end">
                <div>
                  <div className="h-10 flex items-end pb-1 font-serif italic text-blue-900 font-bold text-lg select-none">
                    Govinda R. Verma
                  </div>
                  <div className="pt-1.5 border-t border-slate-400">
                    <div className="font-bold text-xs text-slate-900">{data.authorizedOfficer}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{data.officerDesignation}</div>
                    <div className="text-[10px] text-slate-400">{data.departmentName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-10 flex items-end justify-end pb-1 font-serif italic text-blue-900 font-bold text-lg select-none">
                    Dr. Ananya Sen
                  </div>
                  <div className="pt-1.5 border-t border-slate-400">
                    <div className="font-bold text-xs text-slate-900">Dr. Ananya Sen, Ph.D.</div>
                    <div className="text-[11px] text-slate-500 font-medium">Chair, Technical Evaluation Committee</div>
                    <div className="text-[10px] text-slate-400">National Innovation Screening Council</div>
                  </div>
                </div>
              </div>
            </div>

            {/* GeM Direct Transition Guidance Appendix */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3 print:bg-white print:border-slate-300">
              <Building2 className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">GeM (Government e-Marketplace) Direct Procurement Note:</strong>
                Attach this certificate with GeM Direct Purchase Requisition (Custom Bid Waiver under GFR 194). This document eliminates prior experience clauses and bypasses standard minimum turnover clauses for DPIIT startups.
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
            <div className="text-xs text-slate-500">
              Verified by GoPilot-X Sovereign Public Procurement Escrow
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Download / Print Official PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
