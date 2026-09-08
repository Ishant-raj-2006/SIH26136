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
import { BackgroundVideo } from '@/components/BackgroundVideo';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between relative">
      <Toaster position="top-right" />

      {/* Video Background (Vid.mp4) - Clearly visible dark ambient video */}
      <BackgroundVideo videoSrc="/Vid.mp4" overlayOpacity={0.45} mode="dark" />

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        initialMode={authDrawerMode}
      />

      {/* Top Header Navigation */}
      <div className="relative z-20">
        <SectionHeader />
      </div>

      {/* HERO SECTION WITH VISIBLE VIDEO ANIMATION BACKGROUND */}
      <section className="relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-800/80">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Mission, Headlines, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-lg backdrop-blur-md mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">Official Procurement Sandbox</span>
                <span className="text-blue-400/60">|</span>
                <span className="text-slate-200 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Turnover Barrier for DPIIT Startups
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
              >
                Empowering Governments to{' '}
                <span className="text-blue-400 underline decoration-blue-500 decoration-4 underline-offset-8">
                  Identify, Pilot & Scale
                </span>{' '}
                Startup Solutions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm"
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
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  Enter Workspace / Sign In
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </button>
                <Link
                  href="/challenges"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md backdrop-blur-md transition-all hover:border-blue-400"
                >
                  <Search className="w-4 h-4 text-blue-400" />
                  Explore Active RFPs
                </Link>
                <button
                  type="button"
                  onClick={openRegister}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <Rocket className="w-4 h-4 text-amber-300" />
                  Register Startup
                </button>
              </motion.div>
            </div>

            {/* Right Column: Sandbox Telemetry Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: [0, -20, 0, 12, 0], x: [0, 8, 0, -8, 0], rotate: [0, 1.4, 0, -1.4, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 },
                  scale: { duration: 0.5, delay: 0.2 },
                  y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  x: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative rounded-3xl bg-slate-900/20 border border-slate-400/30 p-6 shadow-2xl overflow-hidden backdrop-blur-md transition-all hover:bg-slate-900/30 hover:border-blue-400/50"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/40 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Sandbox Telemetry
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/40">
                    GFR RULE 194 ACTIVE
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/25 backdrop-blur-md border border-slate-800/40">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Pilot Sandbox #SB-804</span>
                        <h4 className="text-sm font-bold text-white">AI Wildfire Perimeter Aerial Telemetry</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">₹35,00,000</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-200 mb-1.5 font-medium">
                        <span>Milestone 2: Field Sensor Integration</span>
                        <span className="text-blue-400 font-bold">68% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '68%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-300 mt-1.5 font-medium">
                        <span>Tranche ₹14.0L Escrowed</span>
                        <span className="text-emerald-400 font-semibold">Auto-Disburses on Sign-off</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 rounded-xl bg-slate-950/25 backdrop-blur-md border border-slate-800/40">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Evaluation</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">92 / 100</div>
                      <div className="text-[10px] text-slate-400">Blind Matrix</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/25 backdrop-blur-md border border-slate-800/40">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">IP Escrow</div>
                      <div className="text-base font-bold text-blue-400 mt-0.5">100%</div>
                      <div className="text-[10px] text-slate-400">Protected</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/25 backdrop-blur-md border border-slate-800/40">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">TRL Score</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">TRL 7</div>
                      <div className="text-[10px] text-slate-400">Field Ready</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/15 backdrop-blur-md border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">DPIIT Exemption Verified</div>
                        <div className="text-[11px] text-slate-200">Cert #DIPP102948 • Prior turnover waived</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                      ELIGIBLE
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Key Pillars Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/problem" className="p-6 rounded-2xl bg-slate-900/85 border border-slate-700/80 hover:border-blue-400 backdrop-blur-md transition-all shadow-xl hover:scale-[1.02] group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-300">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Outcome-Based RFPs</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Define pain-points by target KPIs rather than vendor-biased specs that disqualify new tech.
              </p>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                Explore Problem & Vision
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/workflow" className="p-6 rounded-2xl bg-slate-900/85 border border-slate-700/80 hover:border-blue-400 backdrop-blur-md transition-all shadow-xl hover:scale-[1.02] group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-300">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Zero Turnover Barrier</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Eligible startups bypass balance-sheet quotas. Selection is based 100% on technical POC merit.
              </p>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                View 4-Stage Pipeline
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/gfr194" className="p-6 rounded-2xl bg-slate-900/85 border border-slate-700/80 hover:border-blue-400 backdrop-blur-md transition-all shadow-xl hover:scale-[1.02] group">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-300">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">IP Escrow & Protection</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Controlled sandboxes with statutory non-disclosure and complete founder patent safety.
              </p>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                Read GFR 194 Rules
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link href="/portals" className="p-6 rounded-2xl bg-slate-900/85 border border-slate-700/80 hover:border-blue-400 backdrop-blur-md transition-all shadow-xl hover:scale-[1.02] group">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-slate-200">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Milestone Escrow Tranches</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Automated fund disbursements upon digital verification of field trial deliverables.
              </p>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                Check Entity Portals
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* NATIONAL IMPACT METRICS STRIP */}
      <section className="relative z-10 bg-slate-900/90 text-white py-8 border-t border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
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

      {/* COMPACT PROFESSIONAL FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-6 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              GX
            </div>
            <div>
              <div className="text-white font-bold tracking-tight text-sm">GoPilot-X BHARAT</div>
              <div className="text-[11px] text-slate-400">Government of India • Smart India Hackathon PS SIH26136</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-semibold">
            <Link href="/problem" className="hover:text-blue-400 transition-colors">Problem & Vision</Link>
            <Link href="/workflow" className="hover:text-blue-400 transition-colors">4-Stage Pipeline</Link>
            <Link href="/portals" className="hover:text-blue-400 transition-colors">Portals</Link>
            <Link href="/gfr194" className="hover:text-blue-400 transition-colors">GFR 194 Guidelines</Link>
            <Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right font-medium">
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
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all"
          >
            <ChevronUp className="w-5 h-5 text-amber-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

HomePage.getLayout = (page: React.ReactElement) => <>{page}</>;

export default HomePage;
