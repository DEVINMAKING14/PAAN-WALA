import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { CursorState } from '../types';
import { SocialSignboards } from './SocialSignboards';
import { PeekButton } from './PeekButton';
import { MusicPlayer } from './MusicPlayer';
import { soundEngine } from '../services/soundEngine';

// Hero Paan Shop Image (Handcrafted Paan Dukaan Illustration)
import heroImagePortrait from '../assets/images/paan_shopkeeper_art_1786880863733.jpg';
import heroImageWide from '../assets/images/paan_dukaan_wide_1786880877681.jpg';

interface PaanShopHeroProps {
  onHoverState: (label: string, variant?: CursorState['variant']) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const PaanShopHero: React.FC<PaanShopHeroProps> = ({
  onHoverState,
  isSoundEnabled,
  onToggleSound,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Mouse Parallax & Cinematic Camera (tilt scene smoothly with mouse movement)
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const updateParallax = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      if (worldRef.current) {
        const rotateX = -targetY * 2.5;
        const rotateY = targetX * 3.5;
        const translateX = -targetX * 18;
        const translateY = -targetY * 12;

        worldRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0) scale(1.04)`;
      }

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="paan-shop-world"
      className="relative h-screen w-full bg-[#050505] text-white selection:bg-white selection:text-black overflow-hidden"
    >
      {/* Fullscreen Viewport */}
      <div className="relative h-screen w-full overflow-hidden select-none bg-[#050505]">
        {/* Subtle Ambient Vignette & Grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />
        <div className="absolute inset-0 film-grain pointer-events-none z-10 opacity-30" />

        {/* TOP STATUS & NAVIGATION BAR (FULLY VISIBLE & RESPONSIVE ON MOBILE, TABLET & DESKTOP) */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 md:px-10 py-3 sm:py-5 pointer-events-none">
          {/* Top Left: Social Links (Instagram, GitHub, Email) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <SocialSignboards onHoverState={onHoverState} />
          </div>

          {/* Top Right: Peek Button + Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {/* Peek Button (plays spit tobacco sound) */}
            <PeekButton onHoverState={onHoverState} />

            {/* Sound Toggle Button */}
            <button
              id="btn-toggle-sound"
              onClick={() => {
                soundEngine.playSubtleClick();
                onToggleSound();
              }}
              onMouseEnter={() => onHoverState(isSoundEnabled ? 'MUTE' : 'SOUND', 'default')}
              onMouseLeave={() => onHoverState('')}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs text-white backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isSoundEnabled ? (
                <>
                  <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white animate-pulse" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-wider font-bold">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-400" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400">SOUND OFF</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* 3D PARALLAX WORLD CONTAINER (PAAN SHOP ILLUSTRATION) */}
        <div
          ref={worldRef}
          className="relative h-full w-full will-change-transform transition-transform duration-75 ease-out flex items-center justify-center overflow-hidden"
        >
          <picture className="h-full w-full flex items-center justify-center">
            <source media="(min-width: 1024px)" srcSet={heroImageWide} />
            <img
              ref={imageRef}
              src={heroImagePortrait}
              alt="Authentic Paan Dukaan Scene"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center filter brightness-100 contrast-100 select-none pointer-events-none"
            />
          </picture>
        </div>

        {/* EXACT CENTERED FROSTED MUSIC PILL PLAYER */}
        <MusicPlayer
          isSoundEnabled={isSoundEnabled}
          onToggleSound={onToggleSound}
          onHoverState={onHoverState}
        />
      </div>
    </div>
  );
};

