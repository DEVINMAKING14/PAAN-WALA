import React, { useState } from 'react';
import { MessageSquareQuote, X, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { STREET_BANTER } from '../data/playlist';
import { soundEngine } from '../services/soundEngine';

interface StreetBanterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreetBanterDrawer: React.FC<StreetBanterDrawerProps> = ({ isOpen, onClose }) => {
  const [index, setIndex] = useState(0);

  if (!isOpen) return null;

  const currentQuote = STREET_BANTER[index];

  const handleNextBanter = () => {
    soundEngine.playMatchboxStrikeSound();
    setIndex((prev) => (prev + 1) % STREET_BANTER.length);
  };

  return (
    <div
      id="street-banter-drawer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0A0502]/95 p-6 text-[#F5F2ED] shadow-[0_0_50px_rgba(0,0,0,0.95)]">
        <button
          onClick={() => {
            soundEngine.playSubtleClick();
            onClose();
          }}
          className="absolute top-4 right-4 rounded-full border border-white/10 p-2 text-neutral-400 hover:text-[#FF4E00] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-[#FF4E00] mb-3">
          <MessageSquareQuote className="h-5 w-5" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold">
            चाय-पान चर्चा &bull; STREET PHILOSOPHY
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="font-sign text-lg sm:text-xl text-[#F5F2ED] leading-relaxed">
            "{currentQuote.hindi}"
          </p>
          <p className="mt-3 text-xs sm:text-sm text-[#8E9299] italic font-serif-display text-base">
            {currentQuote.english}
          </p>
          <p className="mt-4 text-[10px] font-mono uppercase text-[#FF4E00] tracking-widest font-semibold">
            — {currentQuote.author}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-[#8E9299] uppercase tracking-wider font-mono">
            Kiosk Wisdom #{index + 1} of {STREET_BANTER.length}
          </span>

          <button
            onClick={handleNextBanter}
            className="flex items-center gap-1.5 rounded-full bg-[#FF4E00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#ff7e40] transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="h-3 w-3" />
            <span>अगली बात &bull; Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};
