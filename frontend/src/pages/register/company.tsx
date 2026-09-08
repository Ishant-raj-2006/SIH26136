import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  ShieldCheck,
  Award,
  User,
  Linkedin,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Home,
  Check,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export default function CompanyRegistrationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = Pending Confirmation Screen
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Step 1 State
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [companyType, setCompanyType] = useState('startup');
  const [companyTypeOther, setCompanyTypeOther] = useState('');
  const [foundedYear, setFoundedYear] = useState<number>(new Date().getFullYear());
  const [headquartersCity, setHeadquartersCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [website, setWebsite] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Email OTP State
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Step 2 State
  const [founderCeoName, setFounderCeoName] = useState('');
  const [authRepName, setAuthRepName] = useState('');
  const [authRepDesignation, setAuthRepDesignation] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Step 3 State
  const [cinNumber, setCinNumber] = useState('');
  const [dpiitNumber, setDpiitNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [incorporationCertUrl, setIncorporationCertUrl] = useState('');
  const [relevantDocUrl, setRelevantDocUrl] = useState('');

  const [isCinLocked, setIsCinLocked] = useState(false);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);

  // Prefill existing startup registration details if present
  useEffect(() => {
    async function loadExistingRegistration() {
      try {
        const startup = await apiClient.getMyStartup();
        if (startup) {
          if (startup.name) setName(startup.name);
          if (startup.logo_url) setLogoUrl(startup.logo_url);
          if (startup.company_type) setCompanyType(startup.company_type);
          if (startup.company_type_other) setCompanyTypeOther(startup.company_type_other);
          if (startup.founded_year) setFoundedYear(startup.founded_year);
          if (startup.headquarters_city) setHeadquartersCity(startup.headquarters_city);
          if (startup.state) setState(startup.state);
          if (startup.website) setWebsite(startup.website);
          if (startup.official_email) {
            setOfficialEmail(startup.official_email);
            setOtpVerified(true); // Existing registered email is verified
          }
          if (startup.contact_number) setContactNumber(startup.contact_number);

          if (startup.founder_ceo_name) setFounderCeoName(startup.founder_ceo_name);
          if (startup.auth_rep_name) setAuthRepName(startup.auth_rep_name);
          if (startup.auth_rep_designation) setAuthRepDesignation(startup.auth_rep_designation);
          if (startup.pan_number) setPanNumber(startup.pan_number);
          if (startup.aadhaar_number) setAadhaarNumber(startup.aadhaar_number);
          if (startup.work_description) setWorkDescription(startup.work_description);
          if (startup.linkedin_url) setLinkedinUrl(startup.linkedin_url);

          if (startup.cin_number) {
            setCinNumber(startup.cin_number);
            setIsCinLocked(true); // Lock CIN/License number once registered
          }
          if (startup.dpiit_number) setDpiitNumber(startup.dpiit_number);
          if (startup.gst_number) setGstNumber(startup.gst_number);
          if (startup.udyam_number) setUdyamNumber(startup.udyam_number);
          if (startup.incorporation_cert_url) setIncorporationCertUrl(startup.incorporation_cert_url);
          if (startup.relevant_doc_url) setRelevantDocUrl(startup.relevant_doc_url);
          if (startup.status) setExistingStatus(startup.status);
        }
      } catch (err) {
        console.log('No existing registration profile found');
      }
    }

    if (user) {
      if (user.email && !officialEmail) setOfficialEmail(user.email);
      if (user.organization && !name) setName(user.organization);
      loadExistingRegistration();
    }
  }, [user]);

  // Handle Logo Upload (PNG max 2MB)
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.png')) {
      toast.error('Company Logo must be a PNG image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image size exceeds 2 MB limit.');
      return;
    }

    setUploadingLogo(true);
    try {
      const res = await apiClient.uploadFile(file, 'logo');
      setLogoUrl(res.url);
      toast.success('Company Logo uploaded successfully (PNG, max 2MB)!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle Send OTP
  const handleSendOTP = async () => {
    if (!officialEmail || !officialEmail.includes('@')) {
      toast.error('Please enter a valid official email address.');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await apiClient.sendOTP(officialEmail.trim(), 'company_registration');
      setEmailOtpSent(true);
      if (res.dev_otp) {
        setDevOtp(res.dev_otp);
        setOtpCode(res.dev_otp);
      }
      toast.success(`6-digit OTP code sent to ${officialEmail.trim()}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to send OTP code');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code received on email.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await apiClient.verifyOTP(officialEmail.trim(), otpCode.trim(), 'company_registration');
      setOtpVerified(true);
      toast.success('Official Email verified successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid or expired OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle Incorporation Cert Upload (PNG max 10MB)
  const handleCertChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.png')) {
      toast.error('Incorporation Certificate must be in PNG format.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Certificate file size exceeds 10 MB limit.');
      return;
    }

    setUploadingCert(true);
    try {
      const res = await apiClient.uploadFile(file, 'certificate');
      setIncorporationCertUrl(res.url);
      toast.success('Incorporation Certificate uploaded to database (PNG, max 10MB)!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to upload certificate');
    } finally {
      setUploadingCert(false);
    }
  };

  // Handle Relevant Doc Upload
  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const res = await apiClient.uploadFile(file, 'document');
      setRelevantDocUrl(res.url);
      toast.success('Registration Document uploaded!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Validation step 1 (All fields mandatory)
  const validateStep1 = () => {
    if (!name.trim()) {
      toast.error('Please enter the Company Name.');
      return false;
    }
    if (!logoUrl) {
      toast.error('Please upload your Company Logo (PNG format, max 2 MB).');
      return false;
    }
    if (companyType === 'other' && !companyTypeOther.trim()) {
      toast.error('Please specify your custom company type in the text box.');
      return false;
    }
    if (!headquartersCity.trim()) {
      toast.error('Please enter Headquarter City.');
      return false;
    }
    if (!website.trim()) {
      toast.error('Please enter Company Website URL.');
      return false;
    }
    if (!officialEmail.trim() || !officialEmail.includes('@')) {
      toast.error('Please enter a valid Official Email address.');
      return false;
    }
    if (!otpVerified) {
      toast.error('Please verify your Official Email with the 6-digit OTP code before proceeding.');
      return false;
    }
    if (!contactNumber.trim()) {
      toast.error('Please enter Contact Number.');
      return false;
    }
    return true;
  };

  // Validation step 2 (All fields mandatory)
  const validateStep2 = () => {
    if (!founderCeoName.trim()) {
      toast.error('Please enter Founder or CEO Name.');
      return false;
    }
    if (!authRepName.trim()) {
      toast.error('Please enter Authorized Representative Name.');
      return false;
    }
    if (!authRepDesignation.trim()) {
      toast.error('Please enter Designation.');
      return false;
    }
    if (!panNumber.trim() || panNumber.trim().length !== 10) {
      toast.error('Please enter a valid 10-character PAN Number (e.g. ABCDE1234F).');
      return false;
    }
    if (!aadhaarNumber.trim() || aadhaarNumber.trim().length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar Number.');
      return false;
    }
    if (!workDescription.trim()) {
      toast.error('Please describe what work/projects the company has executed.');
      return false;
    }
    if (!linkedinUrl.trim()) {
      toast.error('Please enter Company LinkedIn Profile URL.');
      return false;
    }
    return true;
  };

  // Final Submit Step 3 (All fields mandatory)
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cinNumber.trim()) {
      toast.error('Please enter Company Registration Number (CIN/LLPIN).');
      return;
    }
    if (!dpiitNumber.trim()) {
      toast.error('Please enter DPIIT Registration Number.');
      return;
    }
    if (!gstNumber.trim()) {
      toast.error('Please enter GST Number.');
      return;
    }
    if (!udyamNumber.trim()) {
      toast.error('Please enter MSME Udyam Registration Number.');
      return;
    }
    if (!incorporationCertUrl) {
      toast.error('Please upload your Incorporation Certificate (PNG format, max 10 MB).');
      return;
    }
    if (!relevantDocUrl) {
      toast.error('Please upload your Relevant Registration Document.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        logo_url: logoUrl,
        company_type: companyType,
        company_type_other: companyType === 'other' ? companyTypeOther.trim() : null,
        founded_year: Number(foundedYear),
        headquarters_city: headquartersCity.trim(),
        state: state,
        website: website.trim() || null,
        official_email: officialEmail.trim(),
        contact_number: contactNumber.trim(),

        founder_ceo_name: founderCeoName.trim(),
        auth_rep_name: authRepName.trim(),
        auth_rep_designation: authRepDesignation.trim(),
        pan_number: panNumber.trim().toUpperCase(),
        aadhaar_number: aadhaarNumber.trim(),
        work_description: workDescription.trim(),
        linkedin_url: linkedinUrl.trim() || null,

        cin_number: cinNumber.trim().toUpperCase(),
        dpiit_number: dpiitNumber.trim() || null,
        gst_number: gstNumber.trim().toUpperCase() || null,
        udyam_number: udyamNumber.trim() || null,
        incorporation_cert_url: incorporationCertUrl,
        relevant_doc_url: relevantDocUrl || null
      };

      await apiClient.registerCompany(payload);
      toast.success('Company Registration submitted! Application status set to PENDING government verification.');
      setStep(4); // Move to Pending confirmation screen
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to submit company registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Head>
        <title>Company Registration Portal | GoPilot-X BHARAT</title>
        <meta
          name="description"
          content="Multi-step Company and Startup Registration Portal under GFR 194 and DPIIT guidelines."
        />
      </Head>

      <Navigation />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Official Government Procurement Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Company & Startup Registration
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Complete the 3-step verification process to register your enterprise on GoPilot-X BHARAT.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        {step <= 3 && (
          <div className="mb-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 z-0"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />

              {/* Step 1 Badge */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= 1
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
                </div>
                <span className={`text-xs font-medium ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  Basic Details
                </span>
              </div>

              {/* Step 2 Badge */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= 2
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                </div>
                <span className={`text-xs font-medium ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  Leadership & Work
                </span>
              </div>

              {/* Step 3 Badge */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step === 3
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-medium ${step === 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  Statutory Docs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 1: Company Profile & Contact Info</h2>
                <p className="text-xs text-slate-400">Basic entity details, logo, location, and official email OTP verification</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Row 1: Company Name & Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Company Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AeroShield Robotics Pvt Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Company Logo (PNG format, max 2 MB)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-950 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl px-4 py-2 text-sm text-slate-300 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>{uploadingLogo ? 'Uploading Logo...' : logoUrl ? 'Change PNG Logo' : 'Upload PNG Logo'}</span>
                      <input
                        type="file"
                        accept="image/png"
                        onChange={handleLogoChange}
                        disabled={uploadingLogo}
                        className="hidden"
                      />
                    </label>
                    {logoUrl && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/50 bg-slate-950 shrink-0 flex items-center justify-center">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Company Type & Custom Input if Other */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Company Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'startup', label: 'Startup' },
                      { id: 'MSME', label: 'MSME' },
                      { id: 'PV', label: 'PV (Pvt Ltd)' },
                      { id: 'LLP', label: 'LLP' },
                      { id: 'other', label: 'Other' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setCompanyType(type.id)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          companyType === type.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {companyType === 'other' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={companyTypeOther}
                        onChange={(e) => setCompanyTypeOther(e.target.value)}
                        placeholder="Please specify custom company type (e.g., Section 8 Company, Public Trust)"
                        className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Year of Establishment <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(parseInt(e.target.value) || 2024)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 3: City & State Dropdown (All Indian States) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Headquarters City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={headquartersCity}
                    onChange={(e) => setHeadquartersCity(e.target.value)}
                    placeholder="e.g. Pune / Bengaluru / Gurgaon"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    State / Union Territory <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Website URL & Contact Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Contact Number (No OTP required) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Official Email & 6-Digit Email OTP Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    Official Email ID & Verification OTP <span className="text-rose-400">*</span>
                  </label>
                  {otpVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Email Verified
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-medium">OTP Required (6 digits)</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      value={officialEmail}
                      onChange={(e) => {
                        setOfficialEmail(e.target.value);
                        setOtpVerified(false);
                      }}
                      placeholder="corporate@company.com"
                      disabled={otpVerified}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOtp || otpVerified || !officialEmail}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {sendingOtp ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{emailOtpSent ? 'Resend OTP' : 'Send Email OTP'}</span>
                  </button>
                </div>

                {emailOtpSent && !otpVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-center gap-3"
                  >
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit Email OTP"
                        className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-4 py-2 text-sm text-center tracking-widest font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={verifyingOtp || otpCode.length !== 6}
                      className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl px-6 py-2 text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </motion.div>
                )}

                {devOtp && !otpVerified && (
                  <p className="text-[11px] text-emerald-400/90 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                    💡 Demo Email OTP: <span className="font-bold text-white tracking-widest">{devOtp}</span>
                  </p>
                )}
              </div>

              {/* Step 1 Next Button */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <span>Next: Leadership Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 2: Founder, Representative & Work Details</h2>
                <p className="text-xs text-slate-400">Executive leadership, PAN/Aadhaar compliance, and company experience</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Row 1: Founder/CEO & Authorized Representative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Founder or CEO Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={founderCeoName}
                    onChange={(e) => setFounderCeoName(e.target.value)}
                    placeholder="Enter Founder / CEO Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Authorized Representative Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={authRepName}
                    onChange={(e) => setAuthRepName(e.target.value)}
                    placeholder="Enter Representative Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Designation & LinkedIn Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Designation of Authorized Representative <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={authRepDesignation}
                    onChange={(e) => setAuthRepDesignation(e.target.value)}
                    placeholder="e.g. Managing Director / CTO / Vice President"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    LinkedIn Profile URL of Company
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/company/aeroshield"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: PAN Number & Aadhaar Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    PAN Number (10 Alphanumeric Chars) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Aadhaar Number (12 Digits) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456789012"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 4: Work of Company */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Work of Company (Projects executed / Core competencies) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Describe your company's technology products, past public domain deployments, R&D capabilities, or solution focus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <span>Next: Statutory Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3 FORM */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 3: Statutory Registration & Certificate Uploads</h2>
                <p className="text-xs text-slate-400">CIN, DPIIT, GST, MSME Udyam numbers & Incorporation Certificate (PNG max 10MB)</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-6">
              {/* Row 1: CIN & DPIIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-slate-300">
                      Company Registration Number (CIN / LLPIN / License No) <span className="text-rose-400">*</span>
                    </label>
                    {isCinLocked && (
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        🔒 Locked after Registration
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    disabled={isCinLocked}
                    value={cinNumber}
                    onChange={(e) => setCinNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. U72900MH2021PTC123456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    DPIIT Registration Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={dpiitNumber}
                    onChange={(e) => setDpiitNumber(e.target.value)}
                    placeholder="e.g. DIPP123456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: GST Number & MSME Udyam */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    GST Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    MSME Udyam Registration Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={udyamNumber}
                    onChange={(e) => setUdyamNumber(e.target.value)}
                    placeholder="e.g. UDYAM-MH-01-0001234"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Document Upload 1: Incorporation Certificate (PNG, max 10MB) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Incorporation Certificate Upload (PNG format, max 10 MB) <span className="text-rose-400">*</span>
                  </label>
                  {incorporationCertUrl && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Saved in Database
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-xs text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span>
                      {uploadingCert
                        ? 'Saving PNG Certificate to Database...'
                        : incorporationCertUrl
                        ? 'Replace PNG Incorporation Certificate'
                        : 'Choose PNG Incorporation Certificate File'}
                    </span>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={handleCertChange}
                      disabled={uploadingCert}
                      className="hidden"
                    />
                  </label>

                  {incorporationCertUrl && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950 shrink-0 flex items-center justify-center p-1">
                      <img src={incorporationCertUrl} alt="Cert Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload 2: Relevant Registration Document */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Relevant Registration Document (PNG Upload) <span className="text-rose-400">*</span>
                  </label>
                  {relevantDocUrl && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-cyan-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      Uploaded
                    </span>
                  )}
                </div>

                <label className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-3 text-xs text-slate-300 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>
                    {uploadingDoc
                      ? 'Uploading document...'
                      : relevantDocUrl
                      ? 'Replace Relevant Registration Document'
                      : 'Upload Relevant Registration Document'}
                  </span>
                  <input
                    type="file"
                    onChange={handleDocChange}
                    disabled={uploadingDoc}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submission Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 2</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting || !incorporationCertUrl}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-8 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/25 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-slate-950" />
                      <span>Submit Company Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 4: PENDING APPROVAL CONFIRMATION SCREEN */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-slate-900/90 border border-amber-500/30 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6"
          >
            {/* Pending Clock Icon Badge */}
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 mb-3">
                Status: Pending Government Approval
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Company Registration Submitted!
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Your company registration details and Incorporation Certificate have been successfully saved in our database and forwarded for government review.
              </p>
            </div>

            {/* Restricted Access Information Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Portal Access Rules for Pending Registrations:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 pl-6 list-disc">
                <li>
                  <strong className="text-emerald-400">Home Page Access:</strong> You can freely browse public challenges and problem statements posted by government departments.
                </li>
                <li>
                  <strong className="text-amber-400">Proposals Restricted:</strong> You cannot submit proposals or challenge applications until government officers complete your document verification.
                </li>
              </ul>
            </div>

            {/* Go to Home Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25"
              >
                <Home className="w-5 h-5 text-slate-950" />
                <span>Go to Home Page</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
