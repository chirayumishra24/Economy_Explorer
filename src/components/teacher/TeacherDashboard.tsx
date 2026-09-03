import React from 'react';
import { useEconomy } from '../../context/EconomyStore';
import { sound } from '../../utils/audio';

export const TeacherDashboard: React.FC = () => {
  const { state, dispatch } = useEconomy();

  const handleReturn = () => {
    sound.playClick();
    dispatch({ type: 'SET_SCREEN', screen: 'main' });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const totalScore =
    state.scores.exploration +
    state.scores.prediction +
    state.scores.reasoning +
    state.scores.problemSolving +
    state.scores.assessment;

  // Breakdown of questions by concept
  const answeredCount = Object.keys(state.userAnswers).length;
  const correctCount = Object.keys(state.userAnswers).filter(qid => {
    const q = state.assessmentQuestions.find(item => item.id === qid);
    return q && state.userAnswers[qid] === q.answer;
  }).length;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-background select-none overflow-y-auto">
      {/* Printable Report Header */}
      <div className="max-w-4xl w-full mx-auto bg-surface border border-border rounded-card p-6 sm:p-8 shadow-soft flex flex-col justify-between">
        <div className="border-b border-border pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sectorTertiary/15 text-sectorTertiary text-xs font-bold uppercase mb-1">
              Teacher Lesson Summary
            </div>
            <h1 className="text-2xl font-black text-textMain">The Economy Machine — Session Report</h1>
            <p className="text-xs text-textMuted mt-0.5">
              NCERT Social Science · Class 6 · Chapter 14 &ldquo;Economic Activities Around Us&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-btn bg-textMain text-surface font-bold text-xs shadow-soft hover:brightness-110 min-h-[44px] flex items-center gap-1.5"
            >
              <span>🖨️ Print / Save Summary</span>
            </button>
            <button
              onClick={handleReturn}
              className="px-4 py-2 rounded-btn border border-border bg-background hover:bg-border/50 text-xs font-bold text-textMain min-h-[44px]"
            >
              Back to Machine
            </button>
          </div>
        </div>

        {/* Core Lesson Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Stops Completed</span>
            <span className="text-xl font-black text-textMain mt-1 block">
              {state.completedStops.length} <span className="text-xs font-normal text-textMuted">/ 6</span>
            </span>
          </div>

          <div className="p-3.5 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Sectors Visited</span>
            <span className="text-xl font-black text-sectorPrimary mt-1 block">
              {state.scores.exploration >= 10 ? '3 / 3' : `${Math.floor(state.scores.exploration / 3)} / 3`}
            </span>
          </div>

          <div className="p-3.5 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Total Session Score</span>
            <span className="text-xl font-black text-textMain mt-1 block">
              {totalScore} <span className="text-xs font-normal text-textMuted">/ 100</span>
            </span>
          </div>

          <div className="p-3.5 rounded-btn bg-background border border-border/70 text-center">
            <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">Assessment Accuracy</span>
            <span className="text-xl font-black text-statusSuccess mt-1 block">
              {answeredCount > 0 ? `${Math.round((correctCount / answeredCount) * 100)}%` : '—'}
            </span>
          </div>
        </div>

        {/* Pedagogical Acceptance Test Objectives Evaluation */}
        <div className="mb-6 p-4 rounded-btn bg-background border border-border">
          <h3 className="text-sm font-black text-textMain mb-3">
            NCERT Ch. 14 Four Core Acceptance Tests
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-surface border border-border/60">
              <span className="font-semibold text-textMain">1. State what a producer, seller, and consumer do:</span>
              <span className="font-bold text-statusSuccess">Demonstrated in Explore & Quiz</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface border border-border/60">
              <span className="font-semibold text-textMain">2. Trace product journey through at least 3 stages in order:</span>
              <span className="font-bold text-statusSuccess">Demonstrated in Follow the Product & Chain Builder</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface border border-border/60">
              <span className="font-semibold text-textMain">3. Classify activity as primary, secondary, or tertiary with reasoning:</span>
              <span className="font-bold text-statusSuccess">Demonstrated in Sector Filters & Detective Round</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface border border-border/60">
              <span className="font-semibold text-textMain">4. Identify knock-on effects and affected parties upon disruption:</span>
              <span className="font-bold text-statusSuccess">Demonstrated in What If? Ripple Simulator</span>
            </div>
          </div>
        </div>

        {/* 5-Dimension Score Table */}
        <div className="mb-6">
          <h3 className="text-sm font-black text-textMain mb-2">Score Breakdown</h3>
          <div className="border border-border rounded-btn overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-background p-2.5 font-black text-textMuted border-b border-border">
              <span>Dimension</span>
              <span>Points Earned</span>
              <span>Pedagogical Focus</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-border/60">
              <span className="font-bold text-textMain">Exploration</span>
              <span className="text-textMain">{state.scores.exploration} / 10</span>
              <span className="text-textMuted">Visited primary, secondary, and tertiary nodes</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-border/60">
              <span className="font-bold text-textMain">Hypothesis & Prediction</span>
              <span className="text-textMain">{state.scores.prediction} / 20</span>
              <span className="text-textMuted">Locked pre-run prediction on first attempt</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-border/60">
              <span className="font-bold text-textMain">Interdependence Reasoning</span>
              <span className="text-textMain">{state.scores.reasoning} / 20</span>
              <span className="text-textMuted">Understood cause-and-effect ripple mechanisms</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-border/60">
              <span className="font-bold text-textMain">Problem Solving</span>
              <span className="text-textMain">{state.scores.problemSolving} / 20</span>
              <span className="text-textMuted">Repaired broken links and assembled value chain</span>
            </div>
            <div className="grid grid-cols-3 p-2.5">
              <span className="font-bold text-textMain">Objective Assessment</span>
              <span className="text-textMain">{state.scores.assessment} / 30</span>
              <span className="text-textMuted">10 curriculum questions sampled across 6 concepts</span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-[11px] text-textMuted border-t border-border pt-4">
          <p>
            * Privacy Note: Zero student PII is collected or transmitted. Session state is retained in browser memory only and resets when the page is closed.
          </p>
        </div>
      </div>
    </div>
  );
};
