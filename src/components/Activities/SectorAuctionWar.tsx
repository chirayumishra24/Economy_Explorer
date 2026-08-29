'use client';

import React, { useState, useEffect } from 'react';
import {
  Gavel,
  ArrowLeft,
  Sprout,
  Factory,
  Truck,
  CheckCircle2,
  XCircle,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { AUCTION_ITEMS } from '../../data/activityGameData';
import { Team, AuctionItem, EconomicSector } from '../../types/economy';
import { ScoreBoard } from '../shared/ScoreBoard';
import { sound } from '../../utils/soundEffects';

interface SectorAuctionWarProps {
  teams: [Team, Team];
  onUpdateScore: (teamIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

const TOTAL_ROUNDS = 8;
const INITIAL_BUDGET = 1000;

const SECTOR_META: Record<
  EconomicSector,
  { label: string; icon: React.ReactNode; bg: string; border: string; text: string }
> = {
  primary: {
    label: 'Primary Sector',
    icon: <Sprout className="w-4 h-4" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700'
  },
  secondary: {
    label: 'Secondary Sector',
    icon: <Factory className="w-4 h-4" />,
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700'
  },
  tertiary: {
    label: 'Tertiary Sector',
    icon: <Truck className="w-4 h-4" />,
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700'
  }
};

export function SectorAuctionWar({ teams, onUpdateScore, onEndGame, onBack }: SectorAuctionWarProps) {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [round, setRound] = useState(0);
  const [budgets, setBudgets] = useState<[number, number]>([INITIAL_BUDGET, INITIAL_BUDGET]);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [wonItems, setWonItems] = useState<[AuctionItem[], AuctionItem[]]>([[], []]);

  // Phase: 'bidding' | 'reveal' | 'classifying' | 'outcome'
  const [phase, setPhase] = useState<'bidding' | 'reveal' | 'classifying' | 'outcome'>('bidding');
  const [bids, setBids] = useState<[number, number]>([100, 100]);
  const [readyTeams, setReadyTeams] = useState<[boolean, boolean]>([false, false]);
  const [winnerTeamIdx, setWinnerTeamIdx] = useState<0 | 1 | null>(null);
  const [selectedSector, setSelectedSector] = useState<EconomicSector | null>(null);
  const [outcomeData, setOutcomeData] = useState<{
    success: boolean;
    pointsEarned: number;
    explanation: string;
  } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const shuffled = [...AUCTION_ITEMS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setItems(shuffled);
  }, []);

  const currentItem = items[round];

  const handleSetBid = (teamIdx: 0 | 1, value: number) => {
    const maxAllowed = budgets[teamIdx];
    const clamped = Math.min(Math.max(50, value), maxAllowed);
    setBids(prev => {
      const next = [...prev] as [number, number];
      next[teamIdx] = clamped;
      return next;
    });
  };

  const toggleReady = (teamIdx: 0 | 1) => {
    const newReady = [...readyTeams] as [boolean, boolean];
    newReady[teamIdx] = !newReady[teamIdx];
    setReadyTeams(newReady);

    // If both ready, advance to reveal
    if (newReady[0] && newReady[1]) {
      revealAuction();
    }
  };

  const revealAuction = () => {
    sound.playGavel();
    setPhase('reveal');
    const [b1, b2] = bids;
    let winner: 0 | 1 = 0;
    if (b1 === b2) {
      // Tie breaker by remaining budget or random
      winner = budgets[0] >= budgets[1] ? 0 : 1;
    } else {
      winner = b1 > b2 ? 0 : 1;
    }
    setWinnerTeamIdx(winner);

    setTimeout(() => {
      setPhase('classifying');
    }, 1500);
  };

  const handleClassification = (sector: EconomicSector) => {
    if (winnerTeamIdx === null || !currentItem) return;
    setSelectedSector(sector);

    const isCorrect = sector === currentItem.correctSector;
    const winningBid = bids[winnerTeamIdx];

    // Deduct winning bid from winner budget
    const newBudgets = [...budgets] as [number, number];
    newBudgets[winnerTeamIdx] = Math.max(0, newBudgets[winnerTeamIdx] - winningBid);
    setBudgets(newBudgets);

    const newScores = [...scores] as [number, number];
    const newWon = [...wonItems] as [AuctionItem[], AuctionItem[]];

    if (isCorrect) {
      sound.playCorrect();
      sound.playCoin();
      const earned = Math.round(currentItem.baseValue + winningBid / 5);
      newScores[winnerTeamIdx] += earned;
      newWon[winnerTeamIdx] = [...newWon[winnerTeamIdx], currentItem];
      setScores(newScores);
      setWonItems(newWon);
      onUpdateScore(winnerTeamIdx, earned);

      setOutcomeData({
        success: true,
        pointsEarned: earned,
        explanation: `Spot on! "${currentItem.name}" directly belongs to the ${SECTOR_META[sector].label}.`
      });
    } else {
      sound.playWrong();
      // Penalty: deduct 50 points
      const penalty = 50;
      newScores[winnerTeamIdx] = Math.max(0, newScores[winnerTeamIdx] - penalty);
      setScores(newScores);
      onUpdateScore(winnerTeamIdx, -penalty);

      setOutcomeData({
        success: false,
        pointsEarned: -penalty,
        explanation: `Incorrect! "${currentItem.name}" is actually part of the ${SECTOR_META[currentItem.correctSector].label}. Bid currency was spent!`
      });
    }

    setPhase('outcome');
  };

  const handleNextRound = () => {
    sound.playClick();
    if (round + 1 >= TOTAL_ROUNDS || round + 1 >= items.length) {
      sound.playVictory();
      // End game
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

    setRound(prev => prev + 1);
    setPhase('bidding');
    setReadyTeams([false, false]);
    setWinnerTeamIdx(null);
    setSelectedSector(null);
    setOutcomeData(null);
    // Reset default bids based on remaining budget
    setBids([
      Math.min(100, Math.max(50, budgets[0])),
      Math.min(100, Math.max(50, budgets[1]))
    ]);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Sector Auction War</h1>
          <p className="text-gray-500 mb-4">
            Bid virtual currency on economic activities, win the item, and classify its sector correctly!
          </p>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-sm text-gray-700 space-y-2 mb-6 text-left">
            <p className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Each team starts with <strong>₹{INITIAL_BUDGET}</strong> virtual budget.</span>
            </p>
            <p className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Secretly submit your bid for each economic asset.</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Winning bidder must classify: <strong>Primary, Secondary, or Tertiary</strong>.</span>
            </p>
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>Correct = points earned! Incorrect = money spent + point penalty.</span>
            </p>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Enter the Auction Floor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      <ScoreBoard
        teams={[
          { ...teams[0], score: scores[0] },
          { ...teams[1], score: scores[1] }
        ]}
        roundNumber={round + 1}
        totalRounds={TOTAL_ROUNDS}
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col items-center">
        {/* Top bar with back & round info */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teams[0].color }} />
              {teams[0].name}: <strong className="text-gray-900">₹{budgets[0]}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teams[1].color }} />
              {teams[1].name}: <strong className="text-gray-900">₹{budgets[1]}</strong>
            </span>
          </div>
        </div>

        {/* Item Card on Auction */}
        {currentItem && (
          <div className="w-full max-w-lg bg-white rounded-3xl border border-amber-200 shadow-elevated p-6 text-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Lot #{round + 1}
            </div>

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-3 shadow-soft">
              <Gavel className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">{currentItem.name}</h2>
            <p className="text-sm text-gray-600 max-w-sm mx-auto mb-3">{currentItem.description}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
              <Coins className="w-3.5 h-3.5 text-amber-500" /> Base Value: ₹{currentItem.baseValue}
            </div>
          </div>
        )}

        {/* PHASE 1: BIDDING */}
        {phase === 'bidding' && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map(idx => {
              const team = teams[idx];
              const budget = budgets[idx];
              const isReady = readyTeams[idx];
              const bidVal = bids[idx];

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all shadow-card ${
                    isReady ? 'border-emerald-400 bg-emerald-50/20' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team.color }} />
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    </div>
                    <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 font-medium">
                      Budget: ₹{budget}
                    </span>
                  </div>

                  {!isReady ? (
                    <div>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Your Secret Bid:</span>
                          <span className="font-bold text-base text-gray-900">₹{bidVal}</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={Math.max(50, budget)}
                          step={25}
                          value={bidVal}
                          onChange={e => handleSetBid(idx as 0 | 1, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>₹50</span>
                          <span>Max: ₹{budget}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 mb-4">
                        {[50, 100, 200, 300].map(amt => (
                          <button
                            key={amt}
                            onClick={() => handleSetBid(idx as 0 | 1, amt)}
                            disabled={budget < amt}
                            className="py-1 text-xs font-semibold rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-30"
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleReady(idx as 0 | 1)}
                        className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        Lock Bid in Secret 🔒
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce-once" />
                      <p className="text-sm font-semibold text-emerald-700">Bid Locked!</p>
                      <p className="text-xs text-gray-400">Waiting for other team...</p>
                      <button
                        onClick={() => toggleReady(idx as 0 | 1)}
                        className="text-xs text-gray-500 hover:underline pt-2"
                      >
                        Unlock & Change
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PHASE 2: REVEAL */}
        {phase === 'reveal' && winnerTeamIdx !== null && (
          <div className="w-full max-w-md bg-white rounded-2xl p-6 text-center border border-amber-300 shadow-elevated animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Gavel Falls! 🔨</h3>
            <div className="flex justify-around items-center mb-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">{teams[0].name}</p>
                <p className="text-2xl font-bold text-gray-900">₹{bids[0]}</p>
              </div>
              <span className="text-xl font-bold text-gray-300">vs</span>
              <div className="text-center">
                <p className="text-xs text-gray-500">{teams[1].name}</p>
                <p className="text-2xl font-bold text-gray-900">₹{bids[1]}</p>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm font-bold text-amber-800">
                🎉 {teams[winnerTeamIdx].name} won the lot with ₹{bids[winnerTeamIdx]}!
              </p>
            </div>
          </div>
        )}

        {/* PHASE 3: CLASSIFYING */}
        {phase === 'classifying' && winnerTeamIdx !== null && currentItem && (
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border-2 border-ncert-blue-100 shadow-elevated animate-scale-in">
            <div className="text-center mb-5">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
                style={{ backgroundColor: teams[winnerTeamIdx].color }}
              >
                {teams[winnerTeamIdx].name}'s Turn to Classify
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Which sector does "{currentItem.name}" belong to?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Classify correctly to claim this asset and bank big points!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {(['primary', 'secondary', 'tertiary'] as EconomicSector[]).map(sector => {
                const meta = SECTOR_META[sector];
                return (
                  <button
                    key={sector}
                    onClick={() => handleClassification(sector)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all hover:scale-105 active:scale-95 ${meta.bg} ${meta.border} ${meta.text}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/80 mx-auto flex items-center justify-center mb-2 shadow-sm">
                      {meta.icon}
                    </div>
                    <span className="font-bold text-xs block">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 4: OUTCOME */}
        {phase === 'outcome' && outcomeData && (
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-elevated animate-scale-in">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3">
              {outcomeData.success ? (
                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
              ) : (
                <XCircle className="w-14 h-14 text-rose-500" />
              )}
            </div>

            <h3
              className={`text-xl font-bold mb-1 ${
                outcomeData.success ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {outcomeData.success
                ? `Asset Secured! (+${outcomeData.pointsEarned} pts)`
                : `Lost Opportunity! (${outcomeData.pointsEarned} pts)`}
            </h3>

            <p className="text-sm text-gray-600 mb-6 px-2">{outcomeData.explanation}</p>

            <button
              onClick={handleNextRound}
              className="w-full py-3 rounded-xl bg-ncert-blue text-white font-semibold hover:bg-ncert-blue-dark transition-all active:scale-[0.98]"
            >
              {round + 1 >= TOTAL_ROUNDS ? 'View Final Results 🏆' : 'Next Lot →'}
            </button>
          </div>
        )}

        {/* Team Asset Showcase at Bottom */}
        <div className="w-full max-w-4xl grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
          {[0, 1].map(idx => (
            <div key={idx} className="bg-white/60 backdrop-blur rounded-xl p-3 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {teams[idx].name}'s Assets ({wonItems[idx].length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {wonItems[idx].length === 0 ? (
                  <span className="text-[11px] text-gray-400 italic">No assets acquired yet</span>
                ) : (
                  wonItems[idx].map(item => (
                    <span
                      key={item.id}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                        SECTOR_META[item.correctSector].bg
                      } ${SECTOR_META[item.correctSector].text} ${SECTOR_META[item.correctSector].border}`}
                    >
                      {item.name}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
