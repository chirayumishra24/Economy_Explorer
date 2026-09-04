import React, { useState, useEffect, useRef } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { SCENARIOS } from '../../../data/scenarios';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { NodeIconRenderer } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';
import { EconomySandbox } from './EconomySandbox';

export const WhatIfLab: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [activeTab, setActiveTab] = useState<'scenarios' | 'sandbox'>('scenarios');
  const [selectedScenarioId, setSelectedScenarioId] = useState('scenario-transport-blocked');
  const [reasoningChoice, setReasoningChoice] = useState<string | null>(null);
  const [activeRippleOrder, setActiveRippleOrder] = useState<number>(0);

  const rippleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const lang = state.language;

  // Freeze state occurs whenever a scenario is selected but not yet run
  const isFrozen = !state.simulationRunning && !state.simulationFinished;


  const handleSelectScenario = (id: string) => {
    sound.playClick();
    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    setSelectedScenarioId(id);
    setReasoningChoice(null);
    setActiveRippleOrder(0);
    dispatch({ type: 'SET_SCENARIO', scenarioId: id });
  };

  const handleSelectPrediction = (predId: string) => {
    if (state.predictionLocked) return;
    sound.playClick();
    dispatch({ type: 'SET_PREDICTION', predictionId: predId });
  };

  const handleLockAndRun = () => {
    if (!state.predictionId) return;
    sound.playMachineStart();
    dispatch({ type: 'LOCK_PREDICTION' });
    dispatch({ type: 'START_SIMULATION' });

    // Staged 400ms ripple propagation
    const maxOrder = Math.max(...scenario.ripple.map(r => r.order), 4);
    let step = 1;

    const runNextStep = () => {
      if (step <= maxOrder) {
        setActiveRippleOrder(step);
        sound.playProductMove();
        step++;
        rippleTimerRef.current = setTimeout(runNextStep, state.reducedMotion ? 50 : 600);
      } else {
        // Simulation settled
        dispatch({ type: 'FINISH_SIMULATION' });
        sound.playChallengeComplete();
        if (!state.completedStops.includes('what-if')) {
          dispatch({ type: 'COMPLETE_STOP', stop: 'what-if' });
        }
      }
    };

    rippleTimerRef.current = setTimeout(runNextStep, 300);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, []);

  const handleReasoningSelect = (isCorrect: boolean, key: string) => {
    if (reasoningChoice !== null) return; // Locked after selection
    sound.playClick();
    setReasoningChoice(key);
    dispatch({ type: 'RECORD_REASONING_ATTEMPT', isCorrect });
  };

  const handleTryAnother = () => {
    sound.playClick();
    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    setReasoningChoice(null);
    setActiveRippleOrder(0);
    dispatch({ type: 'SET_SCENARIO', scenarioId: selectedScenarioId });
  };

  const handleGoToFix = () => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'fix-economy' });
  };

  const selectedPred = scenario.predictions.find(p => p.id === state.predictionId);
  const wasPredictionCorrect = selectedPred?.correct === true;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Mode Navigation Tab (Scenarios vs Sandbox) */}
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-btn border border-border shadow-soft">
          <button
            onClick={() => { sound.playClick(); setActiveTab('scenarios'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
              activeTab === 'scenarios'
                ? 'bg-textMain text-surface shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            <span>⚡</span>
            <span>{lang === 'hi' ? 'संकट परिदृश्य (Scenarios)' : 'Disruption Scenarios'}</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('sandbox'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
              activeTab === 'sandbox'
                ? 'bg-accentOrange text-surface shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            <span>🎛️</span>
            <span>{lang === 'hi' ? 'लाइव सैंडबॉक्स (Sandbox)' : 'Live Economy Sandbox'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'sandbox' ? (
        <div className="flex-1 w-full overflow-hidden">
          <EconomySandbox />
        </div>
      ) : (
        <>
          {/* Top Bar: Scenario Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-card p-3 shadow-soft z-20 shrink-0">
            <div>
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">
                {lang === 'hi' ? 'चरण 1: संकट परिदृश्य चुनें' : 'Step 1: Choose a Disruption Scenario'}
              </span>

          <div className="flex items-center gap-2 mt-1">
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all min-h-[44px] ${
                  sc.id === selectedScenarioId
                    ? 'bg-statusDisrupted text-white shadow-soft scale-105'
                    : 'bg-background hover:bg-border/60 text-textMuted border border-border'
                }`}
              >
                {sc.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Status Badge */}
        <div className="flex items-center gap-2">
          {isFrozen && (
            <div className="px-3 py-1 bg-border/50 rounded-full text-xs font-bold text-textMuted flex items-center gap-1.5 border border-border animate-pulse">
              <span>❄️</span>
              <span>Machine Frozen — Predict First</span>
            </div>
          )}
          {state.simulationRunning && (
            <div className="px-3 py-1 bg-statusDisrupted/20 text-statusDisrupted rounded-full text-xs font-bold flex items-center gap-1.5 border border-statusDisrupted/40">
              <span className="animate-spin">⚡</span>
              <span>Ripple Travelling...</span>
            </div>
          )}
          {state.simulationFinished && (
            <div className="px-3 py-1 bg-statusSuccess/15 text-statusSuccess rounded-full text-xs font-bold flex items-center gap-1.5 border border-statusSuccess/40">
              <span>✓</span>
              <span>Ripple Settled</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="bg-background/80 border border-border/80 rounded-btn px-3 py-1.5 mt-2 flex items-center justify-between text-xs text-textMuted z-10">
        <div className="flex items-center gap-2">
          <span className="text-accentYellow font-bold">💡 How to Play:</span>
          <span>Pick a disruption above, select and lock your prediction, then click [RUN THE ECONOMY] to watch consequences ripple across connected activities.</span>
        </div>
      </div>

      {/* Arena: Machine View (Desaturates when Frozen, Staged Ripple during Run) */}
      <div className={`relative flex-1 w-full my-2 rounded-card border border-border p-4 shadow-soft flex flex-col justify-between overflow-hidden transition-all duration-500 ${
        isFrozen ? 'bg-background/90 grayscale contrast-75' : 'bg-surface'
      }`}>
        {/* Scenario description banner */}
        <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-statusDisrupted uppercase tracking-wide">Trigger:</span>
            <span className="text-textMain font-medium">{scenario.trigger}</span>
          </div>
          {state.simulationFinished && (
            <span className="text-statusDisrupted font-black tracking-wide text-xs">
              LOOK WHAT CHANGED
            </span>
          )}
        </div>

        {/* Graph representation of nodes involved */}
        <div className="flex-1 flex items-center justify-around px-4 my-auto relative">
          {scenario.affectedIds.map((nodeId) => {
            const node = ECONOMIC_NODES.find(n => n.id === nodeId);
            if (!node) return null;

            const rippleInfo = scenario.ripple.find(r => r.nodeId === nodeId);
            const isAffectedByRipple = state.simulationRunning && (rippleInfo?.order || 1) <= activeRippleOrder;
            const isFinishedRipple = state.simulationFinished;

            return (
              <div key={nodeId} className="flex flex-col items-center text-center max-w-[150px] relative z-10">
                <div
                  className={`w-16 h-16 rounded-card border-2 flex items-center justify-center transition-all duration-400 ${
                    isAffectedByRipple || isFinishedRipple
                      ? 'bg-statusDisrupted/15 border-statusDisrupted shadow-lift scale-105 ripple-disrupted text-statusDisrupted'
                      : isFrozen
                      ? 'bg-surface border-border text-textMuted'
                      : 'bg-surface border-border/80 text-textMain'
                  }`}
                >
                  <NodeIconRenderer name={node.icon} size={28} />
                </div>
                <span className="text-xs font-bold text-textMain mt-1.5 leading-tight">{node.label}</span>
                <span className="text-[11px] text-textMuted">{node.who.split(',')[0]}</span>

                {/* Staged Ripple Effect Notification */}
                {(isAffectedByRipple || isFinishedRipple) && rippleInfo && (
                  <div className="mt-1 text-[11px] font-semibold text-statusDisrupted bg-statusDisrupted/10 border border-statusDisrupted/30 rounded px-2 py-0.5 animate-in fade-in">
                    {rippleInfo.effect}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PRE-RUN STEP: Prediction prompt (Machine is frozen until student predicts & runs) */}
        {isFrozen && (
          <div className="bg-surface border-2 border-accentYellow rounded-card p-4 shadow-lift z-20">
            <h3 className="text-base font-black text-textMain mb-1">
              What do you think will happen?
            </h3>
            <p className="text-xs text-textMuted mb-3">
              Lock in your prediction before starting the simulation. First attempt earns 20 points!
            </p>

            {/* 3 Predictions (1 correct, 2 plausible wrong) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
              {scenario.predictions.map((pred) => {
                const isSelected = state.predictionId === pred.id;
                return (
                  <button
                    key={pred.id}
                    onClick={() => handleSelectPrediction(pred.id)}
                    className={`p-3 rounded-btn text-left text-xs font-medium border-2 transition-all min-h-[44px] ${
                      isSelected
                        ? 'bg-accentYellow/20 border-accentYellow font-bold text-textMain ring-2 ring-accentYellow/30'
                        : 'bg-background hover:bg-border/60 border-border text-textMain'
                    }`}
                  >
                    {pred.text}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleLockAndRun}
                disabled={!state.predictionId}
                className={`px-6 py-2.5 rounded-btn font-bold text-sm min-h-[44px] flex items-center gap-2 shadow-soft transition-all ${
                  state.predictionId
                    ? 'bg-accentYellow hover:brightness-105 text-textMain cursor-pointer active:scale-95'
                    : 'bg-border/40 text-textMuted/50 cursor-not-allowed'
                }`}
              >
                <span>⚡ RUN THE ECONOMY</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* POST-RUN LEARNING CARD: You Observed / Why it happened / Key Idea */}
        {state.simulationFinished && (
          <div className="bg-surface border border-border rounded-card p-4 shadow-lift z-20 animate-in fade-in slide-in-from-bottom-2">
            {/* Prediction Evaluation Feedback */}
            <div className={`p-2.5 rounded-btn mb-3 flex items-center justify-between text-xs font-bold ${
              wasPredictionCorrect
                ? 'bg-statusSuccess/15 text-statusSuccess border border-statusSuccess/30'
                : 'bg-statusWarning/15 text-textMain border border-statusWarning/30'
            }`}>
              <div className="flex items-center gap-2">
                <span>{wasPredictionCorrect ? '✓ Prediction Correct!' : '💡 Let\'s Reflect on What Happened'}</span>
                <span className="font-normal text-textMuted">
                  {wasPredictionCorrect ? '(+20 Prediction points earned)' : selectedPred?.whyNot}
                </span>
              </div>
            </div>

            {/* Structured 3-Card Summary (<= 45 words per block) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="text-[11px] font-black text-statusDisrupted uppercase tracking-wider block">
                  YOU OBSERVED
                </span>
                <p className="text-sm text-textMain mt-1 leading-snug">
                  {scenario.observed}
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="text-[11px] font-black text-sectorTertiary uppercase tracking-wider block">
                  THIS HAPPENED BECAUSE
                </span>
                <p className="text-sm text-textMain mt-1 leading-snug">
                  {scenario.whyItHappened}
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="text-[11px] font-black text-sectorPrimary uppercase tracking-wider block">
                  KEY IDEA
                </span>
                <p className="text-sm text-textMain mt-1 font-bold leading-snug">
                  {scenario.keyIdea}
                </p>
              </div>
            </div>

            {/* Reasoning check (Anti-random-clicking, machine-checkable) */}
            {reasoningChoice === null && (
              <div className="p-3 rounded-btn bg-accentYellow/10 border border-accentYellow/40 mb-3">
                <span className="text-xs font-bold text-textMain block mb-1.5">
                  Why does a breakdown in one activity affect workers in other sectors?
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleReasoningSelect(true, 'opt-interdependent')}
                    className="p-2 text-left text-xs bg-surface border border-border rounded-btn hover:bg-border/40 text-textMain"
                  >
                    Because sectors are interdependent: factories need primary raw materials and tertiary transport.
                  </button>
                  <button
                    onClick={() => handleReasoningSelect(false, 'opt-money')}
                    className="p-2 text-left text-xs bg-surface border border-border rounded-btn hover:bg-border/40 text-textMain"
                  >
                    Because machines immediately transform into living plants.
                  </button>
                  <button
                    onClick={() => handleReasoningSelect(false, 'opt-isolated')}
                    className="p-2 text-left text-xs bg-surface border border-border rounded-btn hover:bg-border/40 text-textMain"
                  >
                    Because each person works completely alone without ever trading goods.
                  </button>
                </div>
              </div>
            )}

            {reasoningChoice !== null && (
              <div className="p-2 rounded-btn bg-statusSuccess/15 text-statusSuccess border border-statusSuccess/30 text-xs font-bold mb-3 flex items-center justify-between">
                <span>
                  {!wasPredictionCorrect ? "You changed your mind for the right reason — that's how scientists work!" : "Great reasoning! You understood how sectors rely on each other."}
                </span>
                <span>(+20 Reasoning points)</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={handleTryAnother}
                className="px-4 py-2 rounded-btn border border-border bg-surface text-xs font-bold text-textMain hover:bg-background min-h-[44px]"
              >
                ↻ Try Another Disruption
              </button>
              <button
                onClick={handleGoToFix}
                className="px-5 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5 active:scale-95"
              >
                <span>CONTINUE TO FIX THE ECONOMY</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
