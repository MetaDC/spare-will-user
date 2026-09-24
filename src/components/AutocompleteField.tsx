import React, { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Search, Check, Loader2 } from 'lucide-react';

export interface AutocompleteSuggestion {
  id: string;   // '' = custom (not from DB)
  name: string;
  meta?: string;
  isCustom?: boolean;
}

interface AutocompleteFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** Called when user explicitly clicks a suggestion from the list */
  onSelect: (item: AutocompleteSuggestion) => void;
  /**
   * Called when the input loses focus WITHOUT an explicit selection.
   * Receives the typed text and the best DB match (exact case-insensitive name
   * match, or first result if typed text matches it exactly).
   * The parent decides whether to treat it as DB or custom.
   */
  onBlurCommit?: (typed: string, exactMatch: AutocompleteSuggestion | null) => void;
  suggestions: AutocompleteSuggestion[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  onBlurCommit,
  suggestions,
  loading = false,
  disabled = false,
  required = false,
  autoFocus = false,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  // Track whether the user made an explicit selection (click / Enter / ArrowKey+Enter)
  const explicitlySelected = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside → triggers auto-commit
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIdx(-1);
  }, [suggestions]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (open && suggestions.length > 0) {
        setActiveIdx(prev => Math.min(prev + 1, suggestions.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActiveIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && activeIdx >= 0 && suggestions[activeIdx]) {
        handleSelect(suggestions[activeIdx]);
      } else if (open && suggestions.length === 1) {
        // Only 1 result and user hits Enter → select it
        handleSelect(suggestions[0]);
      } else {
        // No dropdown selection → commit whatever is typed
        commitBlur();
      }
    } else if (e.key === 'Tab' || e.key === 'Escape') {
      setOpen(false);
      commitBlur();
    }
  };

  /** Find exact case-insensitive match among current suggestions */
  const findExactMatch = (typed: string): AutocompleteSuggestion | null => {
    const lower = typed.trim().toLowerCase();
    return suggestions.find(s => s.name.toLowerCase() === lower) ?? null;
  };

  /** Commit the current typed value on blur without an explicit pick */
  const commitBlur = () => {
    if (!onBlurCommit || !value.trim()) return;
    if (explicitlySelected.current) {
      explicitlySelected.current = false;
      return;
    }
    const exact = findExactMatch(value);
    onBlurCommit(value.trim(), exact);
  };

  const handleSelect = (item: AutocompleteSuggestion) => {
    explicitlySelected.current = true;
    onSelect(item);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleInputBlur = () => {
    // Small delay so onMouseDown on list items fires first
    setTimeout(() => {
      setOpen(false);
      commitBlur();
    }, 150);
  };

  const showDropdown = open && value.trim().length >= 1 && (loading || suggestions.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="text-xs font-semibold text-[#43474c] block mb-1.5">
        {label}
        {required && <span className="text-[#fb7800] ml-0.5">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#73777d] absolute left-3.5 pointer-events-none z-10" />
        <input
          id={id}
          type="text"
          autoFocus={autoFocus}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={e => {
            explicitlySelected.current = false;
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => value.trim().length >= 1 && setOpen(true)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] outline-none shadow-2xs transition-all ${
            disabled
              ? 'border-[#e0e3e5] bg-[#f7fafc] text-[#73777d] cursor-not-allowed'
              : 'border-[#c3c7cd] focus:border-[#fb7800] focus:ring-2 focus:ring-[#fb7800]/20'
          }`}
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-[#fb7800] absolute right-3.5 animate-spin" />
        )}
      </div>

      {/* Dropdown — only DB results, no custom entry */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#e0e3e5] rounded-xl shadow-xl overflow-hidden">
          {loading && suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[#73777d] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#fb7800]" />
              Searching…
            </div>
          ) : (
            <ul role="listbox" className="max-h-56 overflow-y-auto divide-y divide-[#f1f4f6]">
              {suggestions.map((item, idx) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={idx === activeIdx}
                  onMouseDown={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors ${
                    idx === activeIdx ? 'bg-[#fff7f0]' : 'hover:bg-[#f7fafc]'
                  }`}
                >
                  {/* Icon */}
                  <div className="w-7 h-7 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#181c1e] truncate">{item.name}</p>
                    {item.meta && (
                      <p className="text-[10px] text-[#73777d] truncate">{item.meta}</p>
                    )}
                  </div>

                  {/* DB badge */}
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                    DB
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
