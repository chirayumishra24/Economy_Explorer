import React, { useState } from 'react';
import { useEconomy } from '../../context/EconomyStore';
import { CanonicalStop } from '../../types/economy';
import { sound } from '../../utils/audio';
import { HowToPlayModal } from '../start/HowToPlayModal';
import { UI_TRANSLATIONS } from '../../data/translations';

interface StopMeta {
  id: CanonicalStop;
  number: number;
  label: string;
  shortLabel: string;
}


const CANONICAL_STOPS: StopMeta[] = [
  { id: 'explore', number: 1, label: '1. Explore', shortLabel: 'Explore' },
  { id: 'follow-product', number: 2, label: '2. Follow Product', shortLabel: 'Follow' },
  { id: 'what-if', number: 3, label: '3. What If?', shortLabel: 'What If' },
  { id: 'fix-economy', number: 4, label: '4. Fix Economy', shortLabel: 'Fix' },
  { id: 'final-challenge', number: 5, label: '5. Final Challenge', shortLabel: 'Challenge' },
  { id: 'assessment', number: 6, label: '6. Assessment', shortLabel: 'Quiz' },
];

export const Header: React.FC = () => {
  const { state, dispatch, resetApp } = useEconomy();
  const [jumpOpen, setJumpOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const totalScore =
    state.scores.exploration +
    state.scores.prediction +
    state.scores.reasoning +
    state.scores.problemSolving +
    state.scores.assessment;

  // Determine if a stop is unlocked
  const isStopUnlocked = (stopId: CanonicalStop): boolean => {
    if (stopId === 'explore') return true;
    if (stopId === 'follow-product') return state.completedStops.includes('explore');
    if (stopId === 'what-if') return state.completedStops.includes('follow-product');
    if (stopId === 'fix-economy') return state.completedStops.includes('what-if');
    if (stopId === 'final-challenge') return state.completedStops.includes('fix-economy');
    if (stopId === 'assessment' || stopId === 'results' || stopId === 'review') {
      return state.completedStops.includes('final-challenge');
    }
    return false;
  };

  const handleStopClick = (stopId: CanonicalStop) => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: stopId });
  };

  const handleHomeClick = () => {
    sound.playClick();
    dispatch({ type: 'SET_SCREEN', screen: 'start' });
  };

  const handleSoundToggle = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    sound.playClick();
  };

  const handleClassroomToggle = () => {
    sound.playClick();
    dispatch({ type: 'TOGGLE_CLASSROOM_MODE' });
    // Update root class
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('classroom-mode');
    }
  };

  const handleReset = () => {
    if (window.confirm('Restart the simulation from the beginning? All progress will reset.')) {
      resetApp();
    }
  };

  return (
    <header className="w-full bg-surface border-b border-border shadow-soft px-4 py-2.5 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Home */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-btn hover:bg-background border border-border/60 transition-colors min-h-[44px]"
          title="Return to Welcome Screen"
          aria-label="Return to Start"
        >
          <div className="w-8 h-8 rounded-lg bg-accentYellow flex items-center justify-center font-black text-textMain text-base shadow-sm">
            E
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-bold text-textMain leading-tight">
              {state.language === 'hi' ? 'द इकोनॉमी मशीन' : 'The Economy Machine'}
            </div>
            <div className="text-[11px] text-textMuted leading-none">
              {state.language === 'hi' ? 'कक्षा 6 सामाजिक विज्ञान' : 'Class 6 Social Science'}
            </div>
          </div>
        </button>

        {/* Teacher Quick Jump */}
        <div className="relative">
          <button
            onClick={() => setJumpOpen(!jumpOpen)}
            className="text-xs px-2.5 py-1.5 rounded-btn bg-background hover:bg-border/50 text-textMuted border border-border flex items-center gap-1 min-h-[44px]"
            title="Classroom Demo: Jump to any stop"
            aria-expanded={jumpOpen}
          >
            <span>{state.language === 'hi' ? 'सीधे जाएं...' : 'Jump to...'}</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {jumpOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-surface border border-border rounded-card shadow-lift p-1.5 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-textMuted uppercase tracking-wider">Teacher Controls</div>
              {CANONICAL_STOPS.map((stop) => {
                const localizedStop = UI_TRANSLATIONS[state.language].stops[stop.id as keyof typeof UI_TRANSLATIONS['en']['stops']] || stop.label;
                return (
                  <button
                    key={stop.id}
                    onClick={() => {
                      handleStopClick(stop.id);
                      setJumpOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-btn text-sm font-medium hover:bg-background text-textMain transition-colors flex items-center justify-between"
                  >
                    <span>{localizedStop}</span>
                    {state.completedStops.includes(stop.id) && (
                      <span className="text-statusSuccess text-xs font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress Rail — Canonical 6 Stops */}
      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 px-2" aria-label="Economy Machine Progress">
        {CANONICAL_STOPS.map((stop) => {
          const unlocked = isStopUnlocked(stop.id);
          const isCurrent =
            state.currentStop === stop.id ||
            (stop.id === 'assessment' && (state.currentStop === 'results' || state.currentStop === 'review'));
          const isCompleted = state.completedStops.includes(stop.id);
          const localizedShort = UI_TRANSLATIONS[state.language].stops[stop.id as keyof typeof UI_TRANSLATIONS['en']['stops']] || stop.shortLabel;

          return (
            <button
              key={stop.id}
              onClick={() => unlocked && handleStopClick(stop.id)}
              disabled={!unlocked}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[44px] ${
                isCurrent
                  ? 'bg-textMain text-surface shadow-soft scale-105'
                  : isCompleted
                  ? 'bg-statusSuccess/15 text-statusSuccess hover:bg-statusSuccess/25'
                  : unlocked
                  ? 'bg-background text-textMain hover:bg-border/60 border border-border'
                  : 'bg-background/40 text-textMuted/50 border border-border/40 cursor-not-allowed'
              }`}
              title={unlocked ? `Go to ${stop.label}` : `${stop.label} (Complete previous stop first)`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCurrent ? 'bg-surface text-textMain' : isCompleted ? 'bg-statusSuccess text-surface' : 'bg-border text-textMuted'
              }`}>
                {isCompleted ? '✓' : stop.number}
              </span>
              <span className="hidden md:inline">{localizedShort}</span>
            </button>
          );
        })}
      </nav>

      {/* Utility Controls (Sound, Classroom Mode, Score, Reset) */}
      <div className="flex items-center gap-2">
        {/* Score Chip (Hidden in Classroom Mode) */}
        {!state.classroomMode && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 bg-accentYellow/20 border border-accentYellow/50 rounded-full text-textMain font-bold text-xs"
            title="Total Score across Exploration, Prediction, Reasoning, Problem Solving & Assessment"
          >
            <span className="text-[11px] text-textMuted font-normal">Score:</span>
            <span>{totalScore}</span>
            <span className="text-[10px] text-textMuted">/100</span>
          </div>
        )}

        {/* Guide / How to Play Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowGuide(true);
          }}
          className="px-2.5 py-1.5 rounded-btn border border-border bg-background hover:bg-border/50 text-textMain text-xs font-bold transition-colors min-h-[44px] flex items-center gap-1.5"
          title="Open How to Play & Instructions Guide"
          aria-label="Open How to Play Guide"
        >
          <span className="text-sm">❓</span>
          <span className="hidden sm:inline">Guide</span>
        </button>

        {/* Bilingual Language Switcher */}
        <button
          onClick={() => {
            sound.playClick();
            dispatch({
              type: 'SET_LANGUAGE',
              language: state.language === 'en' ? 'hi' : 'en'
            });
          }}
          className={`px-2.5 py-1.5 rounded-btn border transition-colors min-h-[44px] flex items-center gap-1 text-xs font-bold ${
            state.language === 'hi'
              ? 'bg-accentOrange text-surface border-accentOrange shadow-soft'
              : 'bg-background text-textMain border-border hover:bg-border/50'
          }`}
          title={state.language === 'en' ? 'Switch to Hindi (हिन्दी में पढ़ें)' : 'Switch to English'}
          aria-label="Toggle language"
        >
          <span className="text-sm">🌐</span>
          <span>{state.language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Classroom Mode Toggle */}

        <button
          onClick={handleClassroomToggle}
          className={`p-2 rounded-btn border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-xs font-bold ${
            state.classroomMode
              ? 'bg-sectorTertiary text-surface border-sectorTertiary'
              : 'bg-background text-textMain border-border hover:bg-border/50'
          }`}
          title={state.classroomMode ? 'Classroom Mode ON (Large text, simplified controls)' : 'Toggle Classroom Mode for Smartboard'}
          aria-label="Toggle Classroom Mode"
        >
          <span className="text-sm">👨‍🏫</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`p-2 rounded-btn border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            state.soundEnabled
              ? 'bg-statusSuccess/15 text-statusSuccess border-statusSuccess/40'
              : 'bg-background text-textMuted border-border hover:bg-border/50'
          }`}
          title={state.soundEnabled ? 'Sound Enabled (Web Audio API)' : 'Sound Muted'}
          aria-label={state.soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
        >
          {state.soundEnabled ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
              <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2 rounded-btn border border-border bg-background hover:bg-border/50 text-textMuted hover:text-textMain transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Reset Simulation"
          aria-label="Reset Simulation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Persistent How to Play Guide Modal */}
      {showGuide && (
        <HowToPlayModal
          onClose={() => setShowGuide(false)}
          onStart={() => setShowGuide(false)}
        />
      )}
    </header>
  );
};
