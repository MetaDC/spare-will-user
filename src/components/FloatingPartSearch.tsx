import React from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export const FloatingPartSearch: React.FC = () => {
  const { navigate } = useApp();

  const handleOpenSearch = () => {
    navigate('add-vehicle');
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-white/95 backdrop-blur-md border-t border-[#e0e3e5] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto px-4 py-4 w-full">
        <button
          type="button"
          onClick={handleOpenSearch}
          className="w-full text-left group cursor-pointer block focus:outline-none"
          aria-label="Search spare parts and start inquiry"
        >
          <div className="font-heading text-xs sm:text-sm font-bold text-[#181c1e] group-hover:text-[#fb7800] transition-colors mb-1.5">
            What parts do you need?
          </div>

          <div className="w-full h-12 bg-[#f7fafc] border border-[#c3c7cd] group-hover:border-[#fb7800] rounded-xl px-4 flex items-center gap-3 text-[#73777d] group-hover:bg-white transition-all shadow-2xs">
            <Search className="w-4 h-4 text-[#73777d] group-hover:text-[#fb7800] transition-colors shrink-0" />
            <span className="text-xs sm:text-sm text-[#73777d] select-none truncate">
              Type spare part name…
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

