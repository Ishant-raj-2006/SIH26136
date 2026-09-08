import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { Building2, Rocket, Scale, ArrowRight, ShieldCheck, CheckCircle2, User, Lock } from 'lucide-react';
import type { NextPageWithLayout } from './_app';

const rolesData = [
  {
    id: 'department',
    title: 'Government Department',
    subtitle: 'Public Buyer & Problem Statement Formulation',
    icon: Building2,
    badge: 'GOVERNMENT BUYER',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Empowers municipal corporations, central ministries, and public sector undertakings to post outcome-focused challenges, manage sandbox pilot grants, and directly issue GFR 194 contracts.',
    capabilities: [
      'Publish outcome-based RFP challenges with target KPIs',
      'Allocate milestone escrow pilot budget pools (e.g. ₹35L - ₹60L)',
      'Track real-time field telemetry and milestone completion',
      'Generate statutory GFR 194 procurement exemption certificates'
    ],
    demoEmail: 'government@procurement.com'
  },
  {
    id: 'startup',
    title: 'Recognized DPIIT Startup',
    subtitle: 'Innovator, Sandbox Pilot Operator & Tech Provider',
    icon: Rocket,
    badge: 'DEEP-TECH INNOVATOR',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Enables high-tech startups to compete without prior turnover or past government experience barriers, access sandbox testbeds, and scale into multi-crore public contracts.',
    capabilities: [
      '100% turnover and prior experience waiver under DPIIT rules',
      'Submit double-blind technical proposals for active RFPs',
      'Execute pilot trials with automated milestone escrow payouts',
      'Retain 100% intellectual property & patent rights'
    ],
    demoEmail: 'startup@procurement.com'
  },
  {
    id: 'evaluator',
    title: 'Expert Evaluator Panel',
    subtitle: 'Domain Experts & Technical Jury',
    icon: Scale,
    badge: 'TECHNICAL JURY',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'Empaneled domain experts, IIT/IISC professors, and technical committees who conduct double-blind evaluation of startup proposals against objective rubrics.',
    capabilities: [
      'Double-blind proposal review (startup identities redacted)',
      '4-rubric scoring: Technical, Innovation, Scalability, Cost',
      'Automated composite score matrix & merit shortlisting',
      'Audit-proof evaluation logging for vigilance compliance'
    ],
    demoEmail: 'admin@procurement.com'
  }
];

const PortalsPage: NextPageWithLayout = () => {
  const [selectedRole, setSelectedRole] = useState<'department' | 'startup' | 'evaluator'>('department');
  const activeRole = rolesData.find((r) => r.id === selectedRole)!;
  const RoleIcon = activeRole.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <SectionHeader activeTab="portals" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            Role-Based Access Control
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Participating Entity Portals
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Tailored workspaces for Government Departments, Deep-Tech Startups, and Empaneled Expert Evaluators.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {rolesData.map((role) => {
            const IconComp = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id as any)}
                className={`p-6 rounded-3xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-lg ring-2 ring-blue-600/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center text-amber-400 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{role.title}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">{role.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Role Workspace Showcase */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeRole.badgeColor}`}>
                  {activeRole.badge}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Official Portal Overview
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <RoleIcon className="w-7 h-7 text-blue-900 shrink-0" />
                {activeRole.title} Workspace
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                {activeRole.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Capabilities & Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRole.capabilities.map((cap, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Login CTA Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instant Access</div>
              <h3 className="text-lg font-bold text-slate-900">Sign in to {activeRole.title}</h3>
              <p className="text-xs text-slate-600">
                Log in to access your role-specific dashboard, live telemetry, and milestone tools.
              </p>
              <Link
                href="/?auth=signin"
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Enter Workspace
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalsPage;
