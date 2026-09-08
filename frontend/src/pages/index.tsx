import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Rocket,
  Zap,
  Lock,
  DollarSign,
  Search,
  Scale,
  FileText,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { AuthDrawer } from '@/components/AuthDrawer';
import { SectionHeader } from '@/components/SectionHeader';
import type { NextPageWithLayout } from './_app';
import toast, { Toaster } from 'react-hot-toast';

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [loggingInRole, setLoggingInRole] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Modern Auth Drawer State
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerMode, setAuthDrawerMode] = useState<'signin' | 'register'>('signin');

  const openSignIn = () => {
    setAuthDrawerMode('signin');
    setAuthDrawerOpen(true);
  };

  const openRegister = () => {
    setAuthDrawerMode('register');
    setAuthDrawerOpen(true);
  };

  // Automatically open drawer if ?auth=signin or ?auth=register is passed
  useEffect(() => {
    if (router.query.auth === 'signin') {
      setAuthDrawerMode('signin');
      setAuthDrawerOpen(true);
    } else if (router.query.auth === 'register') {
      setAuthDrawerMode('register');
      setAuthDrawerOpen(true);
    }
  }, [router.query.auth]);

  // Track scroll position for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Quick Demo Login Handler
  const handleQuickLogin = async (email: string, pass: string, roleName: string) => {
    setLoggingInRole(roleName);
    try {
      await login(email, pass);
      toast.success(`Welcome to ${roleName} Workspace!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(`Login failed. Redirecting to manual sign-in...`);
      openSignIn();
    } finally {
      setLoggingInRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      <Toaster position="top-right" />

      {/* Modern Left-Side Animated Auth Drawer */}
      <AuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        initialMode={authDrawerMode}
      />

      {/* Top Header with About Dropdown Navigation */}
      <SectionHeader />

      {/* HERO SECTION WITH DIGNIFIED LIGHT THEME */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 bg-slate-50 border-b border-slate-200/80">
        {/* Architectural Hairline Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_60%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Mission, Headlines, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-2xs mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-bold">Official Procurement Sandbox</span>
                <span className="text-blue-300">|</span>
                <span className="text-slate-700 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Turnover Barrier for DPIIT Startups
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
              >
                Empowering Governments to{' '}
                <span className="text-blue-900 underline decoration-blue-300 decoration-4 underline-offset-8">
                  Identify, Pilot & Scale
                </span>{' '}
                Startup Solutions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl font-normal"
              >
                Replace rigid legacy tender specs with agile, outcome-based problem statements. Test breakthrough deep-tech innovations in risk-contained departmental sandboxes with milestone-based escrow payments and compliant GFR 194 scale-up contracts.
              </motion.p>

              {/* Main Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  type="button"
                  onClick={openSignIn}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-900/15 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  Enter Workspace / Sign In
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </button>
                <Link
                  href="/challenges"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all hover:border-blue-500"
                >
                  <Search className="w-4 h-4 text-blue-700" />
                  Explore Active RFPs
                </Link>
                <button
                  type="button"
                  onClick={openRegister}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-all"
                >
                  <Rocket className="w-4 h-4 text-emerald-200" />
                  Register Startup
                </button>
              </motion.div>

              {/* 1-Click Instant Demo Role Launcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-600 mb-3 font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    1-Click Instant Sandbox Demo:
                  </span>
                  <span className="text-[11px] text-slate-500">Click role to log in instantly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleQuickLogin('government@procurement.com', 'Government@123', 'Department')}
                    disabled={loggingInRole !== null}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-50/60 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {loggingInRole === 'Department' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    🏛️ As Department
                  </button>

                  <button
                    onClick={() => handleQuickLogin('startup@procurement.com', 'Startup@123', 'Startup')}
                    disabled={loggingInRole !== null}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {loggingInRole === 'Startup' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Rocket className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                    🚀 As Startup
                  </button>

                  <button
                    onClick={() => handleQuickLogin('admin@procurement.com', 'Admin@123', 'Evaluator')}
                    disabled={loggingInRole !== null}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50/60 hover:bg-blue-100 border border-blue-200 text-blue-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {loggingInRole === 'Evaluator' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Scale className="w-3.5 h-3.5 text-blue-700" />
                    )}
                    ⚖️ As Evaluator
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Sandbox Telemetry Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-3xl bg-white border border-slate-200 p-6 shadow-lg overflow-hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Live Sandbox Telemetry
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[10px] font-semibold border border-blue-200">
                    GFR RULE 194 ACTIVE
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Pilot Sandbox #SB-804</span>
                        <h4 className="text-sm font-bold text-slate-900">AI Wildfire Perimeter Aerial Telemetry</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">₹35,00,000</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                        <span>Milestone 2: Field Sensor Integration</span>
                        <span className="text-blue-800 font-bold">68% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-700 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '68%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                        <span>Tranche ₹14.0L Escrowed</span>
                        <span className="text-emerald-800 font-semibold">Auto-Disburses on Sign-off</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Evaluation</div>
                      <div className="text-base font-bold text-emerald-800 mt-0.5">92 / 100</div>
                      <div className="text-[10px] text-slate-500">Blind Matrix</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">IP Escrow</div>
                      <div className="text-base font-bold text-blue-800 mt-0.5">100%</div>
                      <div className="text-[10px] text-slate-500">Protected</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">TRL Score</div>
                      <div className="text-base font-bold text-amber-800 mt-0.5">TRL 7</div>
                      <div className="text-[10px] text-slate-500">Field Ready</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">DPIIT Exemption Verified</div>
                        <div className="text-[11px] text-slate-600">Cert #DIPP102948 • Prior turnover waived</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      ELIGIBLE
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Key Pillars Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/problem" className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-md group">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-800">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">Outcome-Based RFPs</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Define pain-points by target KPIs rather than vendor-biased specs that disqualify new tech.
              </p>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                Explore Problem & Vision
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/workflow" className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-md group">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-800">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">Zero Turnover Barrier</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Eligible startups bypass balance-sheet quotas. Selection is based 100% on technical POC merit.
              </p>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                View 4-Stage Pipeline
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/gfr194" className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-md group">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-800">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">IP Escrow & Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Controlled sandboxes with statutory non-disclosure and complete founder patent safety.
              </p>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                Read GFR 194 Rules
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/portals" className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-md group">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">Milestone Escrow Tranches</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Automated fund disbursements upon digital verification of field trial deliverables.
              </p>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                Check Entity Portals
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* NATIONAL IMPACT METRICS STRIP */}
      <section className="bg-slate-900 text-white border-y border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-white tracking-tight">₹48.5 Cr+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Sandbox Pilot Grants</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">142+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Departmental Challenges</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-blue-400 tracking-tight">850+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Verified DPIIT Startups</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-amber-400 tracking-tight">91.4%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Pilot-to-Procure Scale Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-100 py-8 text-slate-600 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
              GX
            </div>
            <div>
              <div className="text-slate-900 font-bold tracking-tight">GoPilot-X BHARAT</div>
              <div className="text-xs text-slate-500">Government of India • Smart India Hackathon PS SIH26136</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-semibold">
            <Link href="/problem" className="hover:text-blue-700 transition-colors">Problem & Vision</Link>
            <Link href="/workflow" className="hover:text-blue-700 transition-colors">4-Stage Pipeline</Link>
            <Link href="/portals" className="hover:text-blue-700 transition-colors">Portals</Link>
            <Link href="/gfr194" className="hover:text-blue-700 transition-colors">GFR 194 Guidelines</Link>
            <Link href="/faq" className="hover:text-blue-700 transition-colors">FAQ</Link>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right font-medium">
            Official Startup Procurement Sandbox Framework
          </div>
        </div>
      </footer>

      {/* Floating Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            title="Scroll back to top"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-700 text-white shadow-xl hover:bg-blue-800 transition-all"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

HomePage.getLayout = (page: React.ReactElement) => <>{page}</>;

export default HomePage;
