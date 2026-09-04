import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { sound } from '../../../utils/audio';
import { ReviewModal } from './ReviewModal';
import { CertificateModal } from './CertificateModal';
import { UI_TRANSLATIONS } from '../../../data/translations';

export const ResultsScreen: React.FC = () => {
  const { state, playAgain, dispatch } = useEconomy();
  const [showReview, setShowReview] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const lang = state.language;
  const ui = UI_TRANSLATIONS[lang].certificate;

  const totalScore =
    state.scores.exploration +
    state.scores.prediction +
    state.scores.reasoning +
    state.scores.problemSolving +
    state.scores.assessment;

  // Achievement Bands
  let bandTitle = 'Keep Exploring';
  let bandDesc = 'You are learning how goods and services connect our daily lives. Take another pass through the machine!';
  let bandBadgeColor = 'bg-accentYellow/20 text-textMain border-accentYellow';

  if (totalScore >= 85) {
    bandTitle = 'Economy Expert';
    bandDesc = 'Outstanding mastery! You clearly understand how producers, makers, transport, and shops depend on each other.';
    bandBadgeColor = 'bg-statusSuccess/20 text-statusSuccess border-statusSuccess';
  } else if (totalScore >= 65) {
    bandTitle = 'Economy Explorer';
    bandDesc = 'Great work! You have a solid grasp of the three economic sectors and product value chains.';
    bandBadgeColor = 'bg-sectorTertiary/20 text-sectorTertiary border-sectorTertiary';
  } else if (totalScore >= 45) {
    bandTitle = 'Getting Connected';
    bandDesc = 'You see the links between nature, factories, and markets. Keep practicing the disruption ripples!';
    bandBadgeColor = 'bg-sectorSecondary/20 text-sectorSecondary border-sectorSecondary';
  }

  const handlePlayAgain = () => {
    sound.playMachineStart();
    playAgain();
  };

  const handleOpenReview = () => {
    sound.playClick();
    setShowReview(true);
  };

  const handleOpenTeacherSummary = () => {
    sound.playClick();
    dispatch({ type: 'SET_SCREEN', screen: 'teacher' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-textMain tracking-tight">
          {lang === 'hi' ? 'द इकोनॉमी मशीन के अंतिम परिणाम' : 'Your Economy Machine Results'}
        </h2>
        <p className="text-xs sm:text-sm text-textMuted font-medium">
          {lang === 'hi' ? 'कक्षा 6 सामाजिक विज्ञान · अध्याय 14 मूल्यांकन' : 'Class 6 Social Science · Chapter 14 Evaluation'}
        </p>
      </div>

      {/* Main Scorecard Arena */}
      <div className="flex-1 w-full max-w-4xl mx-auto bg-surface border border-border rounded-card p-5 sm:p-6 shadow-soft flex flex-col justify-between overflow-hidden my-2">
        {/* Top Banner: Total Score & Achievement Band */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-btn bg-background border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface border-2 border-border shadow-sm flex flex-col items-center justify-center">
              <span className="text-xl font-black text-textMain leading-none">{totalScore}</span>
              <span className="text-[10px] text-textMuted font-bold leading-none">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${bandBadgeColor}`}>
                  {bandTitle}
                </span>
                <span className="text-xs text-textMuted font-semibold">Overall Mastery</span>
              </div>
              <p className="text-xs text-textMain mt-1 max-w-md">{bandDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenReview}
              className="px-4 py-2 rounded-btn border border-border bg-surface hover:bg-border/40 text-xs font-bold text-textMain min-h-[44px]"
            >
              📖 Review Answers
            </button>
            <button
              onClick={handleOpenTeacherSummary}
              className="px-4 py-2 rounded-btn border border-sectorTertiary/40 bg-sectorTertiary/10 text-sectorTertiary hover:bg-sectorTertiary/20 text-xs font-bold min-h-[44px]"
            >
              📋 Teacher Summary
            </button>
          </div>
        </div>

        {/* 5-Dimension Score Formula Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3">
          <div className="p-3 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Exploration</span>
            <span className="text-lg font-black text-textMain mt-0.5 block">{state.scores.exploration} <span className="text-xs font-normal text-textMuted">/10</span></span>
            <span className="text-[10px] text-sectorPrimary font-semibold">3 Sectors Visited</span>
          </div>

          <div className="p-3 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Prediction</span>
            <span className="text-lg font-black text-textMain mt-0.5 block">{state.scores.prediction} <span className="text-xs font-normal text-textMuted">/20</span></span>
            <span className="text-[10px] text-textMuted font-semibold">Pre-run Hypothesis</span>
          </div>

          <div className="p-3 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Reasoning</span>
            <span className="text-lg font-black text-textMain mt-0.5 block">{state.scores.reasoning} <span className="text-xs font-normal text-textMuted">/20</span></span>
            <span className="text-[10px] text-sectorTertiary font-semibold">Interdependence</span>
          </div>

          <div className="p-3 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Problem Solving</span>
            <span className="text-lg font-black text-textMain mt-0.5 block">{state.scores.problemSolving} <span className="text-xs font-normal text-textMuted">/20</span></span>
            <span className="text-[10px] text-sectorSecondary font-semibold">Fix & Chain Tasks</span>
          </div>

          <div className="p-3 rounded-btn bg-background border border-border/70 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Assessment</span>
            <span className="text-lg font-black text-textMain mt-0.5 block">{state.scores.assessment} <span className="text-xs font-normal text-textMuted">/30</span></span>
            <span className="text-[10px] text-statusSuccess font-semibold">10 Quiz Questions</span>
          </div>
        </div>

        {/* 4 Acceptance Tests Mastery Check */}
        <div className="p-3.5 bg-background border border-border rounded-btn">
          <span className="text-xs font-bold text-textMain block mb-2">
            Class 6 Core Competency Checklist:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-textMain">
              <span className="text-statusSuccess font-bold">✓</span>
              <span>1. Can state what producers, sellers, and consumers do</span>
            </div>
            <div className="flex items-center gap-2 text-textMain">
              <span className="text-statusSuccess font-bold">✓</span>
              <span>2. Can trace product from raw nature to final consumer</span>
            </div>
            <div className="flex items-center gap-2 text-textMain">
              <span className="text-statusSuccess font-bold">✓</span>
              <span>3. Can classify activities into primary, secondary, and tertiary</span>
            </div>
            <div className="flex items-center gap-2 text-textMain">
              <span className="text-statusSuccess font-bold">✓</span>
              <span>4. Can name ripple effects when one sector is disrupted</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Claim Certificate & Play Again */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border mt-3">
          <button
            onClick={() => {
              sound.playChallengeComplete();
              setShowCertificate(true);
            }}
            className="px-6 py-3 rounded-btn bg-accentOrange hover:brightness-105 text-surface font-black text-xs sm:text-sm shadow-soft min-h-[44px] flex items-center gap-2 active:scale-95"
          >
            <span>🎓</span>
            <span>{ui.button}</span>
          </button>

          <button
            onClick={handlePlayAgain}
            className="px-8 py-3 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-black text-xs sm:text-sm shadow-soft min-h-[44px] flex items-center gap-2 active:scale-95"
          >
            <span>{lang === 'hi' ? 'पुनः खेलें (नए प्रश्न)' : 'PLAY AGAIN (NEW QUESTIONS)'}</span>
            <span>↻</span>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <ReviewModal
          questions={state.assessmentQuestions}
          userAnswers={state.userAnswers}
          onClose={() => setShowReview(false)}
        />
      )}

      {/* Printable Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          totalScore={totalScore}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
