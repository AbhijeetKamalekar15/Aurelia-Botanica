import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#4A1525] text-[#F8EBEF] text-[11px] font-medium tracking-wider uppercase py-2 px-4 border-b border-[#360D19]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Strictly Cash on Delivery (COD) · Inspect Before You Pay</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[#C5A059]">
          <Truck className="w-3.5 h-3.5" />
          <span>Complimentary Express Delivery on Orders Over $100</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Small-Batch Artisanal Apothecary</span>
        </div>
      </div>
    </div>
  );
};
