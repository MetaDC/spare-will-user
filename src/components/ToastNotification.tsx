import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
          isSuccess
            ? 'bg-[#021d30] text-white border-white/20'
            : isError
            ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
            : 'bg-[#181c1e] text-white border-white/10'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-[#66ff8e] shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-white shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-[#fb7800] shrink-0" />
        )}
        <span className="flex-1 text-xs leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
