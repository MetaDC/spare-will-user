import React from 'react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { formatInquiryDate } from '../services/firebaseService';
import {
  Car,
  CheckCircle2,
  Clock,
  Headphones,
  Lightbulb,
  MessageSquare,
  Milestone,
  Package,
  Wrench
} from 'lucide-react';

export const InquiryDetailsScreen: React.FC = () => {
  const { activeInquiry, navigate, openActionModal } = useApp();

  const inquiry = activeInquiry;

  if (!inquiry) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7fafc]">
        <Header showBack onBack={() => navigate('inquiries')} />
        <div className="p-8 text-center">
          <p className="text-sm text-[#43474c]">Inquiry not found.</p>
          <button
            onClick={() => navigate('inquiries')}
            className="mt-4 px-4 py-2 bg-[#fb7800] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Back to Inquiries
          </button>
        </div>
      </div>
    );
  }

  const getPartIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('filter') || lower.includes('oil')) {
      return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#021d30]" />;
    }
    if (lower.includes('headlight') || lower.includes('bulb') || lower.includes('lamp')) {
      return <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#021d30]" />;
    }
    return <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[#021d30]" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-[#ffdbc8] text-[#753400]';
      case 'Price Sent':
        return 'bg-[#cde5ff] text-[#021d30]';
      case 'Reviewing':
        return 'bg-[#e0e3e5] text-[#43474c]';
      case 'Completed':
        return 'bg-[#66ff8e]/30 text-[#005322]';
      default:
        return 'bg-[#ffb68b]/40 text-[#592600]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-24 pb-safe">
      <Header showBack onBack={() => navigate('inquiries')} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full space-y-6">
        {/* Summary Card */}
        <section className="bg-white rounded-2xl border border-[#e0e3e5] p-4 shadow-2xs flex justify-between items-center relative overflow-hidden">
          <div>
            <h2 className="text-[10px] sm:text-xs font-semibold text-[#73777d] uppercase tracking-wider mb-0.5">
              Date Submitted
            </h2>
            <p className="font-heading text-sm sm:text-base font-bold text-[#181c1e]">
              {formatInquiryDate(inquiry.createdAt)}
            </p>
            <span className="text-xs font-mono text-[#73777d]">ID: {inquiry.id}</span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
              inquiry.status
            )}`}
          >
            {inquiry.status}
          </span>
        </section>

        {/* Vehicle Details Card (Clean no-image design) */}
        <section className="bg-white rounded-2xl border border-[#e0e3e5] p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#f1f4f6]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d]">
                  Vehicle Information
                </span>
                <h2 className="font-heading text-sm sm:text-base font-bold text-[#181c1e] truncate">
                  {inquiry.vehicle.make} {inquiry.vehicle.model}
                </h2>
              </div>
            </div>

            {inquiry.vehicle.vin ? (
              <span className="text-[10px] sm:text-[11px] font-mono text-[#5f6368] bg-[#f7fafc] border border-[#e0e3e5] px-2.5 py-1 rounded-lg shrink-0 font-medium">
                VIN: {inquiry.vehicle.vin}
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#73777d] bg-[#f1f4f6] px-2.5 py-1 rounded-full shrink-0">
                No VIN provided
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f7fafc] border border-[#eef2f5] rounded-xl p-2.5">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d] mb-0.5">
                Trim / Engine
              </span>
              <span className="font-semibold text-xs sm:text-sm text-[#181c1e] block truncate">
                {inquiry.vehicle.engineTrim}
              </span>
            </div>
            <div className="bg-[#f7fafc] border border-[#eef2f5] rounded-xl p-2.5">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d] mb-0.5">
                Transmission
              </span>
              <span className="font-semibold text-xs sm:text-sm text-[#181c1e] block truncate">
                {inquiry.vehicle.transmission}
              </span>
            </div>
          </div>
        </section>

        {/* Requested Parts List */}
        <section className="bg-white rounded-2xl border border-[#e0e3e5] p-4 shadow-2xs">
          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#181c1e] mb-4 pb-4 border-b border-[#f1f4f6] flex items-center justify-between">
            <span>Requested Parts</span>
            <span className="text-xs font-normal text-[#73777d]">
              {inquiry.parts.length} item(s)
            </span>
          </h3>

          <ul className="space-y-2">
            {inquiry.parts.map(part => (
              <li
                key={part.id}
                className="flex justify-between items-center py-1.5 border-b border-[#f1f4f6] last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4 min-w-0 pr-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#f1f4f6] flex items-center justify-center shrink-0">
                    {getPartIcon(part.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-xs sm:text-sm font-semibold text-[#181c1e] truncate">
                      {part.name}
                    </p>
                    {part.spec && (
                      <p className="text-[11px] sm:text-xs text-[#73777d] truncate">
                        {part.spec}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#fb7800] bg-[#fb7800]/10 px-2.5 py-0.5 rounded-full shrink-0">
                  x{part.quantity}
                </span>
              </li>
            ))}
          </ul>

          {inquiry.additionalNotes && (
            <div className="mt-3 pt-3 border-t border-[#f1f4f6] text-xs text-[#43474c] bg-[#f7fafc] p-2.5 rounded-xl">
              <span className="font-semibold text-[#181c1e] block mb-0.5">Notes:</span>
              <p>{inquiry.additionalNotes}</p>
            </div>
          )}
        </section>

        {/* Status History Timeline */}
        <section className="bg-white rounded-2xl border border-[#e0e3e5] p-4 shadow-2xs">
          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#181c1e] mb-3">
            Status History
          </h3>

          <div className="relative pl-5 sm:pl-6 border-l-2 border-[#e0e3e5] ml-2 space-y-4 py-1">
            {inquiry.statusHistory.map((step, idx) => {
              const isCurrent = step.active;
              const isPast = step.completed && !step.active;

              return (
                <div key={idx} className={`relative ${!step.completed ? 'opacity-50' : ''}`}>
                  {/* Step Bullet */}
                  <div
                    className={`absolute -left-[27px] sm:-left-[31px] top-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ring-4 ring-white transition-all ${
                      isCurrent
                        ? 'bg-[#fb7800]'
                        : isPast
                        ? 'bg-[#021d30]'
                        : 'bg-[#c3c7cd]'
                    }`}
                  />

                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-heading text-xs font-bold ${
                        isCurrent
                          ? 'text-[#fb7800]'
                          : isPast
                          ? 'text-[#021d30]'
                          : 'text-[#43474c]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {step.date && (
                      <span className="text-[10px] text-[#73777d]">{step.date}</span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#73777d] mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support Action Button */}
        <div className="pt-1">
          <button
            onClick={() => openActionModal('whatsapp', `Inquiry ${inquiry.id}`, inquiry.contact.mobileNumber)}
            className="w-full h-12 bg-[#021d30] hover:bg-[#082a44] text-white font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            <Headphones className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
};
