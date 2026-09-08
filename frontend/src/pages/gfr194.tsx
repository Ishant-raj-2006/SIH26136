import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { Scale, ShieldCheck, FileText, Lock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import type { NextPageWithLayout } from './_app';
import { BackgroundVideo } from '@/components/BackgroundVideo';

const Gfr194Page: NextPageWithLayout = () => {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans antialiased relative">
      <BackgroundVideo videoSrc="/Vid.mp4" overlayOpacity={0.75} mode="light" />
      <div className="relative z-20">
        <SectionHeader activeTab="gfr194" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Scale className="w-3.5 h-3.5 text-blue-700" />
            General Financial Rules 2017
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight drop-shadow-sm">
            GFR Rule 194 Statutory Compliance & Framework
          </h1>
          <p className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            Statutory framework empowering public procuring entities to execute single-source procurement contracts for validated startup innovations.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">DPIIT Turnover Exemption</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Under Ministry of Finance procurement guidelines, eligible DPIIT-recognized startups are formally exempt from prior turnover and prior experience criteria.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Merit-Based Evaluation
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Proprietary IP Escrow</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every sandbox pilot is executed under an automated Master Sandbox Agreement. Procuring entities receive testing access while 100% patent rights stay with the founder.
            </p>
            <div className="pt-2 text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Founder Patent Guaranteed
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Single-Source Scaling</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Achieving verified sandbox benchmark KPIs empowers departmental officers to issue single-source production contracts legally under GFR Rule 194.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Vigilance Audit Protected
            </div>
          </div>
        </div>

        {/* Official Statutory Waiver Certificate Preview Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900 border border-blue-700 text-amber-400 text-xs font-bold uppercase tracking-wider">
              AUTOMATED COMPLIANCE CERTIFICATE
            </div>
            <h3 className="text-2xl font-bold text-white">GFR Rule 194 Waiver Certificate Generator</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upon successful pilot completion, GoPilot-X automatically generates a digital GFR 194 Statutory Exemption Certificate signed by designated evaluation officers.
            </p>
          </div>
          <Link
            href="/challenges"
            className="px-8 py-4 rounded-xl bg-amber-400 text-blue-950 font-extrabold text-sm hover:bg-amber-300 transition-all shrink-0 shadow-md flex items-center gap-2"
          >
            Explore Active RFPs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Gfr194Page;
