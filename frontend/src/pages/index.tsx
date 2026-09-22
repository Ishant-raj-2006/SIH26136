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
import { apiClient } from '@/lib/api';
import type { NextPageWithLayout } from './_app';
import toast, { Toaster } from 'react-hot-toast';

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [loggingInRole, setLoggingInRole] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    total_budget_cr: 48.5,
    total_challenges: 142,
    total_startups: 850,
    scale_rate: 91.4
  });

  // Modern Auth Drawer State
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerMode, setAuthDrawerMode] = useState<'signin' | 'register'>('signin');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiClient.getPublicStats();
        if (data) {
          setStats({
            total_budget_cr: data.total_budget_cr || 48.5,
            total_challenges: data.total_challenges || 142,
            total_startups: data.total_startups || 850,
            scale_rate: data.scale_rate || 91.4
          });
        }
      } catch (err) {
        console.error('Failed to load public stats:', err);
      }
    }
    loadStats();
  }, []);

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Reliably determine the default role from the subdomain
  const [clientDefaultRole, setClientDefaultRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')[0];
      if (['startup', 'ministry', 'department', 'maintenance'].includes(subdomain)) {
        setClientDefaultRole(subdomain);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof router.query.role === 'string') {
      setClientDefaultRole(router.query.role);
    }
  }, [router.query.role]);

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

  const isSubdomain = isMounted && !!clientDefaultRole;

  if (isMounted && isAuthenticated) {
    return null; // Prevent flicker before redirect
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between relative">
      <Toaster position="top-right" />

      {/* Video Background (Vid.mp4) - Hidden on subdomains to provide a cleaner dedicated login page */}
      {!isSubdomain && <BackgroundVideo videoSrc="/Vid.mp4" overlayOpacity={0.45} mode="dark" />}

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        initialMode={authDrawerMode}
        defaultRole={clientDefaultRole}
      />

      {/* Top Header Navigation */}
      <div className="relative z-20">
        <SectionHeader />
      </div>

      {isSubdomain ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 relative mt-20">
          <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-blue-600/20 border border-blue-500/40 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 capitalize">
              {clientDefaultRole} Portal
            </h1>
            <p className="text-slate-400 mb-8">
              Welcome to the dedicated {clientDefaultRole} workspace. Please sign in to access your dashboard, track progress, and manage your tasks.
            </p>
            <button
              onClick={openSignIn}
              className="w-full px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Sign In to Workspace
            </button>
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <p className="text-xs text-slate-500">
                GoPilot-X BHARAT Procurement Engine
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HERO SECTION WITH VISIBLE VIDEO ANIMATION BACKGROUND */}
          <section className="relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-800/80">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-10 items-center">
                {/* Center Column: Mission, Headlines, CTAs */}
                <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
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
                    className="mt-6 text-lg text-slate-200 leading-relaxed max-w-2xl text-center font-normal drop-shadow-sm"
                  >
                    Replace rigid legacy tender specs with agile, outcome-based problem statements. Test breakthrough deep-tech innovations in risk-contained departmental sandboxes with milestone-based escrow payments and compliant GFR 194 scale-up contracts.
                  </motion.p>

                  {/* Main Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
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
                  <div className="text-3xl font-extrabold text-white tracking-tight">₹{stats.total_budget_cr.toFixed(1)} Cr+</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Sandbox Pilot Grants</div>
                </div>
                <div className="pt-2 md:pt-0">
                  <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.total_challenges}+</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Departmental Challenges</div>
                </div>
                <div className="pt-2 md:pt-0">
                  <div className="text-3xl font-extrabold text-blue-400 tracking-tight">{stats.total_startups}+</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Verified DPIIT Startups</div>
                </div>
                <div className="pt-2 md:pt-0">
                  <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{stats.scale_rate}%</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Pilot-to-Procure Scale Rate</div>
                </div>
              </div>
            </div>
          </section>

          {/* OFFICIAL GOVERNMENT FOOTER */}
          <footer className="relative z-10 border-t border-slate-800 bg-slate-950 pt-12 pb-8 text-slate-400 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/80">
                <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/emblem.svg" alt="Emblem of India" className="h-10 w-auto object-contain dark:invert opacity-90" />
                    <div>
                      <div className="text-white font-bold tracking-tight text-sm">GoPilot-X BHARAT</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Government of India</div>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    National Startup Public Procurement Portal.<br/>
                    A Sandbox Framework for fast-tracking Deep-Tech Innovations in Government Departments under GFR Rule 194.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-[11px] tracking-wider">Important Links</h4>
                  <ul className="space-y-2 flex flex-col">
                    <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">National Portal of India</a></li>
                    <li><a href="https://digitalindia.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Digital India</a></li>
                    <li><a href="https://www.meity.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Ministry of Electronics & IT</a></li>
                    <li><a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Startup India Sandbox</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-[11px] tracking-wider">Policies & Help</h4>
                  <ul className="space-y-2 flex flex-col">
                    <li><Link href="/gfr194" className="hover:text-blue-400 transition-colors">GFR 194 Guidelines</Link></li>
                    <li><Link href="/workflow" className="hover:text-blue-400 transition-colors">4-Stage Pipeline</Link></li>
                    <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ & Helpdesk</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-[11px] tracking-wider">Contact Us</h4>
                  <ul className="space-y-2 flex flex-col">
                    <li>Smart India Hackathon 2026</li>
                    <li>Problem Statement: SIH26136</li>
                    <li>Email: ishant786raj@gmail.com</li>
                    <li>Ph: +91-8317735828</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[10px]">
                <div>
                  © 2026 Government of India. All rights reserved.<br/>
                  Designed, Developed and Hosted by <strong className="text-white">National Informatics Centre (NIC)</strong>, Ministry of Electronics & IT (MeitY).
                </div>
                <div className="flex gap-2 items-center text-slate-500">
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">W3C HTML5</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">WCAG 2.0 (AA)</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

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
