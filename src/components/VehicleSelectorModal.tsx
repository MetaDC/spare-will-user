import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleInfo } from '../types';
import { Car, X } from 'lucide-react';

interface VehicleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleSelectorModal: React.FC<VehicleSelectorModalProps> = ({ isOpen, onClose }) => {
  const { updateDraftVehicle } = useApp();
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customYear, setCustomYear] = useState('');
  const [customTrim, setCustomTrim] = useState('');
  const [customVin, setCustomVin] = useState('');

  if (!isOpen) return null;

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMake || !customModel) return;
    const newVeh: VehicleInfo = {
      make: customMake.trim(),
      model: `${customModel.trim()} ${customYear}`,
      year: parseInt(customYear) || new Date().getFullYear(),
      engineTrim: customTrim.trim() || 'Standard',
      transmission: 'Unknown',
      vin: customVin.trim() || undefined,
      image: undefined
    };
    updateDraftVehicle(newVeh);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#e0e3e5] max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-[#e0e3e5]">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#fb7800]" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#181c1e]">
              Add Vehicle Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#43474c] hover:bg-[#e0e3e5] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 sm:py-4 overflow-y-auto flex-1 space-y-4">
            <form onSubmit={handleSaveCustom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#43474c] block mb-1">Make / Brand</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota, Honda, BMW, Ford"
                  value={customMake}
                  onChange={e => setCustomMake(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm focus:border-[#fb7800] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#43474c] block mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corolla, Civic, Mustang"
                  value={customModel}
                  onChange={e => setCustomModel(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm focus:border-[#fb7800] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#43474c] block mb-1">Year</label>
                  <input
                    type="number"
                    placeholder="2022"
                    value={customYear}
                    onChange={e => setCustomYear(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm focus:border-[#fb7800] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#43474c] block mb-1">Engine / Trim</label>
                  <input
                    type="text"
                    placeholder="1.8L LE / Automatic"
                    value={customTrim}
                    onChange={e => setCustomTrim(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm focus:border-[#fb7800] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#43474c] block mb-1">VIN / Chassis No (Optional)</label>
                <input
                  type="text"
                  placeholder="17-character VIN number"
                  value={customVin}
                  onChange={e => setCustomVin(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f7fafc] border border-[#c3c7cd] rounded-xl text-xs sm:text-sm focus:border-[#fb7800] outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 bg-[#f1f4f6] text-[#43474c] font-heading font-semibold text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-sm cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};
