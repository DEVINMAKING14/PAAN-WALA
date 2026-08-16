import React from 'react';
import { Sparkles, Radio, Leaf, Flame, MessageSquare, Coffee } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface InteractiveHotspotsProps {
  onOpenPaanModal: () => void;
  onOpenRadio: () => void;
  onOpenBanter: () => void;
  onTriggerSignboardReact: () => void;
  onHoverState: (label: string, variant?: 'paan' | 'music' | 'explore' | 'default') => void;
}

export const InteractiveHotspots: React.FC<InteractiveHotspotsProps> = ({
  onOpenPaanModal,
  onOpenRadio,
  onOpenBanter,
  onTriggerSignboardReact,
  onHoverState,
}) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* 1. Main Paan Counter: "EK PAAN?" Signature Interaction matching Bold Typography theme */}
      <div
        id="hotspot-paan-counter"
        className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 group cursor-pointer pointer-events-auto"
        onMouseEnter={() => onHoverState('PAAN', 'paan')}
        onMouseLeave={() => onHoverState('')}
        onClick={() => {
          soundEngine.playPaanFoldSound();
          onOpenPaanModal();
        }}
      >
        <div className="relative px-8 sm:px-12 py-4 sm:py-5 border border-white/20 rounded-full bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#FF4E00] hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-[#FF4E00] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <div className="relative z-10 flex items-center gap-3">
            <Leaf className="h-5 w-5 text-[#FF4E00] transition-colors duration-500 group-hover:text-black" />
            <span className="text-base sm:text-xl font-bold tracking-[0.2em] uppercase text-[#F5F2ED] transition-colors duration-500 group-hover:text-black">
              Ek Paan?
            </span>
          </div>
        </div>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap text-[#F5F2ED] font-mono">
          CLICK TO PREPARE
        </div>
      </div>

      {/* 2. Top Signboard Interaction */}
      <div
        id="hotspot-signboard"
        className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
        onClick={() => {
          soundEngine.playJarTapSound();
          onTriggerSignboardReact();
        }}
        onMouseEnter={() => onHoverState('1984', 'explore')}
        onMouseLeave={() => onHoverState('')}
      >
        <div className="group rounded-xl border border-transparent hover:border-[#FF4E00]/40 bg-black/0 hover:bg-black/40 px-4 py-1.5 backdrop-blur-none hover:backdrop-blur-sm transition-all text-center">
          <span className="font-teko text-xs sm:text-sm tracking-widest text-[#F5F2ED]/80 group-hover:text-[#FF4E00] flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4E00] animate-ping" />
            वाराणसी की शान &bull; RAMESH PAAN BHANDAR
          </span>
        </div>
      </div>

      {/* 3. Masala & Saunf Glass Jars (Right side) */}
      <div
        id="hotspot-jars"
        className="absolute top-[52%] right-[16%] -translate-y-1/2 pointer-events-auto hidden md:block"
        onMouseEnter={() => onHoverState('SAUNF', 'explore')}
        onMouseLeave={() => onHoverState('')}
      >
        <button
          onClick={() => {
            soundEngine.playJarTapSound();
            onOpenPaanModal();
          }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#F5F2ED] backdrop-blur-md hover:border-[#FF4E00] hover:scale-105 transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#FF4E00] group-hover:animate-spin" />
          <span className="font-medium text-[11px] tracking-wider uppercase">मीठी सौंफ व सुपारी</span>
        </button>
      </div>

      {/* 4. Matchbox & Street Charcha (Left side) */}
      <div
        id="hotspot-charcha"
        className="absolute top-[58%] left-[12%] -translate-y-1/2 pointer-events-auto hidden md:block"
        onMouseEnter={() => onHoverState('CHARCHA', 'explore')}
        onMouseLeave={() => onHoverState('')}
      >
        <button
          onClick={() => {
            soundEngine.playMatchboxStrikeSound();
            onOpenBanter();
          }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#F5F2ED] backdrop-blur-md hover:border-[#FF4E00] hover:scale-105 transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <Coffee className="h-3.5 w-3.5 text-[#FF4E00] group-hover:animate-bounce" />
          <span className="font-medium text-[11px] tracking-wider uppercase">चाय-पान गपशप</span>
        </button>
      </div>
    </div>
  );
};
