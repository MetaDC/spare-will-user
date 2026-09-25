import React from "react";
import { Header } from "../components/Header";
import { ServiceCard } from "../components/ServiceCard";
import { SERVICES } from "../data/mockData";

export const ServicesScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc]">
      <Header />

      <main className="flex-1 px-4 pt-4 pb-28 sm:pb-32 max-w-md mx-auto w-full">
        {/* Title and Intro */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181c1e] mb-1">
            Our Services
          </h1>
          <p className="text-xs sm:text-sm text-[#43474c] leading-relaxed">
            Comprehensive automotive solutions delivered with precision and
            reliability.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
    </div>
  );
};
