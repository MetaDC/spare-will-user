import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import {
  AutocompleteField,
  AutocompleteSuggestion,
} from "../components/AutocompleteField";
import { useApp } from "../context/AppContext";
import { VehicleInfo } from "../types";
import {
  VehicleBrand,
  VehicleModel,
  VehicleVariant,
  FuelType,
  TransmissionType,
} from "../models/vehicle";
import {
  searchBrands,
  searchModels,
  getVariantsByModel,
} from "../services/vehicleCatalogService";
import { useDebounce } from "../hooks/useDebounce";
import {
  Car,
  ArrowRight,
  Zap,
  Fuel,
  Settings2,
  ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SelectedEntry {
  id: string; // '' = custom (not from DB)
  name: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FUEL_TYPES: FuelType[] = [
  "Petrol",
  "Diesel",
  "CNG",
  "Electric",
  "Hybrid",
  "Other",
];
const TRANSMISSION_TYPES: TransmissionType[] = [
  "Manual",
  "Automatic",
  "AMT",
  "CVT",
  "DCT",
  "Other",
];

function fuelIcon(fuel: FuelType) {
  if (fuel === "Electric") return "⚡";
  if (fuel === "Hybrid") return "🔋";
  if (fuel === "CNG") return "💨";
  return "⛽";
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AddVehicleScreen: React.FC = () => {
  const { updateDraftVehicle, navigate, draftVehicle, showToast } = useApp();

  // ── Brand state ─────────────────────────────────────────────────────────
  const [brandQuery, setBrandQuery] = useState(draftVehicle.make || "");
  const [brandSuggestions, setBrandSuggestions] = useState<VehicleBrand[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SelectedEntry | null>(
    draftVehicle.make ? { id: "", name: draftVehicle.make } : null,
  );

  // ── Model state ──────────────────────────────────────────────────────────
  const [modelQuery, setModelQuery] = useState("");
  const [modelSuggestions, setModelSuggestions] = useState<VehicleModel[]>([]);
  const [modelLoading, setModelLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<SelectedEntry | null>(
    null,
  );

  // ── Variant state ────────────────────────────────────────────────────────
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(
    null,
  );
  const [variantsChecked, setVariantsChecked] = useState(false); // has fetch completed?
  const [showCustomFields, setShowCustomFields] = useState(false); // toggled by + button

  // ── Custom variant fields ────────────────────────────────────────────────
  const [customEngine, setCustomEngine] = useState("");
  const [customFuelType, setCustomFuelType] = useState<FuelType | "">("");
  const [customTransmission, setCustomTransmission] = useState<
    TransmissionType | ""
  >("");

  // ── Year ─────────────────────────────────────────────────────────────────
  const [year, setYear] = useState(
    draftVehicle.year ? String(draftVehicle.year) : "",
  );

  // ─── Derived helpers ─────────────────────────────────────────────────────
  const showVariantSection = selectedModel !== null;
  const showCustomVariant =
    variantsChecked && variants.length === 0 && selectedModel !== null;
  const currentYear = new Date().getFullYear();

  // ─── Debounced queries ───────────────────────────────────────────────────
  const debouncedBrandQuery = useDebounce(brandQuery, 600);
  const debouncedModelQuery = useDebounce(modelQuery, 600);

  // ── Fetch brand suggestions ───────────────────────────────────────────────
  useEffect(() => {
    if (debouncedBrandQuery.trim().length < 1) {
      setBrandSuggestions([]);
      return;
    }
    let cancelled = false;
    setBrandLoading(true);
    searchBrands(debouncedBrandQuery).then((results) => {
      if (!cancelled) {
        setBrandSuggestions(results);
        setBrandLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedBrandQuery]);

  // ── Fetch model suggestions ───────────────────────────────────────────────
  useEffect(() => {
    if (debouncedModelQuery.trim().length < 1) {
      setModelSuggestions([]);
      return;
    }
    let cancelled = false;
    setModelLoading(true);
    searchModels(debouncedModelQuery, selectedBrand?.id || undefined).then(
      (results) => {
        if (!cancelled) {
          setModelSuggestions(results);
          setModelLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [debouncedModelQuery, selectedBrand?.id]);

  // ── Fetch variants when a DB model is selected ────────────────────────────
  const fetchVariants = useCallback(async (modelId: string) => {
    setVariants([]);
    setSelectedVariant(null);
    setVariantsChecked(false);
    setVariantsLoading(true);
    try {
      const results = await getVariantsByModel(modelId);
      setVariants(results);
      setVariantsChecked(true);
    } catch {
      setVariantsChecked(true);
    } finally {
      setVariantsLoading(false);
    }
  }, []);

  // ─── Event Handlers ───────────────────────────────────────────────────────

  const handleBrandSelect = (item: AutocompleteSuggestion) => {
    const entry: SelectedEntry = { id: item.id, name: item.name };
    setSelectedBrand(entry);
    setBrandQuery(item.name);
    setBrandSuggestions([]);
    // Reset model + variant cascade
    setModelQuery("");
    setSelectedModel(null);
    setModelSuggestions([]);
    setVariants([]);
    setSelectedVariant(null);
    setVariantsChecked(false);
    setShowCustomFields(false);
    setCustomEngine("");
    setCustomFuelType("");
    setCustomTransmission("");
  };

  /**
   * Auto-commit for brand field when user moves away without explicitly
   * selecting from the dropdown.
   * - exactMatch found → treat as DB brand
   * - no match → treat as custom (whatever was typed)
   */
  const handleBrandBlurCommit = (
    typed: string,
    exactMatch: AutocompleteSuggestion | null,
  ) => {
    if (!typed) return;
    // If already committed (selectedBrand matches typed), do nothing
    if (selectedBrand && selectedBrand.name === typed) return;
    const item: AutocompleteSuggestion = exactMatch ?? { id: "", name: typed };
    handleBrandSelect(item);
  };

  const handleBrandChange = (val: string) => {
    setBrandQuery(val);
    // If user edits after selecting, clear selection
    if (selectedBrand && val !== selectedBrand.name) {
      setSelectedBrand(null);
      setSelectedModel(null);
      setVariants([]);
      setSelectedVariant(null);
      setVariantsChecked(false);
    }
  };

  const handleModelSelect = (item: AutocompleteSuggestion) => {
    const entry: SelectedEntry = { id: item.id, name: item.name };
    setSelectedModel(entry);
    setModelQuery(item.name);
    setModelSuggestions([]);
    setSelectedVariant(null);
    setVariantsChecked(false);
    setShowCustomFields(false);
    setCustomEngine("");
    setCustomFuelType("");
    setCustomTransmission("");

    if (item.id) {
      fetchVariants(item.id);
    } else {
      setVariantsChecked(true);
      setShowCustomFields(true);
    }
  };

  /**
   * Auto-commit for model field when user moves away without explicitly
   * selecting from the dropdown.
   */
  const handleModelBlurCommit = (
    typed: string,
    exactMatch: AutocompleteSuggestion | null,
  ) => {
    if (!typed) return;
    if (selectedModel && selectedModel.name === typed) return;
    const item: AutocompleteSuggestion = exactMatch ?? { id: "", name: typed };
    handleModelSelect(item);
  };

  const handleModelChange = (val: string) => {
    setModelQuery(val);
    if (selectedModel && val !== selectedModel.name) {
      setSelectedModel(null);
      setVariants([]);
      setSelectedVariant(null);
      setVariantsChecked(false);
    }
  };

  const handleVariantSelect = (variant: VehicleVariant) => {
    setSelectedVariant((prev) => (prev?.id === variant.id ? null : variant));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-commit brand/model if user submits without blurring
    const effectiveBrand = brandQuery.trim();
    const effectiveModel = modelQuery.trim();

    if (!effectiveBrand) {
      showToast("Please enter the vehicle make / brand", "error");
      return;
    }
    if (!effectiveModel) {
      showToast("Please enter the vehicle model name", "error");
      return;
    }

    // Build engineTrim string from variant or custom fields (both optional)
    let engineTrim = "";
    let transmission = "Unknown";

    if (selectedVariant) {
      engineTrim = [selectedVariant.name, selectedVariant.engine]
        .filter(Boolean)
        .join(" · ");
      transmission = selectedVariant.transmission;
    } else if (
      showCustomFields &&
      (customEngine || customFuelType || customTransmission)
    ) {
      const parts = [customEngine, customFuelType, customTransmission].filter(
        Boolean,
      );
      engineTrim = parts.join(" · ");
      transmission = customTransmission || "Unknown";
    }

    const vehicle: VehicleInfo = {
      brandId: selectedBrand?.id || undefined,
      brandName: effectiveBrand,
      make: effectiveBrand,
      modelId: selectedModel?.id || undefined,
      modelName: effectiveModel,
      model: effectiveModel,
      variantId: selectedVariant?.id || undefined,
      variantName: selectedVariant?.name || undefined,
      fuelType: selectedVariant?.fuelType || customFuelType || undefined,
      engine: selectedVariant?.engine || customEngine || undefined,
      engineCode: selectedVariant?.engineCode || undefined,
      transmission,
      year: year && parseInt(year) ? parseInt(year) : undefined,
      engineTrim: engineTrim || "Standard",
      vin: undefined,
      image: undefined,
    };

    updateDraftVehicle(vehicle);
    navigate("add-parts");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] pb-32">
      <Header showBack onBack={() => navigate("home")} />

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full flex flex-col">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#43474c] uppercase tracking-wider">
              Step 1 of 5
            </span>
            <span className="text-[#fb7800] font-bold">20% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#fb7800] rounded-full w-[20%] transition-all duration-300" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#181c1e] mb-1.5">
            Add your vehicle details
          </h1>
          <p className="text-xs text-[#73777d]">
            Tell us about your vehicle so we can find the right parts for you.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-5 flex items-center gap-3 bg-[#fff7f0] border border-[#fb7800]/20 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-lg bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#994700] font-medium leading-snug">
            Accurate vehicle info helps us match the exact compatible parts for
            your inquiry.
          </p>
        </div>

        <form
          id="vehicle-form"
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 space-y-5"
        >
          {/* ── Brand / Make ─────────────────────────────────────────── */}
          <AutocompleteField
            id="vehicle-brand"
            label="Make / Brand"
            placeholder="e.g. Toyota, Honda, BMW…"
            value={brandQuery}
            onChange={handleBrandChange}
            onSelect={handleBrandSelect}
            onBlurCommit={handleBrandBlurCommit}
            suggestions={brandSuggestions.map((b) => ({
              id: b.id,
              name: b.name,
              meta: b.vehicleCategoryName,
            }))}
            loading={brandLoading}
            required
            autoFocus
          />

          {/* ── Model Name ───────────────────────────────────────────── */}
          <AutocompleteField
            id="vehicle-model"
            label="Model Name"
            placeholder={
              selectedBrand
                ? `Search ${selectedBrand.name} models…`
                : "e.g. Corolla, Civic, Mustang…"
            }
            value={modelQuery}
            onChange={handleModelChange}
            onSelect={handleModelSelect}
            onBlurCommit={handleModelBlurCommit}
            suggestions={modelSuggestions.map((m) => ({
              id: m.id,
              name: m.name,
              meta: m.vehicleBrandName,
            }))}
            loading={modelLoading}
            disabled={!brandQuery.trim()}
            required
          />

          {/* ── Year — always visible, optional ──────────────────────── */}
          <div>
            <label
              htmlFor="vehicle-year"
              className="text-xs font-semibold text-[#43474c] block mb-1.5"
            >
              Year{" "}
              <span className="text-[#73777d] font-normal">(Optional)</span>
            </label>
            <input
              id="vehicle-year"
              type="number"
              min="1900"
              max={currentYear + 2}
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c3c7cd] rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none shadow-2xs transition-all"
            />
            {selectedVariant && selectedVariant.yearFrom && (
              <p className="text-[10px] text-[#73777d] mt-1.5">
                Variant model years: {selectedVariant.yearFrom}–
                {selectedVariant.yearTo}
              </p>
            )}
          </div>

          {/* ── Year moved: now above — removed from here */}

          {showVariantSection && (
            <div>
              {/* Header row with label + count + + button */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#43474c]">
                  Variant{" "}
                  <span className="text-[#73777d] font-normal">(Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  {variantsChecked && variants.length > 0 && (
                    <span className="text-[10px] text-[#73777d]">
                      {variants.length} variant
                      {variants.length !== 1 ? "s" : ""} found
                    </span>
                  )}
                  {/* + button — always visible once model is selected */}
                  <button
                    type="button"
                    onClick={() => setShowCustomFields((p) => !p)}
                    title={
                      showCustomFields ? "Hide custom fields" : "Add manually"
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ${
                      showCustomFields
                        ? "bg-[#fb7800] text-white border-[#fb7800]"
                        : "bg-white text-[#fb7800] border-[#fb7800] hover:bg-[#fff7f0]"
                    }`}
                  >
                    {showCustomFields ? "×" : "+"}
                  </button>
                </div>
              </div>

              {/* Custom fields — toggled by + button, shown at TOP */}
              {showCustomFields && (
                <div className="bg-[#fff7f0] border border-[#fb7800]/30 rounded-xl p-4 space-y-3 mb-3">
                  <p className="text-[10px] text-[#994700] font-semibold uppercase tracking-wider">
                    Custom Variant
                  </p>
                  {/* Engine */}
                  <div>
                    <label className="text-xs font-semibold text-[#43474c] block mb-1">
                      Engine
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1.8L, 2.0 Turbo"
                      value={customEngine}
                      onChange={(e) => setCustomEngine(e.target.value)}
                      className="w-full h-10 px-3.5 bg-white border border-[#c3c7cd] rounded-lg text-xs text-[#181c1e] placeholder:text-[#73777d] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none"
                    />
                  </div>
                  {/* Fuel Type */}
                  <div>
                    <label className="text-xs font-semibold text-[#43474c] block mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={customFuelType}
                      onChange={(e) =>
                        setCustomFuelType(e.target.value as FuelType)
                      }
                      className="w-full h-10 px-3.5 bg-white border border-[#c3c7cd] rounded-lg text-xs text-[#181c1e] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none"
                    >
                      <option value="">Select fuel type</option>
                      {FUEL_TYPES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Transmission */}
                  <div>
                    <label className="text-xs font-semibold text-[#43474c] block mb-1">
                      Transmission
                    </label>
                    <select
                      value={customTransmission}
                      onChange={(e) =>
                        setCustomTransmission(
                          e.target.value as TransmissionType,
                        )
                      }
                      className="w-full h-10 px-3.5 bg-white border border-[#c3c7cd] rounded-lg text-xs text-[#181c1e] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20 outline-none"
                    >
                      <option value="">Select transmission</option>
                      {TRANSMISSION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {variantsLoading && (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="h-14 bg-[#e0e3e5] rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* DB variant cards — single column, full-width rows */}
              {!variantsLoading && variants.length > 0 && (
                <div className="space-y-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVariantSelect(v)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all active:scale-[0.99] cursor-pointer flex items-center gap-3 ${
                        selectedVariant?.id === v.id
                          ? "border-[#fb7800] bg-[#fff7f0] shadow-sm"
                          : "border-[#e0e3e5] bg-white hover:border-[#fb7800]/40 hover:bg-[#fff7f0]/40"
                      }`}
                    >
                      {/* Selection dot */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          selectedVariant?.id === v.id
                            ? "border-[#fb7800] bg-[#fb7800]"
                            : "border-[#c3c7cd]"
                        }`}
                      >
                        {selectedVariant?.id === v.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-xs text-[#181c1e] truncate">
                          {v.name}
                        </p>
                        <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-[#43474c] flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 text-[#fb7800]" />
                            {v.engine}
                          </span>
                          <span className="text-[10px] text-[#43474c] flex items-center gap-0.5">
                            <Fuel className="w-2.5 h-2.5 text-[#73777d]" />
                            {fuelIcon(v.fuelType)} {v.fuelType}
                          </span>
                          <span className="text-[10px] text-[#43474c] flex items-center gap-0.5">
                            <Settings2 className="w-2.5 h-2.5 text-[#73777d]" />
                            {v.transmission}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No variants in DB, custom fields already opened automatically */}
              {variantsChecked &&
                variants.length === 0 &&
                !showCustomFields && (
                  <p className="text-[10px] text-[#73777d] text-center py-2">
                    No variants found — use the <strong>+</strong> button to add
                    manually.
                  </p>
                )}
            </div>
          )}

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
