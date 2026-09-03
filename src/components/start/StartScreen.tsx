import React, { useState, useEffect } from 'react';
import { useEconomy } from '../../context/EconomyStore';
import { HowToPlayModal } from './HowToPlayModal';
import { sound } from '../../utils/audio';
import { FarmIcon, FactoryIcon, TruckIcon, ShopIcon, ConsumerIcon } from '../icons/EconomicIcons';

export const StartScreen: React.FC = () => {
  const { dispatch } = useEconomy();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [animationSkipped, setAnimationSkipped] = useState(false);

  // Entrance animation <= 2.5s, auto-completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationSkipped(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    sound.playMachineStart();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'explore' });
  };

  const handleSkipOrClick = () => {
    if (!animationSkipped) {
      setAnimationSkipped(true);
    }
  };

  return (
    <div
      onClick={handleSkipOrClick}
      className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden bg-background"
    >
      {/* Decorative backdrop glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sectorPrimary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sectorTertiary/10 blur-3xl" />
      </div>

      {/* Header section */}
      <div className={`text-center transition-all duration-700 z-10 ${animationSkipped ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'}`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentYellow/20 border border-accentYellow/40 text-textMain text-xs font-bold uppercase tracking-wider mb-3">
          <span>🌾 Primary</span>
          <span>•</span>
          <span>🏭 Secondary</span>
          <span>•</span>
          <span>🚚 Tertiary</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-textMain tracking-tight mb-2">
          THE ECONOMY MACHINE
        </h1>
        <p className="text-base sm:text-lg text-textMuted max-w-xl mx-auto font-medium">
          See How an Economy Works · NCERT Class 6 Social Science
        </p>
      </div>

      {/* Animated Miniature Town (Inline SVG Canvas) */}
      <div className="w-full max-w-4xl flex-1 max-h-[380px] my-4 relative flex items-center justify-center z-10">
        <div className="w-full h-full bg-surface border border-border rounded-card p-6 shadow-lift relative overflow-hidden flex flex-col justify-between">
          {/* Top description */}
          <div className="flex justify-between items-center text-xs font-bold text-textMuted border-b border-border/60 pb-2">
            <span>RURAL NATURE</span>
            <span className="text-accentYellow">⚡ INTERDEPENDENT FLOW</span>
            <span>VILLAGE BAZAAR</span>
          </div>

          {/* Miniature town layout nodes */}
          <div className="relative flex-1 flex items-center justify-between px-4 sm:px-8 py-4">
            {/* SVG Connection Tracks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-border stroke-[3]" strokeDasharray="6,6">
              {/* Route: Farm to Truck */}
              <line x1="15%" y1="50%" x2="35%" y2="50%" />
              {/* Route: Truck to Factory */}
              <line x1="35%" y1="50%" x2="55%" y2="50%" />
              {/* Route: Factory to Shop */}
              <line x1="55%" y1="50%" x2="75%" y2="50%" />
              {/* Route: Shop to Consumer */}
              <line x1="75%" y1="50%" x2="90%" y2="50%" />

              {/* Animated Goods Packet (CSS animation) */}
              <circle cx="25%" cy="50%" r="5" fill="#2E8B57">
                <animate attributeName="cx" values="15%;35%;55%;75%;90%" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="45%" cy="50%" r="5" fill="#E07A3F">
                <animate attributeName="cx" values="35%;55%;75%;90%" dur="4s" begin="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="65%" cy="50%" r="5" fill="#2F6FB0">
                <animate attributeName="cx" values="55%;75%;90%" dur="4s" begin="2s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* 1. Farm */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-sectorPrimary/15 border-2 border-sectorPrimary flex items-center justify-center text-sectorPrimary shadow-sm hover:scale-105 transition-transform">
                <FarmIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs font-bold text-textMain mt-2">Cotton Farm</span>
              <span className="text-[10px] text-sectorPrimary font-bold">Primary</span>
            </div>

            {/* 2. Truck */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-sectorTertiary/15 border-2 border-sectorTertiary flex items-center justify-center text-sectorTertiary shadow-sm hover:scale-105 transition-transform">
                <TruckIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs font-bold text-textMain mt-2">Logistics</span>
              <span className="text-[10px] text-sectorTertiary font-bold">Tertiary</span>
            </div>

            {/* 3. Factory */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-sectorSecondary/15 border-2 border-sectorSecondary flex items-center justify-center text-sectorSecondary shadow-sm hover:scale-105 transition-transform">
                <FactoryIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs font-bold text-textMain mt-2">Textile Mill</span>
              <span className="text-[10px] text-sectorSecondary font-bold">Secondary</span>
            </div>

            {/* 4. Shop */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-sectorTertiary/15 border-2 border-sectorTertiary flex items-center justify-center text-sectorTertiary shadow-sm hover:scale-105 transition-transform">
                <ShopIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs font-bold text-textMain mt-2">Bazaar Shop</span>
              <span className="text-[10px] text-sectorTertiary font-bold">Tertiary</span>
            </div>

            {/* 5. Consumer */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-accentYellow/20 border-2 border-accentYellow flex items-center justify-center text-textMain shadow-sm hover:scale-105 transition-transform">
                <ConsumerIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs font-bold text-textMain mt-2">School & Home</span>
              <span className="text-[10px] text-textMuted font-bold">Consumer</span>
            </div>
          </div>

          {/* Mini banner */}
          <div className="bg-background rounded-btn p-2 text-center text-xs text-textMuted border border-border">
            &ldquo;Everyday objects connect farmers, workers, transporters, and shopkeepers in one unbroken loop.&rdquo;
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setShowHowToPlay(true);
          }}
          className="px-6 py-3 rounded-btn border-2 border-border bg-surface hover:bg-background text-textMain font-bold text-base shadow-soft transition-all min-h-[44px] min-w-[160px] active:scale-95"
        >
          HOW TO PLAY
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStart();
          }}
          className="px-8 py-3 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-black text-base shadow-lift transition-all min-h-[44px] min-w-[220px] flex items-center justify-center gap-2 active:scale-95 group"
        >
          <span>START THE ECONOMY</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => setShowHowToPlay(false)}
          onStart={() => {
            setShowHowToPlay(false);
            handleStart();
          }}
        />
      )}
    </div>
  );
};
