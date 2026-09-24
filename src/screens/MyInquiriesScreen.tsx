import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { formatInquiryDate } from '../services/firebaseService';
import { Calendar, Plus, Settings, Sparkles } from 'lucide-react';

export const MyInquiriesScreen: React.FC = () => {
  const { inquiries, viewInquiry, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const filteredInquiries = inquiries.filter(inq => {
    if (activeTab === 'active') {
      return ['New', 'Reviewing', 'Price Sent', 'Customer Contacted'].includes(inq.status);
    }
    if (activeTab === 'completed') {
      return ['Completed', 'Cancelled'].includes(inq.status);
    }
    return true;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-[#ffdbc8] text-[#753400] font-semibold';
      case 'Price Sent':
        return 'bg-[#cde5ff] text-[#021d30] font-semibold';
      case 'Reviewing':
        return 'bg-[#e0e3e5] text-[#43474c] font-semibold';
      case 'Completed':
        return 'bg-[#66ff8e]/30 text-[#005322] font-semibold';
      case 'Customer Contacted':
        return 'bg-[#ffb68b]/40 text-[#592600] font-semibold';
      default:
        return 'bg-[#e0e3e5] text-[#43474c]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-24 pb-safe">
      <Header />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
        {/* Header & New Inquiry CTA */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e]">
            My Inquiries
          </h1>
          <button
            onClick={() => navigate('add-parts')}
            className="text-xs font-heading font-bold bg-[#fb7800] text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs hover:bg-[#e06c00] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Inquiry
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#ebeef0] p-1 rounded-xl mb-6 text-xs font-semibold text-[#43474c]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#181c1e] shadow-2xs font-bold'
                : 'hover:text-[#181c1e]'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-[#181c1e] shadow-2xs font-bold'
                : 'hover:text-[#181c1e]'
            }`}
          >
            Active ({inquiries.filter(i => ['New', 'Reviewing', 'Price Sent', 'Customer Contacted'].includes(i.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-[#181c1e] shadow-2xs font-bold'
                : 'hover:text-[#181c1e]'
            }`}
          >
            Completed ({inquiries.filter(i => ['Completed', 'Cancelled'].includes(i.status)).length})
          </button>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map(inquiry => {
              const totalPartsCount = inquiry.parts.reduce((acc, p) => acc + p.quantity, 0);

              return (
                <article
                  key={inquiry.id}
                  onClick={() => viewInquiry(inquiry.id)}
                  className="bg-white border border-[#e1e8ed] hover:border-[#c3c7cd] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-semibold text-[#73777d]">
                        {inquiry.id}
                      </span>
                      <h2 className="font-heading text-sm sm:text-base font-bold text-[#021d30] mt-0.5">
                        {inquiry.vehicle.make} {inquiry.vehicle.model}
                      </h2>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusBadgeStyle(
                        inquiry.status
                      )}`}
                    >
                      {inquiry.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#43474c] pt-2 border-t border-[#f1f4f6]">
                    <div className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-[#73777d]" />
                      <span>{totalPartsCount} {totalPartsCount === 1 ? 'Part' : 'Parts'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#73777d]" />
                      <span>{formatInquiryDate(inquiry.createdAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-8 text-center my-4">
              <Sparkles className="w-8 h-8 text-[#fb7800] mx-auto mb-2 opacity-60" />
              <p className="font-heading font-bold text-sm text-[#181c1e]">No inquiries found</p>
              <p className="text-xs text-[#73777d] mt-1 mb-4">
                You haven't submitted any inquiries in this category yet.
              </p>
              <button
                onClick={() => navigate('add-parts')}
                className="px-4 py-2 bg-[#fb7800] text-white font-heading font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Inquiry
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
