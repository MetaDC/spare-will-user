import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { PartRow } from "../components/PartRow";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  Plus,
  Search,
  Package,
  Loader2,
  Layers,
} from "lucide-react";
import {
  searchPartsAndCategories,
  PartSearchResult,
} from "../services/partCatalogService";
import { PartSubcategory } from "../models/part";

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
  } = useApp();

  const [inputVal, setInputVal] = useState(partSearchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<PartSearchResult>({
    subcategories: [],
    matchedCategories: [],
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search for PartSubcategories & matched Categories
  useEffect(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setSearchResult({ subcategories: [], matchedCategories: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await searchPartsAndCategories(trimmed, 12);
        setSearchResult(res);
      } catch (e) {
        console.warn("Part search failed:", e);
      } finally {
        setIsLoading(false);
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputVal]);

  const handleAddFromInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addDraftPart(inputVal.trim(), "Custom Specification");
    setInputVal("");
    setPartSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSelectSubcategory = (subcat: PartSubcategory) => {
    const spec = subcat.categoryName
      ? `${subcat.categoryName}`
      : "Standard Fitment";
    addDraftPart(subcat.name, spec, {
      subcategoryId: subcat.id,
      categoryId: subcat.categoryId,
      categoryName: subcat.categoryName,
    });
    setInputVal("");
    setPartSearchQuery("");
    setShowSuggestions(false);
  };

  const handleNext = () => {
    if (draftParts.length === 0) {
      showToast("Please add at least one spare part to continue", "error");
      return;
    }
    navigate("contact-details");
  };

  const hasSuggestions = searchResult.subcategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate("add-vehicle")} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Progress Bar (Step 2 of 5) */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#43474c] uppercase tracking-wider">
              Step 2 of 5
            </span>
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
            Search by part or category (e.g. Brake Pad, Air Conditioner) to add
            items.
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
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search part or category (e.g., Brake, AC, Filter)..."
                className="w-full h-12 pl-10 pr-24 bg-white border border-[#c3c7cd] rounded-xl text-xs sm:text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-[#fb7800] animate-spin shrink-0" />
                )}
                {inputVal.trim() && (
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Live Catalog Suggestions Dropdown */}
          {showSuggestions && inputVal.trim().length >= 1 && (
            <div className="absolute top-full left-0 right-0 z-40 mt-1.5 bg-white border border-[#e0e3e5] rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
              {/* Category banner if a category was matched */}
              {searchResult.matchedCategories.length > 0 && (
                <div className="bg-[#fff7f0] border-b border-[#ffe8d6] px-3 py-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#fb7800] shrink-0" />
                  <p className="text-[11px] font-semibold text-[#8a3c00] truncate">
                    Category:{" "}
                    <span className="font-bold">
                      {searchResult.matchedCategories
                        .map((c) => c.name)
                        .join(", ")}
                    </span>
                  </p>
                </div>
              )}

              {/* Subcategories list */}
              {hasSuggestions ? (
                <>
                  <p className="text-[10px] font-semibold text-[#73777d] uppercase tracking-wider px-3 pt-2.5 pb-1">
                    {searchResult.matchedCategories.length > 0
                      ? "Parts in this Category"
                      : "Catalog Parts"}
                  </p>
                  {searchResult.subcategories.map((subcat) => (
                    <button
                      key={subcat.id}
                      type="button"
                      onMouseDown={() => handleSelectSubcategory(subcat)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff7f0] active:bg-[#fff0e0] transition-colors text-left border-b border-[#f1f4f6] last:border-b-0"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#181c1e] truncate">
                          {subcat.name}
                        </p>
                        {subcat.categoryName && (
                          <p className="text-[10px] text-[#73777d] truncate">
                            {subcat.categoryName}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#fb7800] bg-[#fb7800]/10 px-2 py-0.5 rounded-md shrink-0">
                        + Add
                      </span>
                    </button>
                  ))}
                </>
              ) : !isLoading ? (
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-[#181c1e]">
                    No catalog parts found
                  </p>
                  <p className="text-[11px] text-[#73777d] mt-0.5">
                    Click <strong>Add</strong> or press Enter to add &ldquo;
                    {inputVal.trim()}&rdquo; as a custom request.
                  </p>
                </div>
              ) : null}
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
        <div className="space-y-3 flex-1">
          {draftParts.length > 0 ? (
            draftParts.map((part) => (
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
              <p className="font-heading font-bold text-sm text-[#181c1e]">
                No parts added yet
              </p>
              <p className="text-xs text-[#73777d] max-w-[220px] mt-1">
                Search from our catalog or type any part name to start your
                inquiry.
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
                  ? "bg-[#fb7800] hover:bg-[#e06c00] text-white shadow-[0_4px_16px_rgba(251,120,0,0.3)]"
                  : "bg-[#c3c7cd] text-white/80 cursor-not-allowed"
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
