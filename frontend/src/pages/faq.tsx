import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';
import type { NextPageWithLayout } from './_app';

const faqsData = [
  {
    q: 'How does this mechanism eliminate past turnover and experience barriers for startups?',
    a: 'Under GFR 2017 statutory amendments and DPIIT procurement circulars, eligible DPIIT-recognised startups are formally exempted from prior turnover and prior experience clauses. Our platform evaluates applicants 100% on technical architecture, POC merit, and milestone feasibility.'
  },
  {
    q: 'How is proprietary Startup Intellectual Property (IP) safeguarded?',
    a: 'Every sandbox pilot is executed under an automated Master Sandbox Agreement with cryptographic escrow. Participating government departments receive limited evaluation and testing rights, while background and foreground patent rights remain strictly with the founder.'
  },
  {
    q: 'How are pilot milestone funds disbursed?',
    a: 'Pilot grants are held in a secure milestone escrow ledger. Payments are automatically triggered in tranches (e.g. 30% Prototype Onboarding, 40% Field Data Validation, 30% Operational Sign-Off) upon mutual digital verification from the departmental project officer.'
  },
  {
    q: 'How do successful pilots scale to long-term government procurement?',
    a: 'Startups achieving verified sandbox benchmarks qualify for single-source procurement under General Financial Rules (GFR) Rule 194 (Consulting & Innovation Procurement) or fast-track direct catalog listing on the Government e-Marketplace (GeM).'
  },
  {
    q: 'Who can register as a Departmental Buyer on GoPilot-X?',
    a: 'Any central ministry, state government department, municipal corporation, defense organization, or public sector enterprise (PSE) can create a verified procurement buyer account to post outcome-based challenges.'
  },
  {
    q: 'What is the double-blind evaluation process?',
    a: 'During proposal submission, all startup entity names, founder identities, and contact details are automatically redacted. Empaneled expert juries score proposals purely on technical feasibility, innovation factor, scalability, and cost.'
  }
];

const FaqPage: NextPageWithLayout = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans antialiased">
      <SectionHeader activeTab="faq" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
            Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Everything you need to know about DPIIT sandbox exemptions, GFR 194 compliance, and milestone escrow funding.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {faqsData.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-900 transition-colors"
                >
                  <span className="text-base sm:text-lg leading-snug">{faq.q}</span>
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 text-slate-600">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Desk Banner */}
        <div className="p-8 rounded-3xl bg-blue-900 text-white text-center shadow-lg space-y-4">
          <h3 className="text-2xl font-bold">Have more questions about SIH26136?</h3>
          <p className="text-blue-200 text-sm max-w-xl mx-auto">
            Contact the National Startup Public Procurement Helpdesk or register your entity workspace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/?auth=register"
              className="px-6 py-3 rounded-xl bg-amber-400 text-blue-950 font-bold text-sm hover:bg-amber-300 transition-all shadow-md"
            >
              Register Workspace
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
