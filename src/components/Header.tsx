import React from 'react';
import { useApp } from '../context/AppContext';
import { LOGO_URL } from '../data/mockData';
import { ArrowLeft, Menu, User } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  hideAvatar?: boolean;
  showMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title,
  hideAvatar = false,
  showMenu = false,
}) => {
  const { navigate, goBack, currentUser, screenHistory, currentScreen } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  const canGoBack = screenHistory && screenHistory.length > 1 && currentScreen !== 'home';
  const displayBack = showBack || canGoBack;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f7fafc]/95 backdrop-blur-xs border-b border-[#e5e9eb] transition-colors">
      <div className="max-w-md mx-auto w-full px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {displayBack && (
            <button
              onClick={handleBack}
              className={`w-9 h-9 -ml-1 rounded-full items-center justify-center text-[#181c1e] hover:bg-[#ebeef0] active:scale-95 transition-transform shrink-0 cursor-pointer ${
                showBack ? 'flex' : 'hidden sm:flex'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#181c1e]" />
            </button>
          )}

          {showMenu && !showBack && (
            <button
              onClick={() => navigate('services')}
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#43474c] hover:bg-[#ebeef0] active:scale-95 transition-transform shrink-0 cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#181c1e]" />
            </button>
          )}

          {/* Spare Will Official Logo positioned at top left corner */}
          <button
            onClick={() => navigate('home')}
            className="focus:outline-none group shrink-0 cursor-pointer -ml-1"
            aria-label="Spare Will Home"
          >
            <div className="flex items-center justify-center py-1">
              <img
                src={LOGO_URL}
                alt="Spare Will"
                className="h-10 w-auto object-contain transition-transform group-active:scale-95"
              />
            </div>
          </button>
        </div>

        {title && (
          <h1 className="font-heading text-sm sm:text-base font-bold text-[#181c1e] truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] text-center px-1">
            {title}
          </h1>
        )}

        {!hideAvatar ? (
          <button
            onClick={() => (currentUser ? navigate('profile') : navigate('signin'))}
            className="w-9 h-9 rounded-full border border-[#c3c7cd] bg-[#eef2f5] flex items-center justify-center text-[#181c1e] hover:bg-[#e2e7eb] active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
            aria-label="User profile"
          >
            <User className="w-4.5 h-4.5 text-[#181c1e]" />
          </button>
        ) : (
          <div className="w-9 shrink-0" />
        )}
      </div>
    </header>
  );
};
