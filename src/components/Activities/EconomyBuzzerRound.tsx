'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, ArrowLeft, Sprout, Factory, Truck, Package, HandHelping, Bot, Keyboard } from 'lucide-react';
import { BUZZER_SCENARIOS } from '../../data/activityGameData';
import { Player, BuzzerScenario, EconomicSector, OutputType } from '../../types/economy';
import { ScoreBoard } from '../shared/ScoreBoard';
import { sound } from '../../utils/soundEffects';

interface EconomyBuzzerRoundProps {
  players: [Player, Player];
  onUpdateScore: (playerIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

const SECTOR_ICONS: Record<EconomicSector, React.ReactNode> = {
  primary: <Sprout className="w-5 h-5" />,
  secondary: <Factory className="w-5 h-5" />,
  tertiary: <Truck className="w-5 h-5" />,
};

const SECTOR_STYLES: Record<EconomicSector, string> = {
  primary: 'bg-ncert-primarySector-bg border-ncert-primarySector-border text-ncert-primarySector',
  secondary: 'bg-ncert-secondarySector-bg border-ncert-secondarySector-border text-ncert-secondarySector',
  tertiary: 'bg-ncert-tertiarySector-bg border-ncert-tertiarySector-border text-ncert-tertiarySector',
};

export function EconomyBuzzerRound({ players, onUpdateScore, onEndGame, onBack }: EconomyBuzzerRoundProps) {
  const [scenarios, setScenarios] = useState<BuzzerScenario[]>([]);
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'buzzed' | 'answering' | 'feedback' | 'steal'>('intro');
  const [buzzedPlayer, setBuzzedPlayer] = useState<0 | 1 | null>(null);
  const [selectedSector, setSelectedSector] = useState<EconomicSector | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<OutputType | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ correct: boolean; points: number; explanation: string } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const shuffled = [...BUZZER_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setScenarios(shuffled);
  }, []);

  const currentScenario = scenarios[round];

  const showNewRound = useCallback(() => {
    setPhase('reveal');
    setBuzzedPlayer(null);
    setSelectedSector(null);
    setSelectedOutput(null);
    setFeedbackData(null);
  }, []);

  const handleBuzz = useCallback((playerIndex: 0 | 1) => {
    if (phase !== 'reveal') return;
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    sound.playBuzzer();
    setBuzzedPlayer(playerIndex);
    setPhase('answering');
  }, [phase]);

