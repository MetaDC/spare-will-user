import React, { useState } from 'react';
import { Header } from '../components/Header';
import { VehicleSelectorModal } from '../components/VehicleSelectorModal';
import { useApp } from '../context/AppContext';
import { Car, Edit2, Mail, MessageSquare, Phone, Send, User, Wrench } from 'lucide-react';

export const ReviewInquiryScreen: React.FC = () => {
  const {
    draftVehicle,
    draftParts,
    draftContact,
    draftNotes,
    setDraftNotes,
    submitInquiry,
    navigate
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const id = await submitInquiry();
    setIsSubmitting(false);
    if (id) {
      navigate('inquiry-sent', { inquiryId: id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate('contact-details')} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
        {/* Progress Indicator (Step 5 of 5) */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#43474c] uppercase tracking-wider">Step 5 of 5</span>
            <span className="text-[#fb7800] font-bold">Review</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#fb7800] rounded-full w-full" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e] mb-6">
          Review Your Inquiry
        </h1>

        {/* Bento Review Sections */}
        <div className="space-y-6">
          {/* 1. Vehicle Summary Card */}
          <section className="bg-white border border-[#e0e3e5] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#f1f4f6]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d]">
                    Vehicle
                  </span>
                  <h2 className="font-heading text-sm sm:text-base font-bold text-[#181c1e] truncate">
                    {draftVehicle.year ? `${draftVehicle.year} ` : ''}{draftVehicle.make} {draftVehicle.model}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(true)}
                className="text-xs font-bold text-[#fb7800] hover:text-[#994700] px-2.5 py-1 rounded-lg bg-[#fb7800]/10 hover:bg-[#fb7800]/20 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#f7fafc] border border-[#eef2f5] rounded-xl p-2.5">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d] mb-0.5">
                  {draftVehicle.variantName ? 'Variant / Engine' : 'Trim / Engine'}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#181c1e] block truncate">
                  {draftVehicle.variantName
                    ? [draftVehicle.variantName, draftVehicle.engine].filter(Boolean).join(' · ')
                    : draftVehicle.engineTrim}
                </span>
              </div>
              <div className="bg-[#f7fafc] border border-[#eef2f5] rounded-xl p-2.5">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#73777d] mb-0.5">
                  {draftVehicle.fuelType ? 'Transmission / Fuel' : 'Transmission'}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#181c1e] block truncate">
                  {draftVehicle.fuelType
                    ? [draftVehicle.transmission, draftVehicle.fuelType].filter(Boolean).join(' · ')
                    : draftVehicle.transmission}
                </span>
              </div>
            </div>

            {draftVehicle.vin && (
              <div className="mt-2.5 pt-2 border-t border-[#f1f4f6] flex items-center justify-between text-xs">
                <span className="text-[#73777d] text-[11px]">VIN / Chassis</span>
                <span className="font-mono text-[11px] font-semibold text-[#181c1e] bg-[#f7fafc] border border-[#e0e3e5] px-2 py-0.5 rounded">
                  {draftVehicle.vin}
                </span>
              </div>
            )}
          </section>

          {/* 2. Requested Parts Card */}
          <section className="bg-white border border-[#e0e3e5] rounded-xl p-4 shadow-2xs">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#181c1e] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#fb7800]" />
                Requested Parts
              </h3>
              <button
                type="button"
                onClick={() => navigate('add-parts')}
                className="text-xs font-bold text-[#fb7800] hover:text-[#994700] px-2 py-0.5 rounded-md hover:bg-[#fb7800]/10 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>
            <ul className="pl-6 space-y-2">
              {draftParts.map(part => (
                <li
                  key={part.id}
                  className="flex justify-between items-center border-b border-[#f1f4f6] pb-1.5 last:border-0 last:pb-0"
                >
                  <div className="pr-2 min-w-0">
                    <p className="font-heading text-xs sm:text-sm font-semibold text-[#181c1e] truncate">
                      {part.name}
                    </p>
                    {part.spec && (
                      <p className="text-[11px] sm:text-xs text-[#73777d] truncate">
                        {part.spec}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold font-mono bg-[#f1f4f6] text-[#181c1e] px-2 py-0.5 rounded-md shrink-0">
                    x{part.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Contact Details Card */}
          <section className="bg-white border border-[#e0e3e5] rounded-xl p-4 shadow-2xs">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#181c1e] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#fb7800]" />
                Contact Details
              </h3>
              <button
                type="button"
                onClick={() => navigate('contact-details')}
                className="text-xs font-bold text-[#fb7800] hover:text-[#994700] px-2 py-0.5 rounded-md hover:bg-[#fb7800]/10 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>
            <div className="pl-6 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-[#181c1e]">
                <User className="w-4 h-4 text-[#73777d] shrink-0" />
                <span className="font-medium truncate">{draftContact.fullName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#181c1e]">
                <Phone className="w-4 h-4 text-[#73777d] shrink-0" />
                <span>{draftContact.mobileNumber}</span>
                {draftContact.whatsappAvailable && (
                  <span className="text-[10px] bg-[#009844]/15 text-[#009844] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 fill-current" /> WhatsApp
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-[#181c1e]">
                <Mail className="w-4 h-4 text-[#73777d] shrink-0" />
                <span className="text-xs text-[#43474c] truncate">{draftContact.email}</span>
              </div>
            </div>
          </section>

          {/* 4. Additional Notes (Optional) */}
          <section className="bg-white border border-[#e0e3e5] rounded-xl p-4 shadow-2xs">
            <label className="block font-heading text-xs sm:text-sm font-bold text-[#181c1e] mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={draftNotes}
              onChange={e => setDraftNotes(e.target.value)}
              placeholder="Any specific requirements or questions? e.g. OEM vs Aftermarket preference, delivery urgency"
              className="w-full bg-[#f7fafc] border border-[#c3c7cd] rounded-xl p-3 text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-1 focus:ring-[#fb7800] outline-none transition-colors resize-none"
            />
          </section>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] sm:text-[11px] text-[#73777d] text-center leading-relaxed px-2 mt-4 mb-2">
          By submitting this inquiry, you agree to our terms of service and privacy policy. We will get back to you with a quote shortly.
        </p>

        {/* Sticky Bottom Send Inquiry Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-[#f7fafc]/95 backdrop-blur-md border-t border-[#e0e3e5] pb-safe">
          <div className="max-w-md mx-auto px-4 py-3 sm:py-3.5">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-[0_4px_16px_rgba(251,120,0,0.3)] flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
            >
              <Send className="w-4 h-4 fill-current" />
              {isSubmitting ? 'Sending Inquiry...' : 'SEND INQUIRY'}
            </button>
          </div>
        </div>
      </main>

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </div>
  );
};
