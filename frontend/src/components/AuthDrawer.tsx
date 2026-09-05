import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Rocket,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Scale,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import toast from 'react-hot-toast';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
  defaultRole?: string;
}

const quickAccounts = [
  { label: '🏛️ Department', email: 'government@procurement.com', pass: 'Government@123', role: 'Department' },
  { label: '🚀 Startup', email: 'startup@procurement.com', pass: 'Startup@123', role: 'Startup' },
  { label: '⚖️ Evaluator', email: 'admin@procurement.com', pass: 'Admin@123', role: 'Evaluator' },
];

export const AuthDrawer: React.FC<AuthDrawerProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  defaultRole = 'startup'
}) => {
  const router = useRouter();
  const { login, register, error, clearError } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register Form State
  const [regData, setRegData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: defaultRole,
    organization: '',
    agreeTerms: true
  });

  // Sync mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
    clearError();
    setLocalError(null);
  }, [initialMode, isOpen, clearError]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleQuickFill = (email: string, pass: string) => {
    setSignInEmail(email);
    setSignInPassword(pass);
    setLocalError(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      await login(signInEmail.trim(), signInPassword.trim());
      toast.success('Sign in successful! Entering workspace...');
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Invalid email or password';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (regData.password !== regData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (regData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!regData.agreeTerms) {
      setLocalError('Please accept the GFR 194 & DPIIT compliance terms');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: regData.email,
        username: regData.username || regData.email.split('@')[0],
        password: regData.password,
        full_name: regData.full_name,
        role: regData.role,
        organization: regData.organization || undefined
      });

      toast.success('Registration successful! You may now sign in.');
      setMode('signin');
      setSignInEmail(regData.email);
      setSignInPassword(regData.password);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Registration failed';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Right Sliding Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col z-10 border-l border-slate-200"
          >
            {/* Top National Tri-Color Accent */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">GoPilot-X</h3>
                    <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                      SANDBOX
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">National Startup Public Procurement Access</p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setLocalError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In to Workspace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setLocalError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register New Startup
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Error Alert Box */}
              {localError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>{localError}</div>
                </motion.div>
              )}

              {/* ================= SIGN IN TAB ================= */}
              {mode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Quick-Fill Role Selector */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className="flex items-center gap-1 text-blue-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        1-Click Test Credentials:
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">Click to prefill</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAccounts.map((acc) => (
                        <button
                          key={acc.role}
                          type="button"
                          onClick={() => handleQuickFill(acc.email, acc.pass)}
                          className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-[11px] font-bold text-slate-800 transition-all text-center truncate shadow-2xs"
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Government / Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="official.officer@gov.in or founder@startup.in"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Security Password
                      </label>
                      <button
                        type="button"
                        onClick={() => toast('Please contact administrator for credentials reset.', { icon: 'ℹ️' })}
                        className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5 text-xs text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Protected under 256-bit NIC / Government e-Security Standard</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        Sign In to Workspace
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500">Not registered with DPIIT yet? </span>
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      Onboard your Startup here
                    </button>
                  </div>
                </form>
              )}

              {/* ================= REGISTER TAB ================= */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Account Type / Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Participating Entity Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegData({ ...regData, role: 'startup' })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          regData.role === 'startup'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Rocket className="w-4 h-4 text-emerald-600 mb-1" />
                        <div className="text-xs font-bold">Startup</div>
                        <div className="text-[10px] text-slate-500">DPIIT Exempt</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegData({ ...regData, role: 'department' })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          regData.role === 'department'
                            ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                        <div className="text-xs font-bold">Department</div>
                        <div className="text-[10px] text-slate-500">Public Buyer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegData({ ...regData, role: 'evaluator' })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          regData.role === 'evaluator'
                            ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Scale className="w-4 h-4 text-blue-600 mb-1" />
                        <div className="text-xs font-bold">Evaluator</div>
                        <div className="text-[10px] text-slate-500">Domain Expert</div>
                      </button>
                    </div>
                  </div>

                  {/* Full Name & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Authorised Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={regData.full_name}
                          onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                          placeholder="Founder Name"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Entity / Enterprise Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={regData.organization}
                          onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                          placeholder="Acme Innovations Pvt Ltd"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Work / Entity Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="contact@innovations.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Min. 6 chars"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* GFR Compliance Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={regData.agreeTerms}
                      onChange={(e) => setRegData({ ...regData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I certify that this entity conforms to DPIIT startup criteria or government public body status under GFR 2017 Rule 194 guidelines.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 text-emerald-200" />
                        Create Verified Workspace Account
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500">Already registered? </span>
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      Sign In to Workspace
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Drawer Footer Notice */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Govt. of India • PS SIH26136</span>
              <span className="font-semibold text-emerald-800">DPIIT Sandbox Exemption</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
