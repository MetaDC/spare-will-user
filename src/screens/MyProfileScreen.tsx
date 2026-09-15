import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import {
  ChevronRight,
  FileText,
  Lock,
  LogOut,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
  X
} from 'lucide-react';

export const MyProfileScreen: React.FC = () => {
  const { currentUser, navigate, signOut, updateProfile, showToast } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    });
    setIsEditModalOpen(false);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-24 pb-safe">
      <Header />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center pt-2 pb-6">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#f1f4f6] border border-[#d8dde1] flex items-center justify-center text-[#181c1e] shadow-xs mb-3">
            <User className="w-9 h-9 sm:w-10 sm:h-10 text-[#43474c]" />
          </div>

          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#181c1e] text-center mb-1">
            {currentUser?.name || 'User Profile'}
          </h2>

          <div className="flex flex-col items-center gap-1 text-xs text-[#43474c]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#73777d]" />
              <span>{currentUser?.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#73777d]" />
              <span>{currentUser?.phone || 'Not provided'}</span>
            </div>
          </div>
        </section>

        {/* Actions Menu */}
        <div className="bg-white rounded-2xl shadow-2xs border border-[#e0e3e5] p-2 space-y-1 mb-6">
          {/* Edit Profile */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full flex items-center justify-between min-h-[46px] px-3 py-2 hover:bg-[#f7fafc] active:bg-[#ebeef0] rounded-xl transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#cde5ff] flex items-center justify-center text-[#021d30] group-active:scale-95 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="font-heading text-xs sm:text-sm font-bold text-[#181c1e]">
                Edit Profile
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#c3c7cd] group-hover:text-[#fb7800] transition-colors" />
          </button>

          <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-[#f1f4f6]" />

          {/* My Inquiries */}
          <button
            onClick={() => navigate('inquiries')}
            className="w-full flex items-center justify-between min-h-[46px] px-3 py-2 hover:bg-[#f7fafc] active:bg-[#ebeef0] rounded-xl transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#cde5ff] flex items-center justify-center text-[#021d30] group-active:scale-95 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-heading text-xs sm:text-sm font-bold text-[#181c1e]">
                My Inquiries
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#c3c7cd] group-hover:text-[#fb7800] transition-colors" />
          </button>

          <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-[#f1f4f6]" />

          {/* Settings */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full flex items-center justify-between min-h-[46px] px-3 py-2 hover:bg-[#f7fafc] active:bg-[#ebeef0] rounded-xl transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#cde5ff] flex items-center justify-center text-[#021d30] group-active:scale-95 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-heading text-xs sm:text-sm font-bold text-[#181c1e]">
                Settings
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#c3c7cd] group-hover:text-[#fb7800] transition-colors" />
          </button>
        </div>

        {/* Sign Out Card */}
        <div className="bg-white rounded-2xl shadow-2xs border border-[#e0e3e5] p-2 mb-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between min-h-[46px] px-3 py-2 hover:bg-[#ffdad6]/20 active:bg-[#ffdad6]/40 rounded-xl transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] group-active:scale-95 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-heading text-xs sm:text-sm font-bold text-[#ba1a1a]">
                Sign Out
              </span>
            </div>
          </button>
        </div>

        {/* Spare Will Brand Footer */}
        <div className="mt-auto text-center py-4">
          <p className="text-[11px] text-[#73777d]">
            Spare Will Automotive Services
          </p>
          <p className="text-[10px] text-[#c3c7cd] mt-0.5">
            All rights reserved • Genuine Parts Guarantee
          </p>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#e0e3e5]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#e0e3e5] mb-4">
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#181c1e]">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#43474c] hover:bg-[#e0e3e5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#43474c] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] focus:border-[#fb7800] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#43474c] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] focus:border-[#fb7800] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#43474c] block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] focus:border-[#fb7800] outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-12 bg-[#f1f4f6] text-[#43474c] font-heading font-semibold text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#e0e3e5]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#e0e3e5] mb-4">
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#181c1e]">
                Settings & Preferences
              </h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#43474c] hover:bg-[#e0e3e5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="py-8 text-center">
                <Settings className="w-10 h-10 text-[#c3c7cd] mx-auto mb-3" />
                <p className="font-heading font-bold text-[#181c1e]">Coming Soon</p>
                <p className="text-[11px] text-[#73777d] mt-1">
                  Push notifications and SMS alerts are currently in development.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                }}
                className="w-full h-12 bg-[#fb7800] text-white font-heading font-bold text-sm rounded-xl shadow-sm mt-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
