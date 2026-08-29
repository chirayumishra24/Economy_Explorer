'use client';

import React, { useState } from 'react';
import {
  Link,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Flame,
  Shirt,
  Cookie,
  Bike,
  Milk,
  Boxes
} from 'lucide-react';
import { SUPPLY_CHAIN_CHALLENGES } from '../../data/activityGameData';
import { Team, SupplyChainChallenge, EconomicSector } from '../../types/economy';
import { ScoreBoard } from '../shared/ScoreBoard';
import { sound } from '../../utils/soundEffects';

interface SupplyChainRelayProps {
  teams: [Team, Team];
  onUpdateScore: (teamIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  Shirt: <Shirt className="w-8 h-8" />,
  Cookie: <Cookie className="w-8 h-8" />,
  Bike: <Bike className="w-8 h-8" />,
  Milk: <Milk className="w-8 h-8" />,
  Boxes: <Boxes className="w-8 h-8" />
};

const SECTOR_BADGE: Record<EconomicSector, { label: string; style: string }> = {
  primary: { label: 'Primary', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  secondary: { label: 'Secondary', style: 'bg-amber-100 text-amber-800 border-amber-300' },
  tertiary: { label: 'Tertiary', style: 'bg-purple-100 text-purple-800 border-purple-300' }
};

export function SupplyChainRelay({ teams, onUpdateScore, onEndGame, onBack }: SupplyChainRelayProps) {
  const [challenges] = useState<SupplyChainChallenge[]>(SUPPLY_CHAIN_CHALLENGES);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);

  // Game flow state
  const [placedStages, setPlacedStages] = useState<(typeof SUPPLY_CHAIN_CHALLENGES[0]['stages'][0] | null)[]>([
    null,
    null,
    null,
    null,
    null
  ]);
  const [availableStages, setAvailableStages] = useState<typeof SUPPLY_CHAIN_CHALLENGES[0]['stages']>([]);
  const [currentTurnTeam, setCurrentTurnTeam] = useState<0 | 1>(0);
  const [nextSlotIdx, setNextSlotIdx] = useState(0);
  const [isStealMode, setIsStealMode] = useState(false);
  const [stageFeedback, setStageFeedback] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  // Disruption round phase: 'sequencing' | 'disruption' | 'challengeSummary'
  const [phase, setPhase] = useState<'sequencing' | 'disruption' | 'challengeSummary'>('sequencing');
  const [selectedDisruptionOpt, setSelectedDisruptionOpt] = useState<number | null>(null);
  const [disruptionTeam, setDisruptionTeam] = useState<0 | 1 | null>(null);
  const [disruptionFeedback, setDisruptionFeedback] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const currentChallenge = challenges[challengeIdx];

  const initChallenge = (idx: number) => {
    const c = challenges[idx];
    // Scramble the stages
    const scrambled = [...c.stages].sort(() => Math.random() - 0.5);
    setAvailableStages(scrambled);
    setPlacedStages([null, null, null, null, null]);
    setNextSlotIdx(0);
    setIsStealMode(false);
    setStageFeedback(null);
    setPhase('sequencing');
    setSelectedDisruptionOpt(null);
    setDisruptionTeam(null);
    setDisruptionFeedback(null);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    initChallenge(0);
  };

  const handleStageSelect = (stageId: string) => {
    if (phase !== 'sequencing') return;

    const selected = availableStages.find(s => s.id === stageId);
    if (!selected) return;

    const targetOrder = nextSlotIdx + 1;
    const isCorrect = selected.correctOrder === targetOrder;
    const activeTeam = isStealMode ? ((1 - currentTurnTeam) as 0 | 1) : currentTurnTeam;

    if (isCorrect) {
      // Stage placed correctly
      const newPlaced = [...placedStages];
      newPlaced[nextSlotIdx] = selected;
      setPlacedStages(newPlaced);
      setAvailableStages(prev => prev.filter(s => s.id !== stageId));

      const points = isStealMode ? 15 : 10;
      const newScores = [...scores] as [number, number];
      newScores[activeTeam] += points;
      setScores(newScores);
      onUpdateScore(activeTeam, points);
      sound.playCorrect();

      setStageFeedback({
        success: true,
        text: isStealMode
          ? `⚡ ${teams[activeTeam].name} STOLE the step for +15 pts!`
          : `✅ ${teams[activeTeam].name} placed Step ${targetOrder} correctly (+10 pts)!`
      });

      const nextSlot = nextSlotIdx + 1;
      setNextSlotIdx(nextSlot);
      setIsStealMode(false);

      if (nextSlot >= 5) {
        // Completed all 5 stages! Move to Disruption bonus round
        setTimeout(() => {
          sound.playCoin();
          setStageFeedback(null);
          setPhase('disruption');
        }, 1500);
      } else {
        // Toggle turn for next slot
        setTimeout(() => {
          setStageFeedback(null);
          setCurrentTurnTeam(prev => ((1 - prev) as 0 | 1));
        }, 1200);
      }
    } else {
      // Incorrect placement
      sound.playWrong();
      if (!isStealMode) {
        // Give opponent steal chance
        setIsStealMode(true);
        setStageFeedback({
          success: false,
          text: `❌ Not Step ${targetOrder}! ${teams[(1 - currentTurnTeam) as 0 | 1].name} can steal (+15 pts)!`
        });
      } else {
        // Steal failed as well, show correct answer or pass
        setStageFeedback({
          success: false,
          text: `❌ Both teams missed! Next team try again.`
        });
        setIsStealMode(false);
        setCurrentTurnTeam(prev => ((1 - prev) as 0 | 1));
      }
    }
  };

  const handleDisruptionAnswer = (teamIdx: 0 | 1, optionIdx: number) => {
    if (selectedDisruptionOpt !== null) return;

    setSelectedDisruptionOpt(optionIdx);
    setDisruptionTeam(teamIdx);

    const isCorrect = optionIdx === currentChallenge.disruptionCorrectIndex;
    const newScores = [...scores] as [number, number];

    if (isCorrect) {
      sound.playCorrect();
      newScores[teamIdx] += 20;
      setScores(newScores);
      onUpdateScore(teamIdx, 20);
      setDisruptionFeedback({
        success: true,
        text: `🎯 Brilliant analysis by ${teams[teamIdx].name}! (+20 pts)`
      });
    } else {
      sound.playWrong();
      newScores[teamIdx] = Math.max(0, newScores[teamIdx] - 5);
      setScores(newScores);
      onUpdateScore(teamIdx, -5);
      setDisruptionFeedback({
        success: false,
        text: `❌ Incorrect. The ripple effect breaks interdependent sectors.`
      });
    }

    setTimeout(() => {
      setPhase('challengeSummary');
    }, 2000);
  };

  const handleNextChallenge = () => {
    sound.playClick();
    if (challengeIdx + 1 >= challenges.length) {
      sound.playVictory();
      const winner =
        scores[0] > scores[1]
          ? teams[0].name
          : scores[1] > scores[0]
          ? teams[1].name
          : 'Tie';
      onEndGame(winner, [
        { name: teams[0].name, score: scores[0] },
        { name: teams[1].name, score: scores[1] }
      ]);
      return;
    }

    const nextIdx = challengeIdx + 1;
    setChallengeIdx(nextIdx);
    initChallenge(nextIdx);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Link className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Supply Chain Relay</h1>
          <p className="text-gray-500 mb-4">
            Connect raw materials to finished products! Race to assemble 5-stage value chains in proper sequence.
          </p>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-sm text-gray-700 space-y-2 mb-6 text-left">
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Teams alternate selecting the next logical stage in production.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Correct placement = <strong>+10 pts</strong>. Opponent steal = <strong>+15 pts</strong>!</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Bonus Round: Solve the <strong>Supply Disruption Challenge</strong> for +20 pts!</span>
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Start Relay Race
          </button>
        </div>
      </div>
    );
  }

