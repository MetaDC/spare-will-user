import React from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import { Home, Wrench, FileText, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate, inquiries } = useApp();

  const tabs: { id: Screen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Exclude bottom nav on Home screen (per sticky search design) and transactional / single purpose linear flow screens
  const isNavSuppressed = [
    'home',
    'add-vehicle',
    'add-parts',
    'contact-details',
    'review-inquiry',
    'inquiry-sent',
    'inquiry-details',
    'signin',
    'signup',
    'forgot-password'
  ].includes(currentScreen);

  if (isNavSuppressed) {
    return null;
  }

  const isTabActive = (tabId: Screen) => {
    if (tabId === 'home' && currentScreen === 'home') return true;
    if (tabId === 'services' && currentScreen === 'services') return true;
    if (tabId === 'inquiries' && (currentScreen === 'inquiries' || currentScreen === 'inquiry-details')) return true;
    if (tabId === 'profile' && (currentScreen === 'profile' || currentScreen === 'edit-profile')) return true;
    return false;
  };

  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[#ebeef0]/95 backdrop-blur-md border-t border-[#c3c7cd]/50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto h-[60px] sm:h-[64px] flex items-center justify-around px-1 sm:px-2">
        {tabs.map(tab => {
          const active = isTabActive(tab.id);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex-1 h-full flex flex-col items-center justify-center relative transition-all duration-150 active:scale-95 cursor-pointer select-none ${
                active
                  ? 'text-[#fb7800] font-bold'
                  : 'text-[#43474c] hover:text-[#181c1e]'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-[#fb7800] rounded-b-md" />
              )}
              <div className="relative mb-0.5 mt-0.5">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {tab.id === 'inquiries' && newInquiriesCount > 0 && !active && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#fb7800] rounded-full" />
                )}
              </div>
              <span className={`text-[11px] sm:text-[12px] leading-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
