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
    { label: 'Edit your company details', href: '/settings/company', icon: Building2, desc: 'Update registered startup profile' },
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
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm" />

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/20 dark:bg-slate-900/20 border-b border-white/20 dark:border-slate-800/40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
            <img 
              src="/emblem.svg" 
              alt="Government of India" 
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-md opacity-90 dark:invert"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">GoPilot-X</span>
                <span className="bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider shadow-2xs">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium tracking-wider">National Startup Public Procurement Portal</p>
            </div>
          </Link>

          {/* Section Router Links with About Dropdown */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-800 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 dark:border-slate-700/60 shadow-2xs">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                router.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-amber-300 shadow-md shadow-blue-900/20'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
              }`}
            >
              Home
            </Link>

            {/* About Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isAboutActive
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-amber-300 shadow-md shadow-blue-900/20'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                About
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1.5">
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
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-800 dark:text-blue-400 shrink-0 mt-0.5">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</div>
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                router.pathname.startsWith('/challenges')
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-amber-300 shadow-md shadow-blue-900/20'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.99]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all hover:scale-[1.01]"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={openRegister}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.99]"
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
            className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
              Home
            </Link>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-3.5 pt-2">About Sub-sections</div>
            {aboutSubSections.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 pl-6"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/challenges" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white pt-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              Active RFPs
            </Link>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                onClick={openSignIn}
                className="w-full text-center py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold shadow-md"
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
