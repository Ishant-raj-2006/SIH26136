import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Building2,
  Rocket,
  Award,
  Zap,
  TrendingUp,
  Users,
  Search,
  Clock,
  ChevronRight,
  ChevronUp,
  Lock,
  BarChart3,
  ExternalLink,
  HelpCircle,
  Scale,
  FileText,
  DollarSign,
  Check,
  Menu,
  X,
  Globe,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { AuthDrawer } from '@/components/AuthDrawer';
import type { NextPageWithLayout } from './_app';
import toast, { Toaster } from 'react-hot-toast';

const liveChallengesPreview = [
  {
    id: '1',
    category: 'AI & Climate',
    dept: 'Ministry of Environment, Forest & Climate',
    title: 'AI-Driven Early Wildfire Detection & Perimeter Mapping',
    desc: 'Autonomous multi-spectral thermal detection with 15-minute alert latency for high-risk national forest reserves.',
    budget: '₹35,00,000',
    duration: '90 Days Sandbox',
    status: 'Applications Open',
    daysLeft: '14 days remaining',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
  },
  {
    id: '2',
    category: 'IoT & Health',
    dept: 'Department of Health & Family Welfare',
    title: 'Autonomous Cold-Chain Integrity for Himalayan Primary Clinics',
    desc: 'Real-time telemetry and sub-zero failover monitoring for vaccine storage in remote high-altitude healthcare centers.',
    budget: '₹45,00,000',
    duration: '120 Days Sandbox',
    status: 'Applications Open',
    daysLeft: '8 days remaining',
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200'
  },
  {
    id: '3',
    category: 'Robotics & Defense',
    dept: 'Ministry of Ports, Shipping & Waterways',
    title: 'Underwater Drone Inspection for Port Submerged Infrastructure',
    desc: 'Sonar and vision-guided ROV inspection for tidal jetty pilings and hull degradation in deep maritime ports.',
    budget: '₹60,00,000',
    duration: '60 Days Sandbox',
    status: 'Review in Progress',
    daysLeft: 'Closing Today',
    badgeColor: 'text-blue-800 bg-blue-50 border-blue-200'
  },
  {
    id: '4',
    category: 'GovTech & AI',
    dept: 'Department of Agriculture & Farmers Welfare',
    title: 'Hyper-Local Satellite Crop Yield & Pest Early-Warning Engine',
    desc: 'Synthesizing SAR satellite radar and ground-truth sensor arrays for automated disaster relief trigger payouts.',
    budget: '₹40,00,000',
    duration: '90 Days Sandbox',
    status: 'Applications Open',
    daysLeft: '21 days remaining',
    badgeColor: 'text-purple-800 bg-purple-50 border-purple-200'
  }
];

