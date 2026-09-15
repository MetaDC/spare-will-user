import React from 'react';
import { ServiceItem } from '../types';
import { useApp } from '../context/AppContext';
import { Search, MessageSquare, Phone } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { navigate, openActionModal } = useApp();

  const handlePrimaryAction = () => {
    if (service.id === 'spare-parts') {
      navigate('add-vehicle');
    } else {
      openActionModal('whatsapp', service.title, service.whatsappNumber);
    }
  };

  const handleCallAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    openActionModal('call', service.title, service.phoneNumber);
  };

  const handleWhatsAppAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    openActionModal('whatsapp', service.title, service.whatsappNumber);
  };

  return (
    <article className="bg-[#ffffff] rounded-2xl border border-[#e0e3e5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
      {/* 16:9 Service Image */}
      <div className="w-full aspect-video relative bg-[#e5e9eb] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-base sm:text-lg font-bold text-[#181c1e] mb-1">
          {service.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#73777d] leading-relaxed mb-4 flex-1">
          {service.description}
        </p>

        {/* Action Button(s) */}
        {service.type === 'inquiry' ? (
          <button
            onClick={handlePrimaryAction}
            className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(251,120,0,0.25)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            Create Inquiry
          </button>
        ) : (
          <div className="flex gap-2 sm:gap-2.5 w-full">
            <button
              onClick={handleWhatsAppAction}
              className="flex-1 h-12 bg-[#009844] hover:bg-[#007f38] text-white font-heading font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              WhatsApp
            </button>
            <button
              onClick={handleCallAction}
              className="flex-1 h-12 bg-[#021d30] hover:bg-[#082a44] text-white font-heading font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current shrink-0" />
              Call
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
