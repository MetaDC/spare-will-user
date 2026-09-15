import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MessageSquare, X, ExternalLink } from 'lucide-react';

export const ContactActionModal: React.FC = () => {
  const { actionModal, closeActionModal, showToast } = useApp();

  if (!actionModal) return null;

  const isWhatsApp = actionModal.type === 'whatsapp';
  const cleanPhone = actionModal.phoneNumber.replace(/[^0-9+]/g, '');

  const handleExecute = () => {
    if (isWhatsApp) {
      const msg = encodeURIComponent(`Hi Spare Will, I would like to inquire about your ${actionModal.serviceTitle} service.`);
      window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${msg}`, '_blank');
      showToast('Opening WhatsApp...', 'success');
    } else {
      window.location.href = `tel:${cleanPhone}`;
      showToast('Connecting call to Spare Will...', 'success');
    }
    closeActionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#e0e3e5] relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeActionModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#43474c] hover:bg-[#e0e3e5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
            isWhatsApp ? 'bg-[#009844]' : 'bg-[#021d30]'
          }`}>
            {isWhatsApp ? (
              <MessageSquare className="w-6 h-6 fill-current" />
            ) : (
              <Phone className="w-6 h-6 fill-current" />
            )}
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#181c1e]">
              {isWhatsApp ? 'Connect on WhatsApp' : 'Call Spare Will Support'}
            </h3>
            <p className="text-xs text-[#73777d]">
              Service: {actionModal.serviceTitle}
            </p>
          </div>
        </div>

        <div className="bg-[#f7fafc] border border-[#e0e3e5] rounded-xl p-4 mb-6 text-sm text-[#43474c] space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[#73777d]">
            <span>Dedicated Hotline</span>
            <span className="font-semibold text-[#181c1e]">{actionModal.phoneNumber}</span>
          </div>
          <p className="text-xs text-[#73777d] pt-1 border-t border-[#e0e3e5]">
            {isWhatsApp
              ? 'Our 24/7 support representative will respond with pricing, availability, and immediate dispatch.'
              : 'Our automotive assistance team is ready to answer questions and coordinate service.'}
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={closeActionModal}
            className="flex-1 h-12 bg-[#f1f4f6] text-[#43474c] font-heading font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#e0e3e5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            className={`flex-1 h-12 text-white font-heading font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer ${
              isWhatsApp ? 'bg-[#009844] hover:bg-[#007f38]' : 'bg-[#021d30] hover:bg-[#082a44]'
            }`}
          >
            <span>{isWhatsApp ? 'Open Chat' : 'Place Call'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
