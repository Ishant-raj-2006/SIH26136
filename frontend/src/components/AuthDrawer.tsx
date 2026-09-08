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
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Scale,
  RefreshCw,
  Sparkles,
  Wrench,
  Briefcase,
  KeyRound,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register' | 'forgot_password';
  defaultRole?: string;
}

const entityCategories = [
  { id: 'startup', label: '🚀 Startup', email: 'startup@procurement.com', pass: 'Startup@123', desc: 'DPIIT Exempt' },
  { id: 'company', label: '🏢 Company', email: 'company@procurement.com', pass: 'Company@123', desc: 'Enterprise' },
  { id: 'department', label: '🏛️ Department', email: 'government@procurement.com', pass: 'Government@123', desc: 'Public Buyer' },
  { id: 'maintenance', label: '🔧 Maintenance', email: 'maintenance@procurement.com', pass: 'Maintenance@123', desc: 'Platform Ops' },
];

export const AuthDrawer: React.FC<AuthDrawerProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  defaultRole = 'startup'
}) => {
  const router = useRouter();
  const { login, register, clearError } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot_password'>(initialMode);
  const [selectedEntity, setSelectedEntity] = useState<string>('startup');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('startup@procurement.com');
  const [signInPassword, setSignInPassword] = useState('Startup@123');

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

  // OTP state for registration
  const [regOtpStep, setRegOtpStep] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState('');
  const [regDevOtp, setRegDevOtp] = useState<string | null>(null);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotDevOtp, setForgotDevOtp] = useState<string | null>(null);

  // Sync mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
    clearError();
    setLocalError(null);
    setRegOtpStep(false);
    setForgotOtpSent(false);
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

  const handleSelectRole = (cat: typeof entityCategories[0]) => {
    setSelectedEntity(cat.id);
    setSignInEmail(cat.email);
    setSignInPassword(cat.pass);
    setLocalError(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      await login(signInEmail.trim(), signInPassword.trim());
      toast.success('Sign in successful! Redirecting to workspace...');
      onClose();

      // Role-Based Smart Page Redirect
      const loggedUser = useAuthStore.getState().user;
      const userRole = loggedUser?.role?.toLowerCase() || '';

      if (userRole === 'department') {
        router.push('/dashboard');
      } else if (userRole === 'startup') {
        router.push('/dashboard');
      } else if (userRole === 'maintenance') {
        router.push('/dashboard');
      } else if (userRole === 'evaluator') {
        router.push('/evaluations');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Invalid email or password';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for Registration
  const handleSendRegOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!regData.email.trim()) {
      setLocalError('Please enter an official work email.');
      return;
    }
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
      const res = await apiClient.sendOTP(regData.email.trim(), 'registration');
      setRegOtpStep(true);
      if (res.dev_otp) {
        setRegDevOtp(res.dev_otp);
        setRegOtpCode(res.dev_otp);
      }
      toast.success(`Verification OTP sent to ${regData.email.trim()}!`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to send OTP';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP & Complete Registration
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOtpCode.trim()) {
      setLocalError('Please enter the 6-digit OTP verification code.');
      return;
    }
    setLocalError(null);
    setIsLoading(true);

    try {
      // Step 1: Verify OTP
      await apiClient.verifyOTP(regData.email.trim(), regOtpCode.trim(), 'registration');

      // Step 2: Register account
      await register({
        email: regData.email.trim(),
        username: regData.username || regData.email.split('@')[0],
        password: regData.password,
        full_name: regData.full_name,
        role: regData.role,
        organization: regData.organization || undefined,
      });

      toast.success('Email verified & Registration successful! You may now sign in.');
      setMode('signin');
      setSignInEmail(regData.email);
      setSignInPassword(regData.password);
      setRegOtpStep(false);
      setRegOtpCode('');
      setRegDevOtp(null);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'OTP Verification or Registration failed';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for Forgot Password
  const handleSendForgotOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setLocalError('Please enter your registered email address.');
      return;
    }
    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await apiClient.sendOTP(forgotEmail.trim(), 'password_reset');
      setForgotOtpSent(true);
      if (res.dev_otp) {
        setForgotDevOtp(res.dev_otp);
        setForgotOtpCode(res.dev_otp);
      }
      toast.success(`Reset OTP code sent to ${forgotEmail.trim()}!`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to send reset OTP';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password using OTP
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtpCode.trim()) {
      setLocalError('Please enter the 6-digit OTP code.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    setLocalError(null);
    setIsLoading(true);

    try {
      await apiClient.resetPassword({
        email: forgotEmail.trim(),
        otp_code: forgotOtpCode.trim(),
        new_password: forgotNewPassword.trim(),
      });

      toast.success('Password updated in database! You can now sign in.');
      setSignInEmail(forgotEmail.trim());
      setSignInPassword(forgotNewPassword.trim());
      setMode('signin');

      // Reset state
      setForgotOtpSent(false);
      setForgotOtpCode('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotDevOtp(null);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Password reset failed';
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
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setLocalError(null);
                    setRegOtpStep(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Entity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setLocalError(null);
                    setForgotOtpSent(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'forgot_password'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Forgot Pass?
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
                  {/* Entity Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Account Type / Category:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {entityCategories.map((cat) => {
                        const isSelected = selectedEntity === cat.id;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelectRole(cat)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-2xs ring-2 ring-blue-600/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{cat.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{cat.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Work / Entity Email
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
                        onClick={() => {
                          setForgotEmail(signInEmail);
                          setMode('forgot_password');
                        }}
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
                        Sign In & Enter Workspace
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2 space-y-2">
                    <div>
                      <span className="text-xs text-slate-500">New Company or Startup? </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push('/register/company');
                        }}
                        className="text-xs font-extrabold text-emerald-600 hover:underline"
                      >
                        🏢 Complete 3-Step Company Registration
                      </button>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Quick account setup: </span>
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        Quick Register
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ================= REGISTER TAB (WITH OTP VERIFICATION) ================= */}
              {mode === 'register' && (
                <div>
                  {!regOtpStep ? (
                    <form onSubmit={handleSendRegOTP} className="space-y-4">
                      {/* Account Type / Role */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Participating Entity Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
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
                            <div className="text-xs font-bold">Startup / Company</div>
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
                            <div className="text-xs font-bold">Department / Ministry</div>
                            <div className="text-[10px] text-slate-500">Public Buyer</div>
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
                              placeholder="Founder / Officer Name"
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
                            <Send className="w-4 h-4 text-emerald-200" />
                            Send Email Verification OTP 📩
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
                  ) : (
                    /* STEP 2: ENTER OTP CODE */
                    <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          OTP Sent to {regData.email}
                        </div>
                        <p className="text-xs text-emerald-800">
                          Please enter the 6-digit OTP code sent to your email address to activate your entity account.
                        </p>
                        {regDevOtp && (
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300">
                            <span>Dev OTP Code:</span>
                            <span className="text-sm text-emerald-950 font-extrabold">{regDevOtp}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Enter 6-Digit Email OTP Code *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={regOtpCode}
                            onChange={(e) => setRegOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-3.5 py-3 text-lg font-mono tracking-widest bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setRegOtpStep(false)}
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                        >
                          ← Back to Details
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <>
                              <Rocket className="w-4 h-4" />
                              Verify & Activate Account
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ================= FORGOT PASSWORD TAB ================= */}
              {mode === 'forgot_password' && (
                <div>
                  {!forgotOtpSent ? (
                    <form onSubmit={handleSendForgotOTP} className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-blue-950">
                          <KeyRound className="w-4 h-4 text-blue-700" />
                          Email OTP Password Reset
                        </p>
                        <p>Enter your registered official email address. We will send a secure 6-digit OTP code to verify your identity.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Registered Work / Entity Email *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="government@procurement.com"
                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-amber-300" />
                            Send Reset OTP Code 📩
                          </>
                        )}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setMode('signin')}
                          className="text-xs font-bold text-blue-700 hover:underline"
                        >
                          ← Back to Sign In
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          OTP Sent to {forgotEmail}
                        </div>
                        <p className="text-xs text-blue-800">
                          Enter the 6-digit OTP code sent to your email and specify your new security password below.
                        </p>
                        {forgotDevOtp && (
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono font-bold bg-blue-100 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-300">
                            <span>Dev OTP Code:</span>
                            <span className="text-sm text-blue-950 font-extrabold">{forgotDevOtp}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          1. Enter 6-Digit Reset OTP Code *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={forgotOtpCode}
                            onChange={(e) => setForgotOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-3.5 py-2.5 text-base font-mono tracking-widest bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            New Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            placeholder="Min. 6 chars"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={forgotConfirmPassword}
                            onChange={(e) => setForgotConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setForgotOtpSent(false)}
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                        >
                          ← Change Email
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 text-amber-300" />
                              Save New Password 💾
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
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
