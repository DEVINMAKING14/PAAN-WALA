import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, X, Check, UtensilsCrossed, Leaf } from 'lucide-react';
import { PAAN_FLAVORS } from '../data/playlist';
import { PaanFlavor } from '../types';
import { soundEngine } from '../services/soundEngine';
import paanPhoto from '../assets/images/royal_meetha_paan_1786879915678.jpg';

interface PaanInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaanPrepared: (flavor: PaanFlavor) => void;
}

export const PaanInteractionModal: React.FC<PaanInteractionModalProps> = ({
  isOpen,
  onClose,
  onPaanPrepared,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<PaanFlavor>(PAAN_FLAVORS[0]);
  const [stage, setStage] = useState<'pick' | 'folding' | 'ready'>('pick');
  const [activeIngredients, setActiveIngredients] = useState<string[]>([]);
  const leafRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleStartFolding = (flavor: PaanFlavor) => {
    setSelectedFlavor(flavor);
    setStage('folding');

    if (flavor.isFire) {
      soundEngine.playFirePaanWhoosh();
    } else {
      soundEngine.playPaanFoldSound();
    }

    // Sequentially layer ingredients with tactile audio cues
    const ingredients = flavor.ingredients;
    setActiveIngredients([]);

    ingredients.forEach((ing, index) => {
      setTimeout(() => {
        setActiveIngredients((prev) => [...prev, ing]);
        if (index % 2 === 0) {
          soundEngine.playSubtleClick();
        } else {
          soundEngine.playPaanFoldSound();
        }
      }, (index + 1) * 350);
    });

    // Complete fold
    setTimeout(() => {
      soundEngine.playPaanFoldSound();
      setStage('ready');

      // Trigger warm golden and rose petal confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: flavor.isFire
          ? ['#f97316', '#ef4444', '#fbbf24', '#b91c1c']
          : ['#10b981', '#fbbf24', '#f43f5e', '#fde047'],
      });

      onPaanPrepared(flavor);
    }, (ingredients.length + 1) * 380);
  };

  const handleReset = () => {
    soundEngine.playSubtleClick();
    setStage('pick');
    setActiveIngredients([]);
  };

  return (
    <div
      id="paan-interaction-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#0A0502]/95 p-6 sm:p-8 text-[#F5F2ED] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#FF4E00]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#FF4E00]/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-paan-modal"
          onClick={() => {
            soundEngine.playSubtleClick();
            onClose();
          }}
          className="absolute top-5 right-5 rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 hover:text-[#FF4E00] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Stage 1: Pick Flavor */}
        {stage === 'pick' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[10px] uppercase tracking-[0.25em] text-[#FF4E00] mb-2 font-bold">
                <Leaf className="h-3.5 w-3.5 text-[#FF4E00]" />
                <span>असली बनारसी अंदाज &bull; SIGNATURE CRAFT</span>
              </div>
              <h2 className="font-sign text-2xl sm:text-3xl text-[#F5F2ED]">
                पान लगा दो &bull; Pick Your Paan
              </h2>
              <p className="text-xs sm:text-sm text-[#8E9299] mt-1">
                Handcrafted on fresh Maghai betel leaves with authentic royal spices.
              </p>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar pr-1">
              {PAAN_FLAVORS.map((flavor) => (
                <div
                  key={flavor.id}
                  onClick={() => handleStartFolding(flavor)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer bg-white/5 ${
                    selectedFlavor.id === flavor.id
                      ? 'border-[#FF4E00] shadow-[0_0_20px_rgba(255,78,0,0.25)]'
                      : 'border-white/10 hover:border-[#FF4E00]/60 hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sign text-base text-[#F5F2ED] group-hover:text-[#FF4E00] transition-colors">
                        {flavor.hindiName}
                      </h3>
                      {flavor.isFire && (
                        <span className="flex items-center gap-0.5 rounded-full bg-[#FF4E00]/20 border border-[#FF4E00]/40 px-2 py-0.5 text-[9px] font-bold text-[#FF4E00] animate-pulse">
                          <Flame className="h-3 w-3" /> LIVE FIRE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8E9299] font-medium">{flavor.name}</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {flavor.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-teko text-lg text-[#FF4E00] font-bold tracking-wider">
                      {flavor.price}
                    </span>
                    <span className="rounded-full bg-[#FF4E00]/20 border border-[#FF4E00]/30 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#F5F2ED] group-hover:bg-[#FF4E00] group-hover:text-black transition-colors mt-1">
                      लगाओ &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2: Folding in Progress */}
        {stage === 'folding' && (
          <div className="text-center py-6">
            <div className="relative mx-auto h-36 w-36 flex items-center justify-center">
              {/* Animated Betel Leaf Silhouette */}
              <div
                ref={leafRef}
                className="relative h-28 w-28 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-emerald-600 via-emerald-800 to-green-950 shadow-2xl border border-emerald-400/40 animate-pulse flex items-center justify-center rotate-45"
              >
                {selectedFlavor.isFire ? (
                  <Flame className="h-10 w-10 text-[#FF4E00] animate-bounce -rotate-45" />
                ) : (
                  <Sparkles className="h-8 w-8 text-amber-300 animate-spin -rotate-45" />
                )}
              </div>
            </div>

            <h3 className="font-sign text-xl text-[#F5F2ED] mt-4">
              पान तैयार हो रहा है...
            </h3>
            <p className="text-xs text-[#8E9299] mt-1">
              Applying authentic Kattha, Chuna &amp; Handpicked Gulkand
            </p>

            {/* Active Ingredients Reveal */}
            <div className="mt-4 flex flex-wrap justify-center gap-1.5 min-h-[48px]">
              {activeIngredients.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#FF4E00]/30 bg-black/60 px-3 py-1 text-[11px] font-medium text-[#F5F2ED] animate-in zoom-in-75 duration-200"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Ready to Savor */}
        {stage === 'ready' && (
          <div className="text-center py-2">
            <div className="relative mx-auto mb-3 h-36 w-36 rounded-2xl overflow-hidden border-2 border-[#FF4E00] shadow-[0_0_35px_rgba(255,78,0,0.4)]">
              <img
                src={paanPhoto}
                alt="Banarasi Paan Prepared"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <span className="rounded-full bg-[#FF4E00]/20 border border-[#FF4E00]/40 px-3 py-1 text-xs font-semibold text-[#FF4E00] uppercase tracking-widest">
              स्वादिष्ट &bull; Ready to Savor!
            </span>

            <h2 className="font-sign text-2xl sm:text-3xl text-[#F5F2ED] mt-2">
              {selectedFlavor.hindiName}
            </h2>
            <p className="text-sm text-neutral-300 mt-1">{selectedFlavor.name}</p>
            <p className="text-xs text-[#8E9299] max-w-sm mx-auto mt-2">
              {selectedFlavor.description}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-savor-paan"
                onClick={() => {
                  soundEngine.playPaanFoldSound();
                  onClose();
                }}
                className="w-full sm:w-auto rounded-full bg-[#FF4E00] px-7 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(255,78,0,0.4)] hover:scale-105 transition-transform cursor-pointer"
              >
                जायका लें &bull; Savor Now
              </button>

              <button
                id="btn-another-paan"
                onClick={handleReset}
                className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs uppercase tracking-wider text-neutral-300 hover:text-white hover:border-[#FF4E00] transition-colors cursor-pointer"
              >
                एक और बनाएं &bull; Make Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