const faqs = [
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
  }
];

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

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'department' | 'startup' | 'evaluator'>('department');
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loggingInRole, setLoggingInRole] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Modern Left-Side Auth Drawer State
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerMode, setAuthDrawerMode] = useState<'signin' | 'register'>('signin');

  const openSignIn = () => {
    setAuthDrawerMode('signin');
    setAuthDrawerOpen(true);
    setMobileMenuOpen(false);
  };

  const openRegister = () => {
    setAuthDrawerMode('register');
    setAuthDrawerOpen(true);
    setMobileMenuOpen(false);
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

  // Smooth Reading Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  // Track scroll position for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Programmatic smooth scrolling with sticky header offset
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Toggle FAQ Accordion
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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

  const filteredChallenges = selectedCategory === 'All'
    ? liveChallengesPreview
    : liveChallengesPreview.filter(c => c.category.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans antialiased overflow-x-hidden">
      <Toaster position="top-right" />

      {/* Modern Left-Side Animated Auth Drawer */}
      <AuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        initialMode={authDrawerMode}
      />

      {/* Smooth Scroll Progress Bar Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 origin-left z-[100] pointer-events-none shadow-sm"
        style={{ scaleX }}
      />

      {/* Top National Tri-Color Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Top Banner: Official National SIH Initiative Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-semibold py-2 px-4 text-center tracking-wide flex flex-wrap items-center justify-center gap-2">
        <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
          GOVERNMENT OF INDIA
        </span>
        <span className="font-medium text-slate-800">
          Smart India Hackathon • Problem Statement SIH26136: Startup-Friendly Public Procurement Mechanism
        </span>
        <span className="hidden md:inline-block text-slate-400">•</span>
        <span className="hidden md:inline-block text-emerald-800 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
          DPIIT & GFR 2017 Compliant
        </span>
      </div>

      {/* Modern Sticky Clean Light Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Emblem & Portal Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-900 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-blue-900 rounded-[10px] flex items-center justify-center group-hover:bg-blue-800 transition-colors">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">GoPilot-X</span>
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wider">National Startup Public Procurement Portal</p>
            </div>
          </Link>

          {/* Smooth-scrolling Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="hover:text-blue-700 transition-colors">Problem & Vision</a>
            <a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="hover:text-blue-700 transition-colors">4-Stage Pipeline</a>
            <a href="#roles" onClick={(e) => scrollToSection(e, 'roles')} className="hover:text-blue-700 transition-colors">Portals</a>
            <a href="#challenges" onClick={(e) => scrollToSection(e, 'challenges')} className="hover:text-blue-700 transition-colors">Active RFPs</a>
            <a href="#compliance" onClick={(e) => scrollToSection(e, 'compliance')} className="hover:text-blue-700 transition-colors">GFR 194</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-blue-700 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs (Trigger Left Drawer) */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/10 transition-all hover:scale-[1.02]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-300 transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={openRegister}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/15 transition-all hover:scale-[1.02]"
                >
                  <Rocket className="w-4 h-4 text-amber-300" />
                  Register Startup
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 bg-white shadow-lg flex flex-col gap-3">
            <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="text-slate-800 font-semibold py-2">Problem & Vision</a>
            <a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="text-slate-800 font-semibold py-2">4-Stage Pipeline</a>
            <a href="#roles" onClick={(e) => scrollToSection(e, 'roles')} className="text-slate-800 font-semibold py-2">Portals</a>
            <a href="#challenges" onClick={(e) => scrollToSection(e, 'challenges')} className="text-slate-800 font-semibold py-2">Active Challenges</a>
            <a href="#compliance" onClick={(e) => scrollToSection(e, 'compliance')} className="text-slate-800 font-semibold py-2">GFR 194 Compliance</a>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={openSignIn}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-bold"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="w-full text-center py-2.5 rounded-lg bg-blue-700 text-white font-bold"
              >
                Register Startup
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION WITH DIGNIFIED LIGHT THEME */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200/80">
        {/* Subtle Architectural Hairline Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_60%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission, Headlines, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs mb-6"
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

              {/* Main Action Buttons (Side Drawer Triggers) */}
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
                  Enter Platform / Sign In
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </button>
                <a
                  href="#challenges"
                  onClick={(e) => scrollToSection(e, 'challenges')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all hover:border-blue-500"
                >
                  <Search className="w-4 h-4 text-blue-700" />
                  Explore Active RFPs
                </a>
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

            {/* Right Column: Live Interactive Sandbox Telemetry Visual */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-3xl bg-white border border-slate-200 p-6 shadow-lg overflow-hidden"
              >
                {/* Header of Simulated HUD */}
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

                {/* Simulated Live Pilot Card */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Pilot Sandbox #SB-804</span>
                        <h4 className="text-sm font-bold text-slate-900">AI Wildfire Perimeter Aerial Telemetry</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">₹35,00,000</span>
                    </div>

                    {/* Milestone Progress Bar */}
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

                  {/* 3 Metric Pills */}
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

                  {/* Verified Startup Trust Badge */}
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
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-800">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Outcome-Based RFPs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Define pain-points by target KPIs rather than vendor-biased specs that disqualify new tech.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-800">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Turnover Barrier</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eligible startups bypass balance-sheet quotas. Selection is based 100% on technical POC merit.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-800">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">IP Escrow & Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Controlled sandboxes with statutory non-disclosure and complete founder patent safety.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Milestone Escrow Tranches</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated fund disbursements upon digital verification of field trial deliverables.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NATIONAL IMPACT METRICS STRIP (Authoritative Deep Slate Ribbon) */}
      <section className="bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">₹48.5 Cr+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Sandbox Pilot Grants</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">142+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Departmental Challenges</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">850+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Verified DPIIT Startups</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">91.4%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Pilot-to-Procure Scale Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT DEEP DIVE (PS SIH26136) */}
      <section id="problem" className="py-24 relative scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              The SIH Core Mandate
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Conventional Procurement Fails High-Tech Startups
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Standard tenders (L1 procurement) were engineered for cement and stationery, not artificial intelligence, drones, and biotech. Here is how GoPilot-X resolves the systemic deadlock:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Conventional Barrier Card */}
            <div className="p-8 rounded-3xl bg-red-50/50 border border-red-200 relative overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-100 border-b border-l border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
                Conventional Framework
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2.5">
                  <X className="w-5 h-5 text-red-600" />
                  Conventional Procurement Bottlenecks
                </h3>
                <ul className="space-y-4 text-slate-700 text-sm">
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

            {/* GoPilot-X Mechanism Card */}
            <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-300 relative overflow-hidden flex flex-col justify-between shadow-xs">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider">
                GoPilot-X Mechanism
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Agile Outcome-Based Framework
                </h3>
                <ul className="space-y-4 text-slate-700 text-sm">
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
                      <strong className="text-slate-900 block font-semibold">Outcome-Based Problem Statements:</strong>
                      Departments define the target metrics (e.g. "reduce water loss by 40%") rather than prescribing how it must be engineered.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Controlled 30-90 Day Sandbox Pilots:</strong>
                      Live field trials with ring-fenced data, milestone-linked escrow funding, and complete IP protection.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Audit-Compliant GFR Rule 194 Scale-Up:</strong>
                      Clear legal transition: successful pilots meeting predetermined KPIs can be awarded departmental contracts without re-tendering.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-200 text-xs text-emerald-800 font-bold">
                Outcome: Government deploys state-of-the-art tech; Startups scale through sovereign procurement.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 4-STAGE PROCUREMENT PIPELINE */}
      <section id="workflow" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
              The Platform Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The 4-Stage Procurement Lifecycle
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Click any stage below to inspect the compliance gates, deliverables, and automated triggers:
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {workflowSteps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveWorkflowIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    activeWorkflowIndex === idx
                      ? `${s.borderColor} ${s.activeBg} shadow-sm`
                      : 'border-slate-200 bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      activeWorkflowIndex === idx ? s.badgeColor : 'bg-slate-100 text-slate-600'
                    }`}>
                      Stage {s.step}
                    </span>
                    <IconComp className={`w-4 h-4 ${
                      activeWorkflowIndex === idx ? 'text-blue-700' : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{s.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">{s.actor}</div>
                </button>
              );
            })}
          </div>

          {/* Expanded Step Detail Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkflowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-extrabold text-blue-900 tracking-tight">
                    Stage {workflowSteps[activeWorkflowIndex].step}
                  </span>
                  <span className="text-slate-400 text-sm font-bold">/ 04</span>
                  <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {workflowSteps[activeWorkflowIndex].actor}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                  {workflowSteps[activeWorkflowIndex].title}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {workflowSteps[activeWorkflowIndex].summary}
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Key Output / Gate</span>
                    <span className="text-sm font-bold text-slate-900">{workflowSteps[activeWorkflowIndex].deliverable}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Automated Enforcement</div>
                <div className="text-lg font-bold text-slate-900 tracking-tight mb-2">Zero Audit Query Guarantee</div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Every step is cryptographically timestamped and aligned with GFR Rule 194 & Central Vigilance Commission guidelines.
                </p>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                >
                  Explore Stage in Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* STAKEHOLDER ROLE PORTALS (Interactive Tabs) */}
      <section id="roles" className="py-24 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
              Role-Specific Workspaces
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Public Innovation Stakeholders
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Experience how departments, innovators, and evaluators collaborate inside isolated, purpose-built workspaces:
            </p>
          </div>

          {/* Role Tabs Navigation */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 gap-2">
              <button
                onClick={() => setActiveRoleTab('department')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeRoleTab === 'department'
                    ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                Government Department
              </button>
              <button
                onClick={() => setActiveRoleTab('startup')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeRoleTab === 'startup'
                    ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Rocket className="w-4 h-4 text-emerald-600" />
                Innovative Startup
              </button>
              <button
                onClick={() => setActiveRoleTab('evaluator')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeRoleTab === 'evaluator'
                    ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-4 h-4 text-blue-600" />
                Expert Evaluator
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeRoleTab === 'department' && (
                <motion.div
                  key="dept"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <span className="text-amber-800 font-bold text-xs tracking-wider uppercase">Department Workspace</span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 mb-4">
                      For Government Departments & Public Agencies
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      Solve deep operational bottlenecks without fear of procurement audit queries. Define target outcome KPIs, review blinded technical proposals, monitor sandbox telemetry in real-time, and scale proven solutions directly.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Outcome-based problem formulation wizard
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Single-click Shortlist / Reject proposal workflow
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Real-time pilot milestone verification & fund sign-off
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Automated GFR 194 scale-up procurement paperwork
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={openSignIn}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm"
                      >
                        Enter Department Workspace
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
                      <span>Live Department Monitor</span>
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Active
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Active Challenges</div>
                        <div className="text-xs text-slate-500">4 Operational RFPs Published</div>
                      </div>
                      <span className="text-xl font-bold text-blue-800">4</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Incoming Proposals</div>
                        <div className="text-xs text-slate-500">Awaiting technical review</div>
                      </div>
                      <span className="text-xl font-bold text-emerald-800">18</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Controlled Pilots Running</div>
                        <div className="text-xs text-slate-500">Milestone 2/3 in field trials</div>
                      </div>
                      <span className="text-xl font-bold text-slate-800">3</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeRoleTab === 'startup' && (
                <motion.div
                  key="startup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <span className="text-emerald-800 font-bold text-xs tracking-wider uppercase">Startup Workspace</span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 mb-4">
                      For Eligible Innovative Startups
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      Bypass legacy balance-sheet disqualifications. Present your technology directly to central and state ministries, test in real-world government sandboxes, and receive sovereign milestone payments.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        DPIIT Certificate auto-verification & eligibility badge
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Proposal submission with IP escrow & patent protection
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Live visual milestone pipeline & tranche payment tracker
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Fast-tracked transition to national GeM procurement
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={openSignIn}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm"
                      >
                        Enter Startup Workspace
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={openRegister}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-sm"
                      >
                        Register
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
                      <span>Startup Pipeline Telemetry</span>
                      <span className="text-emerald-800 flex items-center gap-1 font-mono font-bold">DPIIT-VERIFIED</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between text-xs text-slate-600 mb-2 font-semibold">
                        <span>Pilot Milestone: Field Data Validation</span>
                        <span className="text-emerald-800 font-bold">Tranche ₹12.5L</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-600 w-3/4 rounded-full" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2 flex justify-between font-medium">
                        <span>75% Verified</span>
                        <span>Disbursal on Final Sign-off</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Active Challenges Matching</div>
                        <div className="text-xs text-slate-500">Based on your Tech Sector</div>
                      </div>
                      <span className="text-xl font-bold text-emerald-800">12</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeRoleTab === 'evaluator' && (
                <motion.div
                  key="evaluator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <span className="text-blue-900 font-bold text-xs tracking-wider uppercase">Evaluator Workspace</span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 mb-4">
                      For Expert Evaluators & Technical Panels
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      Empaneled subject matter experts evaluate anonymized proposals using a 100-point standardized rubric across Technical Rigor, Innovation Factor, Feasibility, and Cost-Effectiveness.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Double-blind evaluation to eliminate bias
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Interactive 4-category slider scoring workspace
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Technology Readiness Level (TRL 1-9) verification
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Cryptographic audit trail for transparency
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={openSignIn}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm"
                      >
                        Enter Evaluation Workspace
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
                      <span>Standardized 100-pt Rubric</span>
                      <span className="text-blue-900 font-bold">PANEL SCORE</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-700 font-medium">
                        <span>Technical Rigor (30 pts)</span>
                        <span className="font-bold text-blue-900">28/30</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-700 font-medium">
                        <span>Innovation & IP (25 pts)</span>
                        <span className="font-bold text-amber-800">23/25</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-700 font-medium">
                        <span>Operational Feasibility (25 pts)</span>
                        <span className="font-bold text-emerald-800">22/25</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-700 font-medium">
                        <span>Cost & Scalability (20 pts)</span>
                        <span className="font-bold text-slate-900">18/20</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">Composite Score</span>
                      <span className="text-2xl font-bold text-emerald-800">91 / 100</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* LIVE CHALLENGES SHOWCASE WITH CATEGORY FILTERS */}
      <section id="challenges" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
                Live National RFPs
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Active Outcome-Based Challenges
              </h2>
              <p className="mt-2 text-slate-600 text-base">
                Operational problem statements published by Indian ministries with funded sandbox pilots:
              </p>
            </div>
            <Link
              href="/challenges"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-bold text-sm group"
            >
              Browse All 142+ Challenges
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', 'AI & Climate', 'IoT & Health', 'Robotics & Defense', 'GovTech & AI'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredChallenges.map((c) => (
              <motion.div
                key={c.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${c.badgeColor}`}>
                      {c.category}
                    </span>
                    <span className="text-amber-800 flex items-center gap-1 font-mono text-[11px] font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {c.daysLeft}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mb-1 line-clamp-1">{c.dept}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">{c.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pilot Budget</div>
                      <div className="text-base font-bold text-emerald-800">{c.budget}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sandbox</div>
                      <div className="text-xs font-bold text-slate-800">{c.duration}</div>
                    </div>
                  </div>
                  <Link
                    href={`/challenges/${c.id}`}
                    className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    View RFP Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REGULATORY COMPLIANCE & LEGAL CERTIFICATION */}
      <section id="compliance" className="py-24 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              Statutory Shield
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compliant with General Financial Rules (GFR 2017)
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Every procurement action is executed within strict legal frameworks, protecting departmental officers from audit complications while fast-tracking startup integration:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-xs transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-5 text-emerald-800">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-3">GFR Rule 194 Compliance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Empowers departments to procure innovative non-consulting solutions without L1 re-tendering once technical and operational KPIs have been verified in sandbox trials.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-xs transition-colors">
              <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-5 text-amber-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-3">DPIIT Exemption Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time API verification of startup DPIIT recognition, immediately waiving the requirement for past 3-year financial turnover and prior delivery certificates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-xs transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center mb-5 text-blue-800">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-3">IP Escrow Guarantee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cryptographically registered Master Sandbox Deeds ensure that all underlying IP, model weights, and proprietary code remain solely with the startup founder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
              Clear Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-slate-600 text-base">
              Key operational details regarding sandbox rules, eligibility, and scale-up procurement:
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-base text-slate-900 hover:text-blue-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-90 text-blue-800' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION (Dignified Authoritative Banner) */}
      <section className="py-20 relative overflow-hidden bg-slate-900 text-white border-t border-slate-800">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Deploy Your Solution in Government Sandboxes?
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of verified startups and central/state ministries creating the future of public service delivery.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={openRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              Register Your Startup
            </button>
            <button
              type="button"
              onClick={openSignIn}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
            >
              Sign In to Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-100 py-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
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
            <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="hover:text-blue-700 transition-colors">Problem</a>
            <a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="hover:text-blue-700 transition-colors">4-Stage Pipeline</a>
            <a href="#roles" onClick={(e) => scrollToSection(e, 'roles')} className="hover:text-blue-700 transition-colors">Portals</a>
            <a href="#compliance" onClick={(e) => scrollToSection(e, 'compliance')} className="hover:text-blue-700 transition-colors">GFR 194 Guidelines</a>
            <button type="button" onClick={openSignIn} className="hover:text-blue-700 transition-colors">Department Sign In</button>
            <button type="button" onClick={openRegister} className="hover:text-blue-700 transition-colors">Startup Onboarding</button>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right font-medium">
            Official Startup Procurement Sandbox Framework
          </div>
        </div>
      </footer>

      {/* Smooth Floating Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            title="Scroll back to top"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-700 text-white shadow-xl shadow-blue-900/20 hover:bg-blue-800 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronUp className="w-5 h-5 text-white stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

HomePage.getLayout = (page: React.ReactElement) => <>{page}</>;

export default HomePage;
