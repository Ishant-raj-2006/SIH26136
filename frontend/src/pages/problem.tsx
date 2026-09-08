import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { ShieldCheck, X, CheckCircle2, ArrowRight, Rocket, FileText } from 'lucide-react';
import type { NextPageWithLayout } from './_app';

const ProblemPage: NextPageWithLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <SectionHeader activeTab="problem" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            Problem Statement SIH26136
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Why Conventional Procurement Fails High-Tech Startups
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Standard tenders (L1 procurement) were engineered for cement and stationery, not artificial intelligence, drones, and biotech. Here is how GoPilot-X resolves the systemic deadlock:
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Conventional Barrier Card */}
          <div className="p-8 rounded-3xl bg-white border border-red-200 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-100 border-b border-l border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
              Conventional Framework
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2.5">
                <X className="w-5 h-5 text-red-600" />
                Conventional Procurement Bottlenecks
              </h2>
              <ul className="space-y-5 text-slate-700 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Excessive Eligibility Hurdle:</strong>
                    Demands 3+ years balance sheet turnover and prior government contracts, instantly disqualifying seed deep-tech startups.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Rigid Technical Specifications:</strong>
                    Procurement officers must pre-describe technical solutions, preventing innovative or unproven methods from qualifying.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">12-18 Month Sales Cycle:</strong>
                    Protracted RFP cycles burn young startup capital before any testing or pilot validation can take place.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Departmental Risk & Vigilance Fear:</strong>
                    Officers risk audits if they try experimental software or novel hardware without conventional L1 comparative bidding.
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-red-200 text-xs text-red-700 font-semibold">
              Consequence: Government departments remain locked out of indigenously developed cutting-edge technology.
            </div>
          </div>

          {/* GoPilot-X Solution Card */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-300 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider">
              GoPilot-X Mechanism
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Agile Outcome-Based Framework
              </h2>
              <ul className="space-y-5 text-slate-700 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">DPIIT Exemption & Merit First:</strong>
                    Zero turnover or past experience requirement. Startups compete solely on technical feasibility, patent strength, and POC merit.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Outcome-Based Problem Briefs:</strong>
                    Departments post operational objectives (e.g. 15-minute wildfire alert latency) rather than vendor-biased specs.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Fast-Track 60-Day Pilot Sandbox:</strong>
                    Shortlisted startups get sandbox pilot grants with automated milestone escrow payments for rapid deployment.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">GFR Rule 194 Scale & Procure:</strong>
                    Passing sandbox validation empowers departments to execute single-source procurement contracts legally under GFR 194.
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-emerald-200 text-xs text-emerald-800 font-semibold">
              Outcome: Transparent, agile, and merit-driven digital public infrastructure for Bharat's deep-tech innovators.
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold">Ready to participate in outcome-based RFPs?</h3>
            <p className="text-blue-200 text-sm mt-1">Explore active challenges or register your DPIIT startup workspace account.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/challenges"
              className="px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-amber-400 text-sm font-bold transition-all shadow-md"
            >
              Explore Active RFPs
            </Link>
            <Link
              href="/workflow"
              className="px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-sm font-bold transition-all border border-blue-700"
            >
              View 4-Stage Pipeline
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemPage;
