import React from 'react';
import { useEconomy } from '../../context/EconomyStore';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const { state, dispatch } = useEconomy();

  const handleTeacherClick = () => {
    sound.playClick();
    dispatch({ type: 'SET_SCREEN', screen: 'teacher' });
  };

  return (
    <footer className="w-full bg-surface/80 border-t border-border px-4 py-2 flex items-center justify-between text-xs text-textMuted select-none shrink-0 z-20">
      <div className="flex items-center gap-4">
        <span>
          <strong className="text-textMain font-semibold">NCERT Class 6</strong>: Chapter 14 &ldquo;Economic Activities Around Us&rdquo;
        </span>
        <span className="hidden md:inline text-border">|</span>
        <span className="hidden md:inline">
          Offline Interactive Machine
        </span>
      </div>

      <div className="flex items-center gap-4">
        {state.reducedMotion && (
          <span className="text-[11px] bg-background px-2 py-0.5 rounded border border-border">
            Reduced Motion Active
          </span>
        )}
        <button
          onClick={handleTeacherClick}
          className="text-sectorTertiary hover:underline font-semibold flex items-center gap-1 min-h-[44px] px-2"
          aria-label="Open Teacher Mode"
        >
          <span>📋</span>
          <span>For Teachers</span>
        </button>
      </div>
    </footer>
  );
};
