import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk, useUser } from '@clerk/nextjs';
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
  Send,
  Landmark
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register' | 'clerk' | 'forgot_password';
  defaultRole?: string;
}

const entityCategories = [
  { id: 'startup', label: '🚀 Startup', email: 'startup@procurement.com', pass: 'Startup@123', desc: 'DPIIT Exempt' },
  { id: 'company', label: '🏢 Company', email: 'company@procurement.com', pass: 'Company@123', desc: 'Enterprise' },
  { id: 'department', label: '🏛️ Department', email: 'government@procurement.com', pass: 'Government@123', desc: 'Public Buyer' },
  { id: 'maintenance', label: '🔧 Maintenance', email: 'maintenance@procurement.com', pass: 'Maintenance@123', desc: 'Platform Ops' },
];

export const departmentOptions = [
  'Ministry of Electronics & Information Technology (MeitY)',
  'Department for Promotion of Industry and Internal Trade (DPIIT)',
  'Ministry of Defence (MoD / iDEX)',
  'Department of Space / ISRO',
  'Ministry of Housing and Urban Affairs (MoHUA)',
  'Ministry of Health and Family Welfare (MoHFW)',
  'Department of Science and Technology (DST)',
  'Ministry of Railways / RailTel',
  'NITI Aayog Sandbox Procurement Division',
];

