import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { ArrowRight, Mail, MessageSquare, Phone, User } from 'lucide-react';

export const ContactDetailsScreen: React.FC = () => {
  const { draftContact, updateDraftContact, navigate, showToast } = useApp();

  const [fullName, setFullName] = useState(draftContact.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(draftContact.mobileNumber || '');
  const [whatsappAvailable, setWhatsappAvailable] = useState(draftContact.whatsappAvailable ?? true);
  const [email, setEmail] = useState(draftContact.email || '');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; mobile?: string } = {};

    if (!fullName.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!mobileNumber.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in the required contact fields', 'error');
      return;
    }

    updateDraftContact({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      whatsappAvailable,
      email: email.trim()
    });

    navigate('review-inquiry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate('add-parts')} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Progress Indicator (Step 4 of 5, segmented bars matching reference) */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex gap-1.5 flex-1">
              <div className="h-1.5 bg-[#fb7800] rounded-full flex-1" />
              <div className="h-1.5 bg-[#fb7800] rounded-full flex-1" />
              <div className="h-1.5 bg-[#fb7800] rounded-full flex-1" />
              <div className="h-1.5 bg-[#fb7800] rounded-full flex-1" />
              <div className="h-1.5 bg-[#e0e3e5] rounded-full flex-1" />
            </div>
            <span className="text-xs font-semibold text-[#43474c] whitespace-nowrap ml-2">
              Step 4 of 5
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e] mb-1">
            How can we contact you?
          </h1>
          <p className="text-xs sm:text-sm text-[#43474c]">
            Please provide your details so our team can reach out with quote & delivery options.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-6 flex-1 flex flex-col">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="Enter your full name"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] outline-none shadow-2xs transition-all ${
                  errors.name
                    ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]'
                    : 'border-[#c3c7cd] focus:border-[#fb7800] focus:ring-1 focus:ring-[#fb7800]'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-[#ba1a1a] mt-1">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={e => {
                  setMobileNumber(e.target.value);
                  if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                }}
                placeholder="+91 99999 00000"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] outline-none shadow-2xs transition-all ${
                  errors.mobile
                    ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]'
                    : 'border-[#c3c7cd] focus:border-[#fb7800] focus:ring-1 focus:ring-[#fb7800]'
                }`}
              />
            </div>
            {errors.mobile && <p className="text-xs text-[#ba1a1a] mt-1">{errors.mobile}</p>}
          </div>

          {/* WhatsApp Toggle Card */}
          <div className="bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#009844]/15 flex items-center justify-center text-[#009844] shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              <div>
                <p className="font-heading font-bold text-xs sm:text-sm text-[#181c1e]">
                  WhatsApp Available?
                </p>
                <p className="text-[11px] sm:text-xs text-[#73777d]">
                  Receive quotes and part updates faster
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whatsappAvailable}
                onChange={e => setWhatsappAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#c3c7cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fb7800]" />
            </label>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full h-12 pl-10 pr-4 bg-white border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] outline-none shadow-2xs"
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#73777d] mt-1 ml-0.5">
              Linked to your account for tracking and invoice delivery
            </p>
          </div>

          <div className="flex-1" />

          {/* Sticky Bottom Next Button */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-[#f7fafc]/95 backdrop-blur-md border-t border-[#e0e3e5] pb-safe">
            <div className="max-w-md mx-auto px-4 py-3 sm:py-3.5">
              <button
                type="submit"
                className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(251,120,0,0.3)] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
