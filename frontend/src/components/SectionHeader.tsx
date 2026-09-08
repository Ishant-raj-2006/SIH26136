import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Building2,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  FileText,
  Layers,
  Users,
  Scale,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { AuthDrawer } from './AuthDrawer';

export const SectionHeader: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerMode, setAuthDrawerMode] = useState<'signin' | 'register'>('signin');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const aboutSubSections = [
    { label: 'Problem & Vision', href: '/problem', icon: FileText, desc: 'PS SIH26136 & Systemic Deadlocks' },
    { label: '4-Stage Pipeline', href: '/workflow', icon: Layers, desc: 'Outcome-Based Sandbox Process' },
    { label: 'Participating Portals', href: '/portals', icon: Users, desc: 'Department, Startup & Evaluator Roles' },
    { label: 'GFR 194 Statutory', href: '/gfr194', icon: Scale, desc: 'Single-Source Procurement Exemption' },
    { label: 'FAQ & Helpdesk', href: '/faq', icon: HelpCircle, desc: 'Knowledge Base & Questions' },
  ];

  const isAboutActive = ['/problem', '/workflow', '/portals', '/gfr194', '/faq'].some((path) =>
    router.pathname.startsWith(path)
  );

  return (
    <>
      <AuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        initialMode={authDrawerMode}
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

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
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

          {/* Section Router Links with About Dropdown */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100/70 p-1.5 rounded-xl border border-slate-200">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                router.pathname === '/'
                  ? 'bg-blue-900 text-amber-300 shadow-sm'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-white/80'
              }`}
            >
              Home
            </Link>

            {/* About Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isAboutActive
                    ? 'bg-blue-900 text-amber-300 shadow-sm'
                    : 'text-slate-700 hover:text-blue-900 hover:bg-white/80'
                }`}
              >
                About Section
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Platform Sections
                  </div>
                  {aboutSubSections.map((item) => {
                    const IconComp = item.icon;
                    const isActive = router.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAboutDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-blue-900 shrink-0 mt-0.5">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.label}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active RFPs Link */}
            <Link
              href="/challenges"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                router.pathname.startsWith('/challenges')
                  ? 'bg-blue-900 text-amber-300 shadow-sm'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-white/80'
              }`}
            >
              Active RFPs
            </Link>
          </nav>

          {/* User / Auth CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
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
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 bg-white shadow-lg flex flex-col gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg text-sm font-bold text-slate-900">
              Home
            </Link>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pt-2">About Sub-sections</div>
            {aboutSubSections.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 pl-6"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/challenges" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg text-sm font-bold text-slate-900 pt-2">
              Active RFPs
            </Link>
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
    </>
  );
};
