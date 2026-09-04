import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { sound } from '../../../utils/audio';
import { UI_TRANSLATIONS } from '../../../data/translations';

interface Props {
  onClose: () => void;
  totalScore: number;
}

export const CertificateModal: React.FC<Props> = ({ onClose, totalScore }) => {
  const { state, dispatch } = useEconomy();
  const [name, setName] = useState(state.studentName || '');

  const lang = state.language;
  const ui = UI_TRANSLATIONS[lang].certificate;

  const handleNameChange = (val: string) => {
    setName(val);
    dispatch({ type: 'SET_STUDENT_NAME', name: val });
  };

  const handlePrint = () => {
    sound.playChallengeComplete();
    window.print();
  };

  const todayStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
      className="fixed inset-0 z-50 bg-textMain/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-surface border-2 border-border rounded-card shadow-lift max-w-2xl w-full p-4 sm:p-8 relative select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button — Hidden during print */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="print:hidden absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-textMuted hover:text-textMain min-h-[44px]"
          aria-label={ui.closeBtn}
        >
          ✕
        </button>

        {/* Printable Certificate Area */}
        <div id="printable-certificate" className="border-4 border-double border-amber-600/60 rounded-card p-6 sm:p-8 bg-linear-to-b from-amber-50/40 via-surface to-amber-50/20 text-center relative overflow-hidden">
          {/* Watermark seal in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
            ⚖️
          </div>

          {/* Top Crest / Seal Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🏛️</span>
          </div>

          <h2 id="cert-title" className="text-2xl sm:text-3xl font-black text-textMain tracking-wide uppercase">
            {ui.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-textMuted mt-1">
            {ui.subtitle}
          </p>

          <div className="w-24 h-1 bg-amber-500/50 mx-auto my-4 rounded-full" />

          <p className="text-xs sm:text-sm text-textMuted uppercase tracking-wider font-bold">
            {ui.presentedTo}
          </p>

          {/* Student Name Input or Display */}
          <div className="my-3">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={ui.namePlaceholder}
              className="text-xl sm:text-2xl font-black text-textMain text-center border-b-2 border-dashed border-amber-600/60 bg-transparent py-1 px-4 focus:outline-hidden focus:border-amber-600 max-w-md w-full"
            />
          </div>

          <p className="text-xs sm:text-sm text-textMain leading-relaxed max-w-lg mx-auto font-medium my-4">
            {ui.body}
          </p>

          {/* Competency Badges Grid */}
          <div className="grid grid-cols-3 gap-2 my-5 text-left max-w-md mx-auto">
            <div className="p-2 rounded bg-background border border-border/80 text-center">
              <span className="text-lg block">🌾</span>
              <span className="text-[10px] font-bold text-sectorPrimary block">Primary (Nature)</span>
              <span className="text-[9px] text-textMuted">Harvest & Raw</span>
            </div>
            <div className="p-2 rounded bg-background border border-border/80 text-center">
              <span className="text-lg block">🏭</span>
              <span className="text-[10px] font-bold text-sectorSecondary block">Secondary (Making)</span>
              <span className="text-[9px] text-textMuted">Craft & Mill</span>
            </div>
            <div className="p-2 rounded bg-background border border-border/80 text-center">
              <span className="text-lg block">🚚</span>
              <span className="text-[10px] font-bold text-sectorTertiary block">Tertiary (Services)</span>
              <span className="text-[9px] text-textMuted">Transport & Shop</span>
            </div>
          </div>

          {/* Footer of Certificate: Score, Date, Signatures */}
          <div className="grid grid-cols-3 items-end pt-4 border-t border-border/80 text-xs mt-6">
            <div className="text-left">
              <span className="text-[10px] text-textMuted font-bold uppercase block">{ui.scoreLabel}</span>
              <span className="text-base font-black text-textMain">{totalScore} / 100</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-amber-600 bg-amber-500/10 flex items-center justify-center mx-auto text-amber-700 font-bold text-xs">
                ★ 100% ★
              </div>
              <span className="text-[9px] text-textMuted mt-1 block font-semibold">{ui.sealLabel}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-textMuted font-bold uppercase block">{ui.dateLabel}</span>
              <span className="text-xs font-bold text-textMain">{todayStr}</span>
            </div>
          </div>
        </div>

        {/* Action Controls — Hidden during print */}
        <div className="print:hidden mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-btn border border-border bg-background hover:bg-border/50 text-textMuted hover:text-textMain text-xs font-bold transition-colors min-h-[44px]"
          >
            {ui.closeBtn}
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-btn bg-accentOrange hover:brightness-105 text-surface font-black text-xs shadow-soft min-h-[44px] flex items-center gap-2 active:scale-95"
          >
            <span>🖨️</span>
            <span>{ui.printBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