  const submitAnswer = useCallback(() => {
    if (buzzedPlayer === null || !selectedSector || !selectedOutput || !currentScenario) return;

    const sectorCorrect = selectedSector === currentScenario.correctSector;
    const outputCorrect = selectedOutput === currentScenario.correctOutputType;
    const bothCorrect = sectorCorrect && outputCorrect;
    const oneCorrect = sectorCorrect || outputCorrect;

    let points = 0;
    if (bothCorrect) points = 20;
    else if (oneCorrect) points = 10;
    else points = -10;

    const newScores = [...scores];
    newScores[buzzedPlayer] = Math.max(0, newScores[buzzedPlayer] + points);
    setScores(newScores);
    onUpdateScore(buzzedPlayer, points);

    if (bothCorrect || oneCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    if (!bothCorrect && !oneCorrect) {
      setFeedbackData({ correct: false, points, explanation: currentScenario.explanation });
      setPhase('steal');
    } else {
      setFeedbackData({ correct: bothCorrect, points, explanation: currentScenario.explanation });
      setPhase('feedback');
    }
  }, [buzzedPlayer, selectedSector, selectedOutput, currentScenario, scores, onUpdateScore]);

  const handleSteal = useCallback((stealSector: EconomicSector, stealOutput: OutputType) => {
    if (buzzedPlayer === null || !currentScenario) return;
    const otherPlayer = (1 - buzzedPlayer) as 0 | 1;
    const sectorOk = stealSector === currentScenario.correctSector;
    const outputOk = stealOutput === currentScenario.correctOutputType;

    if (sectorOk && outputOk) {
      const newScores = [...scores];
      newScores[otherPlayer] += 15;
      setScores(newScores);
      onUpdateScore(otherPlayer, 15);
      sound.playCorrect();
      setFeedbackData({ correct: true, points: 15, explanation: `${players[otherPlayer].name} steals! ${currentScenario.explanation}` });
    } else {
      sound.playWrong();
      setFeedbackData({ correct: false, points: 0, explanation: currentScenario.explanation });
    }
    setPhase('feedback');
  }, [buzzedPlayer, currentScenario, scores, players, onUpdateScore]);

  // AI Auto-Buzz in Reveal Phase
  useEffect(() => {
    if (phase !== 'reveal' || !players[1].isAI || !currentScenario) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const minDelay = botLevel === 'easy' ? 2600 : botLevel === 'medium' ? 1500 : 700;
    const randomExtra = Math.random() * (botLevel === 'easy' ? 1200 : 800);
    const totalDelay = minDelay + randomExtra;

    aiTimerRef.current = setTimeout(() => {
      if (phase === 'reveal') {
        handleBuzz(1);
      }
    }, totalDelay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [phase, players, currentScenario, handleBuzz]);

  // AI Auto-Answer when AI buzzes
  useEffect(() => {
    if (phase !== 'answering' || buzzedPlayer !== 1 || !players[1].isAI || !currentScenario) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const accuracy = botLevel === 'easy' ? 0.65 : botLevel === 'medium' ? 0.85 : 0.95;

    const timer = setTimeout(() => {
      const isAccurate = Math.random() < accuracy;
      const chosenSector: EconomicSector = isAccurate
        ? currentScenario.correctSector
        : (['primary', 'secondary', 'tertiary'] as EconomicSector[]).find(s => s !== currentScenario.correctSector)!;

      const chosenOutput: OutputType = isAccurate
        ? currentScenario.correctOutputType
        : currentScenario.correctOutputType === 'good' ? 'service' : 'good';

      setSelectedSector(chosenSector);
      setSelectedOutput(chosenOutput);

      setTimeout(() => {
        submitAnswer();
      }, 400);
    }, 900);

    return () => clearTimeout(timer);
  }, [phase, buzzedPlayer, players, currentScenario, submitAnswer]);

  // AI Auto-Steal if human misses
  useEffect(() => {
    if (phase !== 'steal' || buzzedPlayer !== 0 || !players[1].isAI || !currentScenario) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const accuracy = botLevel === 'easy' ? 0.6 : botLevel === 'medium' ? 0.85 : 0.95;

    const timer = setTimeout(() => {
      const isAccurate = Math.random() < accuracy;
      if (isAccurate) {
        handleSteal(currentScenario.correctSector, currentScenario.correctOutputType);
      } else {
        handleSteal(
          (['primary', 'secondary', 'tertiary'] as EconomicSector[]).find(s => s !== currentScenario.correctSector)!,
          currentScenario.correctOutputType === 'good' ? 'service' : 'good'
        );
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [phase, buzzedPlayer, players, currentScenario, handleSteal]);

  // Keyboard Hotkey Listener
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space or 'A' buzzes for Player 1
      if (phase === 'reveal') {
        if (e.code === 'Space' || e.key.toLowerCase() === 'a') {
          e.preventDefault();
          handleBuzz(0);
        } else if (!players[1].isAI && (e.code === 'Enter' || e.key.toLowerCase() === 'l')) {
          e.preventDefault();
          handleBuzz(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, phase, players, handleBuzz]);

  const nextRound = () => {
    sound.playClick();
    if (round + 1 >= TOTAL_ROUNDS || round + 1 >= scenarios.length) {
      sound.playVictory();
      const winner = scores[0] > scores[1] ? players[0].name : scores[1] > scores[0] ? players[1].name : 'Tie';
      onEndGame(winner, [
        { name: players[0].name, score: scores[0] },
        { name: players[1].name, score: scores[1] },
      ]);
      return;
    }
    setRound(prev => prev + 1);
    showNewRound();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Economy Buzzer Round</h1>
          <p className="text-gray-500 mb-4">A scenario appears — race to buzz first!</p>
          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 space-y-2 mb-6 text-left border border-gray-100">
            <p>⚡ <strong>Buzz first</strong> to get the answering floor</p>
            <p>🎯 <strong>Both Sector + Output correct</strong> = <span className="text-emerald-600 font-bold">+20 pts</span></p>
            <p>✅ <strong>One correct</strong> = <span className="text-blue-600 font-bold">+10 pts</span></p>
            <p>❌ <strong>Both wrong</strong> = <span className="text-red-500 font-bold">−10 pts</span> + opponent steal</p>
            <div className="pt-2 border-t border-gray-200">
              <p className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
                <Keyboard className="w-3.5 h-3.5 text-ncert-blue" /> Single-Keyboard Buzzer:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="p-1 rounded bg-blue-50 text-blue-700 font-medium">
                  {players[0].name}: <kbd className="px-1.5 py-0.5 bg-white rounded border">Space</kbd> or <kbd className="px-1 py-0.5 bg-white rounded border">A</kbd>
                </span>
                <span className="p-1 rounded bg-rose-50 text-rose-700 font-medium">
                  {players[1].name}: {players[1].isAI ? '🤖 Auto AI' : <><kbd className="px-1.5 py-0.5 bg-white rounded border">Enter</kbd> or <kbd className="px-1 py-0.5 bg-white rounded border">L</kbd></>}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); setGameStarted(true); showNewRound(); }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-base hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Start Buzzer Round! ⚡
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      <ScoreBoard
        players={[
          { name: players[0].name, score: scores[0] },
          { name: players[1].name, score: scores[1] },
        ]}
        roundNumber={round + 1}
        totalRounds={TOTAL_ROUNDS}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative max-w-4xl mx-auto w-full">
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className="absolute top-4 left-4 p-2 rounded-xl hover:bg-white text-gray-400 bg-white/60 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Scenario Card */}
        {currentScenario && phase !== 'feedback' && (
          <div className="bg-white rounded-3xl shadow-elevated border border-gray-100 p-6 sm:p-8 w-full max-w-lg text-center mb-6 animate-fade-in">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Round {round + 1} of {TOTAL_ROUNDS}</p>
            <p className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed mb-3">{currentScenario.description}</p>
            <div className="inline-block px-3 py-1 bg-blue-50 text-ncert-blue font-bold text-xs rounded-full border border-blue-100">
              Focus: {currentScenario.personOrItem}
            </div>
          </div>
        )}

        {/* Buzzer Phase */}
        {phase === 'reveal' && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg">
            {[0, 1].map(i => (
              <button
                key={i}
                onClick={() => handleBuzz(i as 0 | 1)}
                disabled={i === 1 && !!players[1].isAI}
                className={`py-12 rounded-3xl text-white font-bold text-xl shadow-elevated transition-all 
                  active:scale-90 hover:shadow-lg flex flex-col items-center justify-center ${
                    i === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-rose-500 to-rose-700'
                  }`}
              >
                <Zap className="w-12 h-12 mb-2 animate-bounce-slow" />
                <span>{players[i].name}</span>
                <span className="text-[11px] font-normal mt-1.5 opacity-80 uppercase tracking-wider">
                  {i === 0 ? 'Press [Space] or Tap' : players[1].isAI ? '🤖 Thinking...' : 'Press [Enter] or Tap'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Answering Phase */}
        {phase === 'answering' && buzzedPlayer !== null && (
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-elevated animate-scale-in">
            <p className="text-center text-sm font-bold text-gray-800 mb-4 flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className={buzzedPlayer === 0 ? 'text-blue-600' : 'text-rose-600'}>{players[buzzedPlayer].name}</span> buzzed in!
            </p>

            {/* Sector Selection */}
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">1. Select Sector</p>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {(['primary', 'secondary', 'tertiary'] as EconomicSector[]).map(s => (
                <button
                  key={s}
                  onClick={() => { sound.playClick(); setSelectedSector(s); }}
                  disabled={buzzedPlayer === 1 && !!players[1].isAI}
                  className={`py-3.5 rounded-2xl border-2 text-xs font-bold capitalize transition-all flex flex-col items-center gap-1 ${
                    selectedSector === s ? SECTOR_STYLES[s] + ' scale-105 shadow-soft' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {SECTOR_ICONS[s]}
                  <span>{s}</span>
                </button>
              ))}
            </div>

            {/* Output Selection */}
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">2. Good or Service?</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => { sound.playClick(); setSelectedOutput('good'); }}
                disabled={buzzedPlayer === 1 && !!players[1].isAI}
                className={`py-3.5 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedOutput === 'good' ? 'bg-emerald-50 border-emerald-400 text-emerald-800 scale-105' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600" /> Good
              </button>
              <button
                onClick={() => { sound.playClick(); setSelectedOutput('service'); }}
                disabled={buzzedPlayer === 1 && !!players[1].isAI}
                className={`py-3.5 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedOutput === 'service' ? 'bg-purple-50 border-purple-400 text-purple-800 scale-105' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <HandHelping className="w-4 h-4 text-purple-600" /> Service
              </button>
            </div>

            {buzzedPlayer === 0 ? (
              <button
                onClick={submitAnswer}
                disabled={!selectedSector || !selectedOutput}
                className="w-full py-3.5 rounded-xl bg-ncert-blue text-white font-semibold text-sm disabled:opacity-40 hover:bg-ncert-blue-dark transition-all active:scale-[0.98]"
              >
                Submit Answer
              </button>
            ) : (
              <div className="text-center text-xs text-purple-600 font-semibold animate-pulse">
                🤖 AI is choosing its answer...
              </div>
            )}
          </div>
        )}

        {/* Steal Phase */}
        {phase === 'steal' && buzzedPlayer !== null && currentScenario && (
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-elevated animate-scale-in">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-5 text-center">
              <p className="text-xs text-red-700 font-bold">❌ {players[buzzedPlayer].name} missed both! (−10 pts)</p>
              <p className="text-xs text-red-600 mt-1"><strong>{players[(1 - buzzedPlayer) as 0 | 1].name}</strong> can steal (+15 pts)!</p>
            </div>

            {(1 - buzzedPlayer) === 0 ? (
              <StealPanel
                otherPlayerName={players[0].name}
                onSteal={handleSteal}
                onSkip={() => {
                  setFeedbackData({ correct: false, points: 0, explanation: currentScenario.explanation });
                  setPhase('feedback');
                }}
              />
            ) : (
              <div className="text-center py-4 text-xs font-semibold text-purple-600 animate-pulse">
                🤖 AI is deciding whether to steal...
              </div>
            )}
          </div>
        )}

        {/* Feedback Phase */}
        {phase === 'feedback' && feedbackData && (
          <div className="w-full max-w-md text-center bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-elevated animate-scale-in">
            <div className={`rounded-2xl p-5 mb-5 ${feedbackData.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className="text-3xl mb-2">{feedbackData.correct ? '✅' : '💡'}</p>
              <p className={`font-bold text-lg ${feedbackData.correct ? 'text-emerald-700' : 'text-amber-800'}`}>
                {feedbackData.correct ? `+${feedbackData.points} Points!` : 'Incorrect Answer'}
              </p>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{feedbackData.explanation}</p>
              {currentScenario && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${SECTOR_STYLES[currentScenario.correctSector]}`}>
                    {currentScenario.correctSector}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                    {currentScenario.correctOutputType}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={nextRound}
              className="w-full py-3.5 rounded-xl bg-ncert-blue text-white font-semibold text-sm hover:bg-ncert-blue-dark transition-all active:scale-[0.98]"
            >
              {round + 1 >= TOTAL_ROUNDS ? 'See Final Scoreboard 🏆' : 'Next Scenario →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StealPanel({ otherPlayerName, onSteal, onSkip }: {
  otherPlayerName: string;
  onSteal: (sector: EconomicSector, output: OutputType) => void;
  onSkip: () => void;
}) {
  const [sector, setSector] = useState<EconomicSector | null>(null);
  const [output, setOutput] = useState<OutputType | null>(null);

  return (
    <div>
      <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Select Sector</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['primary', 'secondary', 'tertiary'] as EconomicSector[]).map(s => (
          <button key={s} onClick={() => { sound.playClick(); setSector(s); }}
            className={`py-2.5 rounded-xl border-2 text-xs font-bold capitalize transition-all ${
              sector === s ? SECTOR_STYLES[s] : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}>
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Good or Service?</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button onClick={() => { sound.playClick(); setOutput('good'); }}
          className={`py-2.5 rounded-xl border-2 text-xs font-bold ${output === 'good' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
          Good
        </button>
        <button onClick={() => { sound.playClick(); setOutput('service'); }}
          className={`py-2.5 rounded-xl border-2 text-xs font-bold ${output === 'service' ? 'bg-purple-50 border-purple-300 text-purple-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
          Service
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (sector && output) onSteal(sector, output); }} disabled={!sector || !output}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-xs disabled:opacity-40 transition-all shadow-sm">
          Lock In Steal!
        </button>
        <button onClick={onSkip} className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50">
          Pass
        </button>
      </div>
    </div>
  );
}
