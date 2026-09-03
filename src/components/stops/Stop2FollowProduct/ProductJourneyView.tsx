import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { PRODUCT_JOURNEYS } from '../../../data/products';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { NodeIconRenderer, SectorBadge } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';

export const ProductJourneyView: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('cotton-shirt');

  const journey = PRODUCT_JOURNEYS.find(p => p.id === selectedProductId) || PRODUCT_JOURNEYS[0];
  const currentStage = journey.stages[currentStageIdx];
  const currentNode = ECONOMIC_NODES.find(n => n.id === currentStage.nodeId);
  const isLastStage = currentStageIdx === journey.stages.length - 1;

  const handleSelectProduct = (id: string) => {
    sound.playClick();
    setSelectedProductId(id);
    setCurrentStageIdx(0);
    dispatch({ type: 'SELECT_PRODUCT', productId: id });
  };

  const handleNextStage = () => {
    sound.playProductMove();
    if (isLastStage) {
      if (!state.completedStops.includes('follow-product')) {
        sound.playChallengeComplete();
        dispatch({ type: 'COMPLETE_STOP', stop: 'follow-product' });
      }
    } else {
      setCurrentStageIdx(prev => prev + 1);
    }
  };

  const handlePrevStage = () => {
    sound.playClick();
    if (currentStageIdx > 0) {
      setCurrentStageIdx(prev => prev - 1);
    }
  };

  const handleRestartJourney = () => {
    sound.playClick();
    setCurrentStageIdx(0);
  };

  const handleGoToWhatIf = () => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'what-if' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Header: Product Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-card p-3 shadow-soft z-10">
        <div>
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">Select a Familiar Product:</span>
          <div className="flex items-center gap-2 mt-1">
            {PRODUCT_JOURNEYS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(p.id)}
                className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all min-h-[44px] ${
                  p.id === selectedProductId
                    ? 'bg-accentYellow text-textMain shadow-soft scale-105'
                    : 'bg-background hover:bg-border/60 text-textMuted border border-border'
                }`}
              >
                {p.product}
              </button>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1.5">
          {journey.stages.map((stg, idx) => (
            <div
              key={stg.nodeId}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                idx === currentStageIdx
                  ? 'bg-textMain text-surface ring-2 ring-accentYellow ring-offset-2 scale-110'
                  : idx < currentStageIdx
                  ? 'bg-statusSuccess text-white'
                  : 'bg-background text-textMuted border border-border'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="bg-background/80 border border-border/80 rounded-btn px-3 py-1.5 mt-2 flex items-center justify-between text-xs text-textMuted z-10">
        <div className="flex items-center gap-2">
          <span className="text-accentYellow font-bold">💡 How to Play:</span>
          <span>Pick a product above, then click [NEXT STAGE →] below to follow the raw materials transforming into finished goods step-by-step.</span>
        </div>
      </div>

      {/* Main Visual Arena: Interactive Flow Chain */}
      <div className="flex-1 w-full bg-surface border border-border rounded-card my-2 p-4 sm:p-6 shadow-soft flex flex-col justify-between overflow-hidden relative">
        {/* Journey overview subtitle */}
        <div className="text-xs text-textMuted border-b border-border/60 pb-2 flex justify-between">
          <span>{journey.description}</span>
          <span className="font-bold">Stage {currentStageIdx + 1} of {journey.stages.length}</span>
        </div>

        {/* Stage Nodes Sequence with Token Travel */}
        <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-6 relative my-auto">
          {journey.stages.map((stage, idx) => {
            const node = ECONOMIC_NODES.find(n => n.id === stage.nodeId);
            if (!node) return null;

            const isCurrent = idx === currentStageIdx;
            const isPassed = idx < currentStageIdx;
            const isLitInFinal = isLastStage; // At end, whole path stays lit!

            return (
              <React.Fragment key={stage.nodeId}>
                {/* Node Box */}
                <div
                  className={`flex-1 max-w-[170px] p-3 rounded-card border-2 flex flex-col items-center text-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-surface border-accentYellow shadow-lift scale-105 ring-4 ring-accentYellow/20'
                      : isPassed || isLitInFinal
                      ? 'bg-background border-statusSuccess/70 shadow-sm'
                      : 'bg-background/40 border-border/60 opacity-40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCurrent ? 'bg-accentYellow/30 text-textMain' : isPassed || isLitInFinal ? 'bg-statusSuccess/15 text-statusSuccess' : 'bg-border/30 text-textMuted'
                  }`}>
                    <NodeIconRenderer name={node.icon} size={24} />
                  </div>
                  <SectorBadge sector={node.sector} className="text-[10px] scale-90 mb-1" />
                  <span className="text-xs font-bold text-textMain leading-tight line-clamp-1">{node.label}</span>
                  <span className="text-[11px] text-textMuted mt-0.5">{node.who.split(',')[0]}</span>
                </div>

                {/* Connecting Arrow */}
                {idx < journey.stages.length - 1 && (
                  <div className="flex items-center justify-center text-textMuted">
                    <svg className={`w-6 h-6 transition-colors ${idx < currentStageIdx || isLitInFinal ? 'text-statusSuccess' : 'text-border'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Stage Highlight Card (<= 20 words caption) */}
        <div className="bg-background border border-border rounded-btn p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accentYellow/20 border border-accentYellow flex items-center justify-center font-black text-textMain text-sm shrink-0">
              {currentStageIdx + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-textMain">{currentNode?.label}: {currentNode?.who}</h4>
                <span className="text-xs text-textMuted">({currentNode?.output.label})</span>
              </div>
              <p className="text-base text-textMain font-medium mt-1 leading-snug">
                {currentStage.caption}
              </p>
              <div className="text-xs font-bold text-sectorPrimary mt-1">
                ⚡ What Changed: <span className="font-normal text-textMuted">{currentStage.changeHere}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {currentStageIdx > 0 && (
              <button
                onClick={handlePrevStage}
                className="px-3 py-2 rounded-btn border border-border bg-surface text-xs font-bold text-textMain hover:bg-background min-h-[44px]"
              >
                ← Back
              </button>
            )}

            {!isLastStage ? (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5 active:scale-95"
              >
                <span>NEXT STAGE</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={handleRestartJourney}
                className="px-3 py-2 rounded-btn border border-border bg-surface text-xs font-bold text-textMain hover:bg-background min-h-[44px]"
              >
                ↻ Replay Journey
              </button>
            )}
          </div>
        </div>
      </div>

      {/* End Payoff Banner (Lit whole path) */}
      {isLastStage && (
        <div className="bg-statusSuccess/15 border border-statusSuccess/40 rounded-card p-3.5 flex items-center justify-between z-10 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-statusSuccess text-white flex items-center justify-center font-black text-sm">
              ✓
            </span>
            <div>
              <h4 className="text-sm font-black text-textMain">
                &ldquo;Five different people worked together before this reached you.&rdquo;
              </h4>
              <p className="text-xs text-textMuted">
                From natural harvest to highway transport, factory weaving, and shop shelves — you have traced the full chain!
              </p>
            </div>
          </div>
          <button
            onClick={handleGoToWhatIf}
            className="px-5 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5"
          >
            <span>DISCOVER WHAT IF?</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