export const AuthDrawer: React.FC<AuthDrawerProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  defaultRole = 'startup'
}) => {
  const router = useRouter();
  const { login, register, clearError } = useAuthStore();
  const clerk = useClerk();
  const { user: clerkUser, isSignedIn: isClerkSignedIn } = useUser();

  const [mode, setMode] = useState<'signin' | 'register' | 'clerk' | 'forgot_password'>(initialMode);
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
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    agreeTerms: true
  });

  // Clerk Google Sign-In Handler
  const handleClerkGoogleAuth = () => {
    try {
      clerk.openSignIn();
    } catch (err: any) {
      toast.error('Opening Clerk Authentication modal...');
    }
  };

  // Auto Sync Clerk user to platform DB if signed in
  useEffect(() => {
    if (isClerkSignedIn && clerkUser && isOpen) {
      const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
      if (primaryEmail) {
        setIsLoading(true);
        apiClient.clerkSync({
          email: primaryEmail,
          full_name: clerkUser.fullName || clerkUser.firstName || primaryEmail.split('@')[0],
          role: regData.role || selectedEntity,
          department: regData.department,
        }).then((res) => {
          apiClient.setToken(res.access_token);
          useAuthStore.getState().getCurrentUser();
          toast.success(`Authenticated via Clerk as ${primaryEmail}`);
          onClose();
          router.push('/dashboard');
        }).catch((err) => {
          console.error("Clerk sync error:", err);
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }
  }, [isClerkSignedIn, clerkUser, isOpen]);

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

          {/* Right Sliding Floating Drawer Panel */}
          <motion.div
            initial={{ x: '110%', opacity: 0, scale: 0.96 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '110%', opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="absolute top-2 right-2 bottom-2 sm:top-4 sm:right-4 sm:bottom-4 w-[calc(100%-1rem)] sm:w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] rounded-3xl border border-slate-200/90 flex flex-col z-10 overflow-hidden my-auto max-h-[96vh]"
          >
            {/* Top National Tri-Color Accent */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-amber-300 shadow-md shadow-blue-900/20 border border-blue-600/30">
                  <Building2 className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">GoPilot-X</h3>
                    <span className="text-[10px] uppercase font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                      SANDBOX
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">National Startup Public Procurement Access</p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-all hover:rotate-90 duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setLocalError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-blue-950 shadow-md shadow-slate-200/80 border border-slate-200/80'
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
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-blue-950 shadow-md shadow-slate-200/80 border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Entity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('clerk');
                    setLocalError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'clerk'
                      ? 'bg-slate-900 text-amber-300 shadow-md shadow-slate-900/20 border border-slate-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clerk Login ⚡
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
                  className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>{localError}</div>
                </motion.div>
              )}

              {/* ================= SIGN IN TAB ================= */}
              {mode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  {/* Clerk Google OAuth Integration TOP */}
                  <button
                    type="button"
                    onClick={handleClerkGoogleAuth}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2.5 transition-all border border-slate-800 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                      />
                    </svg>
                    <span>One-Click Sign In with Google (Clerk SSO)</span>
                  </button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                      <span className="bg-white px-3 text-slate-400">Or Enter Password Credentials</span>
                    </div>
                  </div>

                  {/* Entity Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                            className={`p-2 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-600 text-blue-950 font-bold shadow-md shadow-blue-600/10 ring-2 ring-blue-600/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{cat.label}</div>
                            <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{cat.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Work / Entity Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="official.officer@gov.in or founder@startup.in"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Security Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(signInEmail);
                          setMode('forgot_password');
                        }}
                        className="text-xs text-blue-700 hover:text-blue-900 font-bold transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center gap-2 text-xs text-blue-950 font-medium">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Protected under 256-bit NIC / Government e-Security Standard</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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

                  <div className="text-center pt-1 space-y-1">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">New Company or Startup? </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push('/register/company');
                        }}
                        className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                      >
                        🏢 Complete 3-Step Company Registration
                      </button>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Quick account setup: </span>
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                      >
                        Quick Register
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ================= REGISTER TAB (WITH OTP VERIFICATION & DEPARTMENT SELECTION) ================= */}
              {mode === 'register' && (
                <div>
                  {!regOtpStep ? (
                    <form onSubmit={handleSendRegOTP} className="space-y-3.5">
                      {/* Clerk Quick Register Button TOP */}
                      <button
                        type="button"
                        onClick={handleClerkGoogleAuth}
                        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2.5 transition-all border border-emerald-800 hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                          />
                        </svg>
                        <span>One-Click Register with Google (Clerk OAuth)</span>
                      </button>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                          <span className="bg-white px-3 text-slate-400">Or Register With Email OTP</span>
                        </div>
                      </div>

                      {/* Account Type / Role */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Participating Entity Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRegData({ ...regData, role: 'startup' })}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              regData.role === 'startup'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Rocket className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                            <div className="text-xs font-bold">Startup / Company</div>
                            <div className="text-[10px] text-slate-500">DPIIT Exempt</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRegData({ ...regData, role: 'department' })}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              regData.role === 'department'
                                ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                            <div className="text-xs font-bold">Department / Ministry</div>
                            <div className="text-[10px] text-slate-500">Public Buyer</div>
                          </button>
                        </div>
                      </div>

                      {/* Select Department / Ministry Connection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Select Department / Ministry Connection 🏛️
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Landmark className="w-3.5 h-3.5" />
                          </div>
                          <select
                            value={regData.department}
                            onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600 transition-all appearance-none"
                          >
                            {departmentOptions.map((dept, idx) => (
                              <option key={idx} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
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
                              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
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
                              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Official Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Official Work / Gmail Email
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
                            placeholder="contact@innovations.in or user@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
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
                            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
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
                            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      {/* GFR Compliance Checkbox */}
                      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={regData.agreeTerms}
                          onChange={(e) => setRegData({ ...regData, agreeTerms: e.target.checked })}
                          className="w-4 h-4 mt-0.5 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I certify that this entity conforms to DPIIT startup criteria or government public body status under GFR 2017 Rule 194 guidelines.
                        </span>
                      </label>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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

                      <div className="text-center pt-1">
                        <span className="text-xs text-slate-500 font-medium">Already registered? </span>
                        <button
                          type="button"
                          onClick={() => setMode('signin')}
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                        >
                          Sign In to Workspace
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STEP 2: ENTER OTP CODE & CONFIRM DEPARTMENT */
                    <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          OTP Sent to {regData.email}
                        </div>
                        <p className="text-xs text-emerald-800">
                          Please enter the 6-digit OTP code sent to your email address to activate your entity account.
                        </p>
                        {regDevOtp && (
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono font-bold bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300">
                            <span>Dev OTP Code:</span>
                            <span className="text-sm text-emerald-950 font-extrabold">{regDevOtp}</span>
                          </div>
                        )}
                      </div>

                      {/* Connected Department Confirmation */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Connected Department / Ministry Connection 🏛️
                        </label>
                        <select
                          value={regData.department}
                          onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600 transition-all"
                        >
                          {departmentOptions.map((dept, idx) => (
                            <option key={idx} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
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
                            className="w-full pl-10 pr-3.5 py-3 text-lg font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setRegOtpStep(false)}
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                        >
                          ← Back to Details
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <>
                              <Rocket className="w-4 h-4 text-amber-300" />
                              Verify & Activate Account
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ================= CLERK AUTH TAB ================= */}
              {mode === 'clerk' && (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white space-y-2.5 shadow-xl border border-indigo-800/40">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                      <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                      Clerk Single Sign-On (SSO) & Google Auth
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      Authenticate securely using Clerk OAuth credentials or Google account. Your platform identity and department connection will be automatically synced.
                    </p>
                  </div>

                  {/* Account Type / Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Participating Entity Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {entityCategories.map((cat) => {
                        const isSelected = selectedEntity === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedEntity(cat.id)}
                            className={`p-2.5 rounded-2xl border text-center transition-all ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-600 text-blue-950 font-bold shadow-md shadow-blue-600/10 ring-2 ring-blue-600/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{cat.label}</div>
                            <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{cat.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select Department / Ministry Connection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Select Department / Ministry Connection 🏛️
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Landmark className="w-3.5 h-3.5" />
                      </div>
                      <select
                        value={regData.department}
                        onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all appearance-none"
                      >
                        {departmentOptions.map((dept, idx) => (
                          <option key={idx} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Clerk Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleClerkGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-900/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                          />
                        </svg>
                        <span>Sign In with Google / Clerk SSO</span>
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Protected under Clerk Authentication & Govt e-Security Standard</span>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
                    >
                      Need standard password reset? Click here
                    </button>
                  </div>
                </div>
              )}

              {/* ================= FORGOT PASSWORD TAB ================= */}
              {mode === 'forgot_password' && (
                <div>
                  {!forgotOtpSent ? (
                    <form onSubmit={handleSendForgotOTP} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs space-y-1.5">
                        <p className="font-bold flex items-center gap-1.5 text-blue-900 text-sm">
                          <KeyRound className="w-4 h-4 text-blue-700" />
                          Email OTP Password Reset
                        </p>
                        <p className="text-slate-700">Enter your registered official email address. We will send a secure 6-digit OTP code to verify your identity.</p>
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
                            className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                        >
                          ← Back to Sign In
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          OTP Sent to {forgotEmail}
                        </div>
                        <p className="text-xs text-slate-700">
                          Enter the 6-digit OTP code sent to your email and specify your new security password below.
                        </p>
                        {forgotDevOtp && (
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono font-bold bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300">
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
                            className="w-full pl-10 pr-3.5 py-3 text-base font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 font-bold"
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
                            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
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
                            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setForgotOtpSent(false)}
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                        >
                          ← Change Email
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
            <div className="p-4 border-t border-slate-100 bg-slate-50/90 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Govt. of India • PS SIH26136</span>
              <span className="font-semibold text-emerald-700">DPIIT Sandbox Exemption</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
