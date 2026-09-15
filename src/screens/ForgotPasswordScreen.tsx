import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOGO_URL } from '../data/mockData';
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Reset email dispatched!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] px-4 py-8 max-w-sm mx-auto w-full justify-between">
      {/* Header */}
      <header className="flex flex-col items-center pt-2">
        <div className="w-full flex items-center justify-between mb-6 -ml-2">
          <button
            onClick={() => navigate('signin')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#181c1e] hover:bg-[#ebeef0] relative z-10"
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
                className="w-[160px] h-auto object-contain transition-transform group-active:scale-95"
              />
            </div>
          </button>
          <div className="w-10" />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181c1e] text-center w-full">
          Reset Password
        </h1>
        <p className="text-sm text-[#43474c] text-center mt-1.5 w-full">
          Enter your registered email to receive recovery instructions.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        {!isSubmitted ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-10 pr-4 bg-white border border-[#c3c7cd] focus:border-[#fb7800] rounded-xl text-sm outline-none shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-base rounded-xl shadow-[0_4px_16px_rgba(251,120,0,0.3)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="bg-white border border-[#e0e3e5] rounded-2xl p-6 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#009844]/15 text-[#009844] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#181c1e] mb-1">
              Check Your Inbox
            </h3>
            <p className="text-xs text-[#43474c] leading-relaxed mb-4">
              We sent a password reset link to <strong className="text-[#181c1e]">{email}</strong>.
            </p>
            <button
              onClick={() => navigate('signin')}
              className="w-full h-12 bg-[#021d30] text-white font-heading font-bold text-xs rounded-xl"
            >
              Return to Sign In
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pt-4 text-center">
        <button
          onClick={() => navigate('signin')}
          className="text-xs font-heading font-bold text-[#fb7800] hover:underline"
        >
          Back to Sign In
        </button>
      </footer>
    </div>
  );
};
