import React from 'react';
import { useRealtimePresence } from '../hooks/useRealtimePresence';

interface VisitorCounterProps {
  onHoverState?: (label: string, variant?: 'default' | 'link') => void;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ onHoverState }) => {
  const { visitorCount, isConnected } = useRealtimePresence();

  return (
    <div
      id="live-visitor-counter"
      onMouseEnter={() => onHoverState?.('LIVE VISITORS', 'default')}
      onMouseLeave={() => onHoverState?.('')}
      className="flex items-center justify-center pointer-events-auto select-none"
    >
      <div className="group relative flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium text-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:bg-black/60 hover:border-white/35 hover:scale-[1.02]">
        {/* Glowing Green Live Indicator Dot */}
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000 ${
              !isConnected ? 'hidden' : ''
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${
              isConnected
                ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                : 'bg-neutral-500 shadow-none'
            }`}
          />
        </span>

        {/* Dynamic Animated Visitor Count Text */}
        <span className="flex items-center gap-1 font-sans tracking-wide text-neutral-200 group-hover:text-white transition-colors">
          <span
            key={visitorCount}
            className="inline-block font-semibold text-white animate-in fade-in zoom-in-90 duration-300"
          >
            {visitorCount}
          </span>
          <span>bhai paan khaa rahe hai</span>
        </span>
      </div>
    </div>
  );
};
