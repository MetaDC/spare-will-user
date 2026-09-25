import React from "react";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { CheckCircle2, Home, ListFilter } from "lucide-react";

export const InquirySentScreen: React.FC = () => {
  const { activeInquiry, navigate, resetDraft } = useApp();

  const handleViewInquiry = () => {
    resetDraft();
    if (activeInquiry) {
      navigate("inquiry-details", { inquiryId: activeInquiry.id });
    } else {
      navigate("inquiries");
    }
  };

  const handleBackHome = () => {
    resetDraft();
    navigate("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-24 pb-safe">
      <Header />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-8 max-w-md mx-auto w-full text-center">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ffdad6]/60 rounded-full flex items-center justify-center mb-6 shadow-[0_6px_20px_rgba(251,120,0,0.2)]">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#fb7800] stroke-[2.2]" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181c1e] mb-2">
          Inquiry Sent!
        </h1>
        <p className="text-xs sm:text-sm text-[#43474c] max-w-[280px] mx-auto mb-6 leading-relaxed">
          We received your spare-parts request. Our technical team is checking
          inventory and will contact you shortly.
        </p>

        {/* Inquiry Card */}
        <div className="bg-white border border-[#e0e3e5] rounded-2xl p-4 w-full max-w-[320px] mb-8 shadow-2xs text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#73777d] uppercase tracking-wider">
              Inquiry ID
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
              {activeInquiry?.inquireId ||
                (activeInquiry as any)?.InquireID ||
                activeInquiry?.id ||
                ""}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-[#f1f4f6]">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#73777d] uppercase tracking-wider">
              Status
            </span>
            <div className="flex items-center gap-1.5 bg-[#ffdbc8]/60 text-[#753400] px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#fb7800] animate-pulse" />
              <span>Pending Review</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[320px] space-y-4">
          <button
            onClick={handleViewInquiry}
            className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(251,120,0,0.25)] flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
            View Inquiry
          </button>

          <button
            onClick={handleBackHome}
            className="w-full h-12 border-2 border-[#021d30] hover:bg-[#021d30]/5 text-[#021d30] font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};
