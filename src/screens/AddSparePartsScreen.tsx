import React, { useState } from 'react';
import { Header } from '../components/Header';
import { PartRow } from '../components/PartRow';
import { useApp } from '../context/AppContext';
import { ArrowRight, Plus, Search, Package } from 'lucide-react';

export const AddSparePartsScreen: React.FC = () => {
  const {
    draftParts,
    addDraftPart,
    removeDraftPart,
    updateDraftPartQuantity,
    navigate,
    partSearchQuery,
    setPartSearchQuery,
    showToast,
    inventory
  } = useApp();

  const [inputVal, setInputVal] = useState(partSearchQuery || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter inventory based on what the user is typing
  const suggestions = inputVal.trim().length >= 1
    ? inventory.filter(part =>
        part.name.toLowerCase().includes(inputVal.toLowerCase()) ||
        part.partNumber?.toLowerCase().includes(inputVal.toLowerCase()) ||
        part.brand?.toLowerCase().includes(inputVal.toLowerCase()) ||
        part.category?.toLowerCase().includes(inputVal.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleAddFromInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addDraftPart(inputVal.trim(), 'Custom Specification');
    setInputVal('');
    setPartSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (part: typeof inventory[0]) => {
    const spec = [part.brand, part.category, part.partNumber].filter(Boolean).join(' · ') || 'Standard Fitment';
    addDraftPart(part.name, spec);
    setInputVal('');
    setPartSearchQuery('');
    setShowSuggestions(false);
  };

  const handleNext = () => {
    if (draftParts.length === 0) {
      showToast('Please add at least one spare part to continue', 'error');
      return;
    }
    navigate('contact-details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate('add-vehicle')} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Progress Bar (Step 2 of 5) */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#43474c] uppercase tracking-wider">Step 2 of 5</span>
            <span className="text-[#fb7800] font-bold">40% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#fb7800] rounded-full w-[40%] transition-all duration-300" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e] mb-2">
            What parts do you need?
          </h1>
          <p className="text-xs text-[#73777d]">
            Add items to receive an accurate quote and availability update.
          </p>
        </div>

        {/* Search & Add Input Field */}
        <div className="mb-6 relative">
          <form onSubmit={handleAddFromInput}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#73777d] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={inputVal}
                onChange={e => {
                  setInputVal(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search or type a spare part name..."
                className="w-full h-12 pl-10 pr-20 bg-white border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
              />
              {inputVal.trim() && (
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 bg-[#fb7800] text-white font-heading font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              )}
            </div>
          </form>

          {/* Live Inventory Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white border border-[#e0e3e5] rounded-xl shadow-lg overflow-hidden">
              <p className="text-[10px] font-semibold text-[#73777d] uppercase tracking-wider px-3 pt-2.5 pb-1">
                From Inventory
              </p>
              {suggestions.map(part => (
                <button
                  key={part.id}
                  type="button"
                  onMouseDown={() => handleSelectSuggestion(part)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff7f0] active:bg-[#fff0e0] transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#181c1e] truncate">{part.name}</p>
                    <p className="text-[10px] text-[#73777d] truncate">
                      {[part.brand, part.category, part.partNumber].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {part.status && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      part.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {part.status === 'active' ? 'In Stock' : part.status}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Parts List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xs sm:text-sm font-bold text-[#181c1e]">
            Requested Parts ({draftParts.length})
          </h2>
          {draftParts.length > 0 && (
            <span className="text-[11px] sm:text-xs text-[#73777d]">
              {draftParts.reduce((acc, p) => acc + p.quantity, 0)} total units
            </span>
          )}
        </div>

        {/* Compact Parts List */}
        <div className="space-y-4 flex-1">
          {draftParts.length > 0 ? (
            draftParts.map(part => (
              <PartRow
                key={part.id}
                part={part}
                onUpdateQuantity={updateDraftPartQuantity}
                onDelete={removeDraftPart}
              />
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-[#e0e3e5] rounded-2xl p-6 sm:p-8 text-center my-3 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#73777d] mb-2">
                <Search className="w-5 h-5" />
              </div>
              <p className="font-heading font-bold text-sm text-[#181c1e]">No parts added yet</p>
              <p className="text-xs text-[#73777d] max-w-[220px] mt-1">
                Search from our catalog or type any part name to start your inquiry.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Fixed Bottom Next Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-[#f7fafc]/95 backdrop-blur-md border-t border-[#e0e3e5] pb-safe">
          <div className="max-w-md mx-auto px-4 py-3 sm:py-3.5">
            <button
              onClick={handleNext}
              disabled={draftParts.length === 0}
              className={`w-full h-12 rounded-xl font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer ${
                draftParts.length > 0
                  ? 'bg-[#fb7800] hover:bg-[#e06c00] text-white shadow-[0_4px_16px_rgba(251,120,0,0.3)]'
                  : 'bg-[#c3c7cd] text-white/80 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};
