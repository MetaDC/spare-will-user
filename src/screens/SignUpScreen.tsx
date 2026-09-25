import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOGO_URL } from '../data/mockData';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';

export const SignUpScreen: React.FC = () => {
  const { signUp, navigate, goBack, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreeTerms) {
      showToast('Please agree to terms and conditions to create an account', 'error');
      return;
    }

    signUp(name.trim(), email.trim(), password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] px-4 py-6 max-w-sm mx-auto w-full justify-between">
      {/* Header with Back Button and Logo */}
      <header className="flex flex-col items-center pt-2 pb-4">
        <div className="w-full flex items-center justify-between mb-4 -ml-2">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#181c1e] hover:bg-[#ebeef0] active:scale-95 transition-all cursor-pointer relative z-10"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('home')}
            className="focus:outline-none group cursor-pointer"
            aria-label="Spare Will Home"
          >
            <div className="flex items-center justify-center py-2">
              <img
                src={LOGO_URL}
                alt="Spare Will"
                className="w-[140px] sm:w-[160px] h-auto object-contain transition-transform group-active:scale-95"
              />
            </div>
          </button>
          <div className="w-10" />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181c1e] text-center w-full">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-[#43474c] text-center mt-1 w-full">
          Join Spare Will for quick automotive inquiries & tracking.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 flex flex-col justify-center">
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full h-12 pl-10 pr-4 bg-white border border-[#c3c7cd] focus:border-[#fb7800] rounded-xl text-sm outline-none shadow-2xs"
              />
            </div>
            {errors.name && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 pl-10 pr-4 bg-white border border-[#c3c7cd] focus:border-[#fb7800] rounded-xl text-sm outline-none shadow-2xs"
              />
            </div>
            {errors.email && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full h-12 pl-10 pr-11 bg-white border border-[#c3c7cd] focus:border-[#fb7800] rounded-xl text-sm outline-none shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73777d] hover:text-[#181c1e] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.password}</p>}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="accent-[#fb7800] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-[#43474c] cursor-pointer">
              I agree to the <span className="text-[#fb7800] font-semibold">Terms of Service</span> &{' '}
              <span className="text-[#fb7800] font-semibold">Privacy Policy</span>
            </label>
          </div>

          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-base rounded-xl shadow-[0_4px_16px_rgba(251,120,0,0.3)] active:scale-[0.99] transition-all cursor-pointer mt-3"
          >
            Create Account
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-sm text-[#43474c]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('signin')}
            className="font-heading font-bold text-[#fb7800] hover:underline ml-1"
          >
            Sign In
          </button>
        </p>
      </footer>
    </div>
  );
};
