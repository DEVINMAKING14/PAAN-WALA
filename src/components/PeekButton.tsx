import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';

interface PeekButtonProps {
  onHoverState: (label: string, variant?: 'default' | 'link') => void;
}

const SPIT_VIDEO_ID = '3ivd7sObTk8';
const SPIT_START_TIME = 4.0;

export const PeekButton: React.FC<PeekButtonProps> = ({ onHoverState }) => {
  const [isSpitting, setIsSpitting] = useState(false);
  const [splashCount, setSplashCount] = useState(0);
  const ytPlayerRef = useRef<any>(null);

  // Initialize background YouTube audio player for the exact spit sound clip (3ivd7sObTk8 at 4s)
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const initYT = () => {
      if (window.YT && window.YT.Player) {
        if (!ytPlayerRef.current) {
          const container = document.getElementById('yt-spit-audio-player');
          if (container) {
            ytPlayerRef.current = new window.YT.Player('yt-spit-audio-player', {
              height: '100',
              width: '100',
              videoId: SPIT_VIDEO_ID,
              playerVars: {
                start: 4,
                autoplay: 0,
                controls: 0,
                playsinline: 1,
                origin: window.location.origin,
              },
              events: {
                onReady: (event: any) => {
                  try {
                    event.target.unMute();
                    event.target.setVolume(100);
                    event.target.seekTo(SPIT_START_TIME, true);
                  } catch (e) {
                    console.warn('Spit player ready error', e);
                  }
                },
              },
            });
          }
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initYT();
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  const handlePeekClick = () => {
    // 1. Play synthesized Web Audio spit sound immediately (0 latency)
    soundEngine.playPaanSpitSound();

    // 2. Play exact YouTube audio clip starting at 4 seconds
    const player = ytPlayerRef.current;
    if (player && typeof player.seekTo === 'function' && typeof player.playVideo === 'function') {
      try {
        player.unMute();
        player.setVolume(100);
        player.seekTo(SPIT_START_TIME, true);
        player.playVideo();

        // Pause after 2.5s clip finishes
        setTimeout(() => {
          try {
            if (player && typeof player.pauseVideo === 'function') {
              player.pauseVideo();
            }
          } catch (e) {
            // ignore
          }
        }, 2600);
      } catch (err) {
        console.warn('Spit playback error:', err);
      }
    }

    // 3. Trigger UI splash animation state
    setIsSpitting(true);
    setSplashCount((prev) => prev + 1);

    setTimeout(() => {
      setIsSpitting(false);
    }, 900);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Hidden YouTube Iframe for exact Spit Tobacco Audio */}
      <div className="fixed -bottom-96 -left-96 opacity-0 pointer-events-none z-0">
        <div id="yt-spit-audio-player" />
      </div>

      {/* Peech! 💦 Action Button in Pure White Glassmorphism */}
      <button
        id="btn-peek-spit"
        onClick={handlePeekClick}
        onMouseEnter={() => onHoverState('PEECH! 💦', 'default')}
        onMouseLeave={() => onHoverState('')}
        className={`group relative flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-95 cursor-pointer ${
          isSpitting ? 'ring-2 ring-white/60 bg-white/30 scale-95' : ''
        }`}
        title="Peech! 💦"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="tracking-wider text-[11px] sm:text-xs">Peech! 💦</span>
      </button>

      {/* Playful Floating Visual Indicator */}
      {isSpitting && (
        <div
          key={splashCount}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center gap-1 rounded-full border border-white/30 bg-black/80 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xl backdrop-blur-md animate-in fade-in zoom-in-75 slide-in-from-top-1 duration-200"
        >
          <span>Peech! 💦</span>
        </div>
      )}
    </div>
  );
};