  const activeTurnTeamIdx = isStealMode ? ((1 - currentTurnTeam) as 0 | 1) : currentTurnTeam;

  return (
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      <ScoreBoard
        teams={[
          { ...teams[0], score: scores[0] },
          { ...teams[1], score: scores[1] }
        ]}
        roundNumber={challengeIdx + 1}
        totalRounds={challenges.length}
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col items-center">
        {/* Top bar with back & Product info */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-800">
            {PRODUCT_ICONS[currentChallenge.icon] || <Boxes className="w-4 h-4" />}
            <span>Product: {currentChallenge.productName}</span>
          </div>
        </div>

        {/* Turn & Status Indicator */}
        {phase === 'sequencing' && (
          <div className="mb-6 text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-soft transition-all ${
                isStealMode ? 'animate-pulse bg-rose-500' : ''
              }`}
              style={{ backgroundColor: isStealMode ? undefined : teams[activeTurnTeamIdx].color }}
            >
              {isStealMode && <Flame className="w-3.5 h-3.5" />}
              {isStealMode
                ? `STEAL OPPORTUNITY: ${teams[activeTurnTeamIdx].name}`
                : `${teams[activeTurnTeamIdx].name}'s Turn to place Step ${nextSlotIdx + 1}`}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select the activity that occurs at <strong>Step {nextSlotIdx + 1}</strong> of the supply chain.
            </p>
          </div>
        )}

        {/* Feedback alert */}
        {stageFeedback && (
          <div
            className={`w-full max-w-lg mb-4 p-3 rounded-xl border text-center text-sm font-semibold animate-scale-in ${
              stageFeedback.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {stageFeedback.text}
          </div>
        )}

        {/* 5-Step Conveyor Belt (Slots) */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {[0, 1, 2, 3, 4].map(slotIdx => {
            const placed = placedStages[slotIdx];
            const isCurrentTarget = slotIdx === nextSlotIdx && phase === 'sequencing';

            return (
              <div
                key={slotIdx}
                className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between min-h-[140px] relative ${
                  placed
                    ? 'bg-white border-emerald-400 shadow-card'
                    : isCurrentTarget
                    ? 'bg-blue-50/50 border-blue-400 border-dashed animate-pulse'
                    : 'bg-gray-50/80 border-gray-200 border-dashed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      placed
                        ? 'bg-emerald-500 text-white'
                        : isCurrentTarget
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {slotIdx + 1}
                  </span>

                  {placed && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        SECTOR_BADGE[placed.sector].style
                      }`}
                    >
                      {placed.sector}
                    </span>
                  )}
                </div>

                {placed ? (
                  <p className="text-xs text-gray-800 font-medium leading-relaxed">{placed.text}</p>
                ) : (
                  <div className="text-center my-auto">
                    <p className="text-[11px] font-semibold text-gray-400">
                      {isCurrentTarget ? 'Drop Step Here' : `Step ${slotIdx + 1}`}
                    </p>
                  </div>
                )}

                {slotIdx < 4 && (
                  <div className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AVAILABLE STAGES TO SELECT */}
        {phase === 'sequencing' && (
          <div className="w-full max-w-3xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">
              Available Production Stages ({availableStages.length} remaining)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableStages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className="bg-white rounded-xl p-4 border border-gray-200 text-left hover:border-ncert-blue hover:shadow-card active:scale-[0.98] transition-all flex items-start justify-between gap-3 group"
                >
                  <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug group-hover:text-ncert-blue">
                    {stage.text}
                  </p>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border flex-shrink-0 ${
                      SECTOR_BADGE[stage.sector].style
                    }`}
                  >
                    {stage.sector}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 2: DISRUPTION BONUS ROUND */}
        {phase === 'disruption' && (
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-elevated animate-scale-in">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                <AlertTriangle className="w-4 h-4" />
                ⚡ BONUS ROUND: Supply Chain Shock (+20 pts)
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {currentChallenge.disruptionQuestion}
              </h3>
              <p className="text-xs text-gray-500 mt-1">First team to buzz in with the right analysis wins +20!</p>
            </div>

            {disruptionFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-center text-sm font-semibold ${
                  disruptionFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {disruptionFeedback.text}
              </div>
            )}

            <div className="space-y-2.5">
              {currentChallenge.disruptionOptions.map((opt, oIdx) => (
                <div key={oIdx} className="flex gap-2">
                  <button
                    onClick={() => handleDisruptionAnswer(0, oIdx)}
                    disabled={selectedDisruptionOpt !== null}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex-shrink-0 disabled:opacity-40"
                    style={{ backgroundColor: teams[0].color }}
                    title={`${teams[0].name} selects this`}
                  >
                    {teams[0].name.slice(0, 3)}
                  </button>

                  <div className="flex-1 p-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50">
                    {opt}
                  </div>

                  <button
                    onClick={() => handleDisruptionAnswer(1, oIdx)}
                    disabled={selectedDisruptionOpt !== null}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex-shrink-0 disabled:opacity-40"
                    style={{ backgroundColor: teams[1].color }}
                    title={`${teams[1].name} selects this`}
                  >
                    {teams[1].name.slice(0, 3)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 3: CHALLENGE SUMMARY */}
        {phase === 'challengeSummary' && (
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-elevated animate-scale-in">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Supply Chain Complete! 🎉
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              You successfully traced <strong>{currentChallenge.productName}</strong> across Primary, Secondary, and Tertiary sectors.
            </p>

            <button
              onClick={handleNextChallenge}
              className="w-full py-3 rounded-xl bg-ncert-blue text-white font-semibold hover:bg-ncert-blue-dark transition-all active:scale-[0.98]"
            >
              {challengeIdx + 1 >= challenges.length
                ? 'Finish Relay & View Trophy 🏆'
                : 'Next Product Chain →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
