import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { VehicleInfo } from '../types';
import { Car, ArrowRight } from 'lucide-react';

export const AddVehicleScreen: React.FC = () => {
  const { updateDraftVehicle, navigate, draftVehicle } = useApp();

  const [make, setMake] = useState(draftVehicle.make || '');
  const [model, setModel] = useState(
    // Strip any appended year from the stored model string
    draftVehicle.model?.replace(/\s+\d{4}$/, '') || ''
  );
  const [year, setYear] = useState(
    draftVehicle.year ? String(draftVehicle.year) : ''
  );
  const [trim, setTrim] = useState(
    draftVehicle.engineTrim === 'Standard' ? '' : draftVehicle.engineTrim || ''
  );
  const [vin, setVin] = useState(draftVehicle.vin || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newVehicle: VehicleInfo = {
      make: make.trim(),
      model: year ? `${model.trim()} ${year}` : model.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      engineTrim: trim.trim() || 'Standard',
      transmission: 'Unknown',
      vin: vin.trim() || undefined,
      image: undefined,
    };
    updateDraftVehicle(newVehicle);
    navigate('add-parts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate('home')} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Progress Bar (Step 1 of 5) */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#43474c] uppercase tracking-wider">Step 1 of 5</span>
            <span className="text-[#fb7800] font-bold">20% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#fb7800] rounded-full w-[20%] transition-all duration-300" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e] mb-2">
            Add your vehicle details
          </h1>
          <p className="text-xs text-[#73777d]">
            Tell us about your vehicle so we can find the right parts for you.
          </p>
        </div>

        {/* Icon Banner */}
        <div className="mb-6 flex items-center gap-3 bg-[#fff7f0] border border-[#fb7800]/20 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-lg bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#994700] font-medium leading-snug">
            Accurate vehicle info helps us match the exact compatible parts for your inquiry.
          </p>
        </div>

        {/* Form */}
        <form id="vehicle-form" onSubmit={handleSave} className="flex flex-col flex-1 space-y-4">
          {/* Make / Brand */}
          <div>
            <label className="text-xs font-semibold text-[#43474c] block mb-1.5">
              Make / Brand
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Toyota, Honda, BMW, Ford"
              value={make}
              onChange={e => setMake(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
            />
          </div>

          {/* Model Name */}
          <div>
            <label className="text-xs font-semibold text-[#43474c] block mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              placeholder="e.g. Corolla, Civic, Mustang"
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
            />
          </div>

          {/* Year + Engine/Trim */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#43474c] block mb-1.5">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 2}
                placeholder="2022"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#43474c] block mb-1.5">Engine / Trim</label>
              <input
                type="text"
                placeholder="1.8L LE / Automatic"
                value={trim}
                onChange={e => setTrim(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* VIN */}
          <div>
            <label className="text-xs font-semibold text-[#43474c] block mb-1.5">
              VIN / Chassis No{' '}
              <span className="text-[#73777d] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="17-character VIN number"
              value={vin}
              onChange={e => setVin(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all font-mono"
            />
            <p className="text-[10px] text-[#73777d] mt-1.5 ml-0.5">
              Providing a VIN ensures precise part matching across all trims.
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />
        </form>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-[#f7fafc]/95 backdrop-blur-md border-t border-[#e0e3e5] pb-safe">
        <div className="max-w-md mx-auto px-4 py-3 sm:py-3.5">
          <button
            type="submit"
            form="vehicle-form"
            className="w-full h-12 rounded-xl font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] bg-[#fb7800] hover:bg-[#e06c00] text-white shadow-[0_4px_16px_rgba(251,120,0,0.3)] cursor-pointer"
          >
            <span>Next — What parts do you need?</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
