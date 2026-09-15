import React from 'react';
import { PartItem } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface PartRowProps {
  part: PartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onDelete: (id: string) => void;
}

export const PartRow: React.FC<PartRowProps> = ({ part, onUpdateQuantity, onDelete }) => {
  return (
    <div className="bg-[#ffffff] border border-[#e0e3e5] rounded-xl p-4 shadow-2xs flex items-center justify-between gap-3 transition-all hover:border-[#c3c7cd]">
      {/* Left info */}
      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
        <h4 className="font-heading text-sm font-bold text-[#181c1e] truncate">
          {part.name}
        </h4>
        {part.spec && (
          <p className="text-[11px] sm:text-xs text-[#73777d] truncate mt-0.5">
            {part.spec}
          </p>
        )}
      </div>

      {/* Right controls: Quantity Counter + Delete */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Compact Quantity Stepper */}
        <div className="flex items-center bg-[#f1f4f6] border border-[#e0e3e5] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity(part.id, part.quantity - 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[#43474c] hover:bg-[#ffffff] active:scale-95 transition-all cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-7 sm:w-8 text-center font-heading text-xs sm:text-sm font-bold text-[#181c1e]">
            {part.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(part.id, part.quantity + 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[#43474c] hover:bg-[#ffffff] active:scale-95 transition-all cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(part.id)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#73777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 active:scale-95 transition-colors cursor-pointer"
          aria-label="Delete part"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
