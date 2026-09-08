import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { FileText, Scale, Layers, Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { NextPageWithLayout } from './_app';

const workflowSteps = [
  {
    step: '01',
    title: 'Outcome-Based Formulation',
    actor: 'Government Department',
    summary: 'Departments formulate concrete operational pain-points with measurable KPIs rather than vendor-biased technical specifications.',
    deliverable: 'RFP Challenge Brief with target metrics & budget pool',
    borderColor: 'border-amber-300',
    activeBg: 'bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: FileText
  },
  {
    step: '02',
    title: 'Double-Blind Evaluation',
    actor: 'Empaneled Evaluators',
    summary: 'Subject matter panels assess blind proposals across 4 standardized rubrics: Technical Feasibility, Innovation Factor, Scalability, and Cost.',
    deliverable: '100-Point Composite Score & Merit Shortlist',
    borderColor: 'border-orange-300',
    activeBg: 'bg-orange-50',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    icon: Scale
  },
  {
    step: '03',
    title: 'Controlled Sandbox Pilot',
    actor: 'Selected Startup & Dept',
    summary: 'Shortlisted startups deploy live pilots inside ring-fenced departmental environments with milestone-linked escrow funding.',
    deliverable: '30-90 Day Field Validation with IP Escrow',
    borderColor: 'border-emerald-300',
    activeBg: 'bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: Layers
  },
  {
    step: '04',
    title: 'GFR 194 Scale & Procure',
    actor: 'National Procurement',
    summary: 'Upon passing all milestone KPIs, the solution transitions directly into a departmental procurement contract and national GeM listing.',
    deliverable: 'Direct Production Procurement Contract',
    borderColor: 'border-blue-300',
    activeBg: 'bg-blue-50',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Award
  }
];

const WorkflowPage: NextPageWithLayout = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = workflowSteps[activeIndex];
  const StepIcon = activeStep.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <SectionHeader activeTab="workflow" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Statutory Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The 4-Stage Procurement Pipeline
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            From initial operational pain-point formulation to final GFR 194 production procurement contract execution.
          </p>
        </div>

        {/* 4 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {workflowSteps.map((s, idx) => {
            const IconComp = s.icon;
            const isSelected = activeIndex === idx;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? `${s.activeBg} ${s.borderColor} shadow-md ring-2 ring-blue-600/20`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-400">STAGE {s.step}</span>
                  <div className={`p-2 rounded-xl bg-white shadow-2xs ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{s.title}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">{s.actor}</p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive Focus Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeStep.badgeColor}`}>
                  STAGE {activeStep.step}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Primary Actor: {activeStep.actor}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <StepIcon className="w-7 h-7 text-blue-900 shrink-0" />
                {activeStep.title}
              </h3>

              <p className="text-slate-600 text-base leading-relaxed">
                {activeStep.summary}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-900">Key Stage Deliverable: </strong>
                  {activeStep.deliverable}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Safeguard</div>
              <div className="text-sm font-bold text-slate-900">Digital Escrow & Audit Trail</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every milestone transaction and evaluation rubric is cryptographically signed and stored for instant CAG / GFR compliance review.
              </p>
              <Link
                href="/gfr194"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 pt-2"
              >
                Learn more about GFR 194
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkflowPage;
