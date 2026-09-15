import React from 'react';
import { Header } from '../components/Header';
import { ServiceCard } from '../components/ServiceCard';
import { FloatingPartSearch } from '../components/FloatingPartSearch';
import { SERVICES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-24">
      <Header />

      <main className="flex-1 px-4 pt-3 sm:pt-4 max-w-md mx-auto w-full">
        {/* Headline & Subtitle Section */}
        <section className="pt-4 pb-6 text-center">
          <h1 className="font-heading text-2xl sm:text-[28px] font-black text-[#181c1e] tracking-tight leading-tight mb-4 max-w-[320px] sm:max-w-none mx-auto">
            All Auto Solutions Under One Roof
          </h1>
          <p className="text-sm sm:text-[15px] text-[#43474c] leading-relaxed max-w-[280px] sm:max-w-[310px] mx-auto">
            Whatever your vehicle needs, Spare Will is here to help.
          </p>
        </section>

        {/* Services Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#181c1e]">
              Our Services
            </h2>
            <button
              onClick={() => navigate('services')}
              className="text-xs font-semibold text-[#fb7800] hover:text-[#994700] flex items-center gap-1 cursor-pointer py-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Spare-Part Search */}
      <FloatingPartSearch />
    </div>
  );
};
