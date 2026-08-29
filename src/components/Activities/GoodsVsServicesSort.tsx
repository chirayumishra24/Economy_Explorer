'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Package, HandHelping, ArrowLeft, Keyboard, Bot, Flame, Sparkles } from 'lucide-react';
import { SORT_ITEMS } from '../../data/activityGameData';
import { Player, SortItem } from '../../types/economy';
import { useGameTimer } from '../../hooks/useGameTimer';
import { ScoreBoard } from '../shared/ScoreBoard';
import { GameTimer } from '../shared/GameTimer';
import { sound } from '../../utils/soundEffects';

interface GoodsVsServicesSortProps {
  players: [Player, Player];
  onUpdateScore: (playerIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

export function GoodsVsServicesSort({ players, onUpdateScore, onEndGame, onBack }: GoodsVsServicesSortProps) {
  const ROUND_TIME = 60;
  const timer = useGameTimer(ROUND_TIME);

  const [shuffledItems, setShuffledItems] = useState<SortItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [combos, setCombos] = useState([0, 0]);
  const [feedback, setFeedback] = useState<{ player: 0 | 1; correct: boolean; text: string } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle items on mount
  useEffect(() => {
    const sorted = [...SORT_ITEMS].sort((a, b) => a.difficulty - b.difficulty);
    const easy = sorted.filter(i => i.difficulty === 1).sort(() => Math.random() - 0.5);
    const medium = sorted.filter(i => i.difficulty === 2).sort(() => Math.random() - 0.5);
    const hard = sorted.filter(i => i.difficulty === 3).sort(() => Math.random() - 0.5);
    setShuffledItems([...easy.slice(0, 8), ...medium.slice(0, 7), ...hard.slice(0, 5)]);
  }, []);

  const handleTimeUp = useCallback(() => {
    setGameOver(true);
    sound.playVictory();
    const winner = scores[0] > scores[1] ? players[0].name : scores[1] > scores[0] ? players[1].name : 'Tie';
    setTimeout(() => {
      onEndGame(winner, [
        { name: players[0].name, score: scores[0] },
        { name: players[1].name, score: scores[1] },
      ]);
    }, 1500);
  }, [scores, players, onEndGame]);

  const startGame = () => {
    sound.playClick();
    setGameStarted(true);
    timer.start(() => handleTimeUp());
  };

  const handleAnswer = useCallback((playerIndex: 0 | 1, answerType: 'good' | 'service') => {
    if (answered || gameOver || currentIndex >= shuffledItems.length) return;
    setAnswered(true);

    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    const item = shuffledItems[currentIndex];
    const correct = item.correctType === answerType;

    const newCombos = [...combos];
    const newScores = [...scores];

    if (correct) {
      newCombos[playerIndex] += 1;
      newCombos[1 - playerIndex] = 0;
      const bonus = newCombos[playerIndex] >= 3 ? 15 : 0;
      const points = 10 + bonus;
      newScores[playerIndex] += points;
      setFeedback({ player: playerIndex, correct: true, text: bonus > 0 ? `+${points} 🔥 COMBO!` : `+${points}` });
      onUpdateScore(playerIndex, points);

      if (bonus > 0) {
        sound.playCombo(newCombos[playerIndex]);
      } else {
        sound.playCorrect();
      }
    } else {
      newCombos[playerIndex] = 0;
      newScores[playerIndex] = Math.max(0, newScores[playerIndex] - 5);
      setFeedback({ player: playerIndex, correct: false, text: `-5 — It's a ${item.correctType}!` });
      onUpdateScore(playerIndex, -5);
      sound.playWrong();
    }

    setCombos(newCombos);
    setScores(newScores);

    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      if (currentIndex + 1 >= shuffledItems.length) {
        handleTimeUp();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1100);
  }, [answered, gameOver, currentIndex, shuffledItems, combos, scores, onUpdateScore, handleTimeUp]);

  // AI Bot Auto Player
  useEffect(() => {
    if (!gameStarted || gameOver || answered || !players[1].isAI || currentIndex >= shuffledItems.length) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const delay = botLevel === 'easy' ? 2200 : botLevel === 'medium' ? 1400 : 750;
    const accuracy = botLevel === 'easy' ? 0.65 : botLevel === 'medium' ? 0.82 : 0.95;

    aiTimerRef.current = setTimeout(() => {
      if (!answered && !gameOver) {
        const item = shuffledItems[currentIndex];
        const willBeCorrect = Math.random() < accuracy;
        const botChoice = willBeCorrect ? item.correctType : item.correctType === 'good' ? 'service' : 'good';
        handleAnswer(1, botChoice);
      }
    }, delay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [gameStarted, gameOver, answered, currentIndex, players, shuffledItems, handleAnswer]);

  // Keyboard Hotkey Listener
  useEffect(() => {
    if (!gameStarted || gameOver || answered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Player 1: 'a' -> good, 's' -> service
      if (key === 'a') {
        handleAnswer(0, 'good');
      } else if (key === 's') {
        handleAnswer(0, 'service');
      }
      // Player 2 (if human): 'k' -> good, 'l' -> service
      if (!players[1].isAI) {
        if (key === 'k') {
          handleAnswer(1, 'good');
        } else if (key === 'l') {
          handleAnswer(1, 'service');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, answered, players, handleAnswer]);

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Goods vs Services Sort</h1>
          <p className="text-gray-500 mb-4">Items appear one by one. Race to classify them!</p>

          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 space-y-2 mb-6 text-left border border-gray-100">
            <p>⚡ <strong>First to answer</strong> scores <span className="text-emerald-600 font-bold">+10 pts</span></p>
            <p>🔥 <strong>3 streak combos</strong> = <span className="text-amber-600 font-bold">+15 bonus</span></p>
            <p>❌ <strong>Wrong answer</strong> = <span className="text-red-500 font-bold">−5 points</span></p>
            <div className="pt-2 border-t border-gray-200">
              <p className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
                <Keyboard className="w-3.5 h-3.5 text-ncert-blue" /> Single-Keyboard Hotkeys:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="p-1 rounded bg-blue-50 text-blue-700 font-medium">
                  {players[0].name}: <kbd className="px-1 py-0.5 bg-white rounded border">A</kbd> Good / <kbd className="px-1 py-0.5 bg-white rounded border">S</kbd> Service
                </span>
                <span className="p-1 rounded bg-rose-50 text-rose-700 font-medium">
                  {players[1].name}: {players[1].isAI ? '🤖 Auto AI' : <><kbd className="px-1 py-0.5 bg-white rounded border">K</kbd> Good / <kbd className="px-1 py-0.5 bg-white rounded border">L</kbd> Service</>}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-base hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Start Sorting! ⚡
          </button>
        </div>
      </div>
    );
  }

  const currentItem = shuffledItems[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      {/* Scoreboard */}
      <ScoreBoard
        players={[
          { name: players[0].name, score: scores[0] },
          { name: players[1].name, score: scores[1] },
        ]}
        timerDisplay={timer.formattedTime}
        timerUrgency={timer.urgency}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative max-w-4xl mx-auto w-full">
        {/* Back button */}
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className="absolute top-4 left-4 p-2 rounded-xl hover:bg-white text-gray-400 bg-white/60 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Timer ring */}
        <div className="mb-4">
          <GameTimer timeLeft={timer.timeLeft} totalTime={ROUND_TIME} urgency={timer.urgency} formattedTime={timer.formattedTime} size="sm" />
        </div>

        {/* Progress & Item number */}
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
          Item {currentIndex + 1} of {shuffledItems.length}
        </p>

        {/* Current Item Card */}
        {currentItem && !gameOver && (
          <div className={`bg-white rounded-3xl shadow-elevated border border-gray-100 p-6 w-full max-w-md text-center mb-6
            transition-all duration-300 ${feedback ? (feedback.correct ? 'ring-4 ring-emerald-400 scale-105' : 'ring-4 ring-red-400 shake') : ''}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentItem.name}</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">{currentItem.description}</p>
          </div>
        )}

        {/* Feedback alert */}
        {feedback && (
          <div className={`text-center mb-4 text-base font-bold animate-bounce-once ${feedback.correct ? 'text-emerald-600' : 'text-red-500'}`}>
            {feedback.correct ? '✅' : '❌'} {feedback.text}
          </div>
        )}

        {gameOver && (
          <div className="text-center text-gray-500 text-base font-semibold">⏱️ Time's up! Tallying score...</div>
        )}

        {/* Combo indicators */}
        <div className="flex justify-between w-full max-w-md mb-4 px-2">
          {[0, 1].map(i => (
            <div key={i} className="text-xs font-semibold">
              <span className={i === 0 ? 'text-blue-600' : 'text-rose-600'}>{players[i].name}</span>
              {combos[i] >= 2 && <span className="ml-1.5 text-amber-500 font-bold animate-pulse">🔥 x{combos[i]} STREAK</span>}
            </div>
          ))}
        </div>

        {/* Answer Buttons — Player 1 (left) and Player 2 (right) */}
        {!gameOver && currentItem && (
          <div className="w-full max-w-xl grid grid-cols-2 gap-4 sm:gap-6">
            {/* Player 1 buttons */}
            <div className="space-y-3 p-4 bg-white/70 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-700">{players[0].name}</p>
                <span className="text-[10px] text-gray-400 font-mono">Keys [A] / [S]</span>
              </div>
              <button
                onClick={() => handleAnswer(0, 'good')}
                disabled={answered}
                className="w-full py-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-bold text-sm
                  hover:bg-emerald-100 hover:border-emerald-500 transition-all active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                <Package className="w-5 h-5 text-emerald-600" />
                <span>GOOD <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-emerald-300 ml-1">A</kbd></span>
              </button>
              <button
                onClick={() => handleAnswer(0, 'service')}
                disabled={answered}
                className="w-full py-4 rounded-xl bg-purple-50 border-2 border-purple-300 text-purple-800 font-bold text-sm
                  hover:bg-purple-100 hover:border-purple-500 transition-all active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                <HandHelping className="w-5 h-5 text-purple-600" />
                <span>SERVICE <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-purple-300 ml-1">S</kbd></span>
              </button>
            </div>

            {/* Player 2 buttons */}
            <div className="space-y-3 p-4 bg-white/70 rounded-2xl border border-rose-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  {players[1].isAI && <Bot className="w-3.5 h-3.5" />}
                  {players[1].name}
                </p>
                {!players[1].isAI && <span className="text-[10px] text-gray-400 font-mono">Keys [K] / [L]</span>}
              </div>
              <button
                onClick={() => handleAnswer(1, 'good')}
                disabled={answered || !!players[1].isAI}
                className="w-full py-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-bold text-sm
                  hover:bg-emerald-100 hover:border-emerald-500 transition-all active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                <Package className="w-5 h-5 text-emerald-600" />
                <span>GOOD {!players[1].isAI && <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-emerald-300 ml-1">K</kbd>}</span>
              </button>
              <button
                onClick={() => handleAnswer(1, 'service')}
                disabled={answered || !!players[1].isAI}
                className="w-full py-4 rounded-xl bg-purple-50 border-2 border-purple-300 text-purple-800 font-bold text-sm
                  hover:bg-purple-100 hover:border-purple-500 transition-all active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                <HandHelping className="w-5 h-5 text-purple-600" />
                <span>SERVICE {!players[1].isAI && <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-purple-300 ml-1">L</kbd>}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
