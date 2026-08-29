'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Crown } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface ResultScreenProps {
  winnerName: string;
  scores: { name: string; score: number }[];
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export function ResultScreen({ winnerName, scores, onPlayAgain, onBackToHub }: ResultScreenProps) {
  useEffect(() => {
    sound.playVictory();
    // Fire confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const isTie = sorted.length >= 2 && sorted[0].score === sorted[1].score;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-ncert-blue-dark via-ncert-blue to-ncert-blue-light z-50 flex items-center justify-center p-4">
      <div className="text-center animate-scale-in max-w-md w-full">
        {/* Trophy */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-amber-400/20 flex items-center justify-center mx-auto animate-bounce-slow">
            <Trophy className="w-14 h-14 text-amber-400" />
          </div>
          <Crown className="w-8 h-8 text-amber-300 absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse" />
        </div>

        {/* Winner */}
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          {isTie ? "It's a Tie!" : `${winnerName} Wins!`}
        </h1>
        <p className="text-white/60 text-sm mb-8">
          {isTie ? 'Both sides played brilliantly!' : 'Congratulations on the victory!'}
        </p>

        {/* Score Cards */}
        <div className="flex gap-4 justify-center mb-8">
          {sorted.map((entry, i) => (
            <div
              key={entry.name}
              className={`px-6 py-4 rounded-2xl ${
                i === 0 && !isTie
                  ? 'bg-white/20 border-2 border-amber-400/50 scale-105'
                  : 'bg-white/10 border border-white/20'
              } backdrop-blur-sm min-w-[120px]`}
            >
              <p className="text-white/70 text-xs mb-1 uppercase tracking-wider">
                {i === 0 && !isTie ? '🥇 Winner' : i === 0 ? '🤝' : '🥈'}
              </p>
              <p className="text-white font-semibold text-sm truncate">{entry.name}</p>
              <p className="text-2xl font-bold text-white mt-1">{entry.score}</p>
              <p className="text-white/50 text-[10px] uppercase">points</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 rounded-xl bg-white text-ncert-blue font-semibold flex items-center gap-2 
              hover:shadow-elevated transition-all active:scale-[0.97]"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={onBackToHub}
            className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-semibold 
              flex items-center gap-2 hover:bg-white/20 transition-all active:scale-[0.97]"
          >
            <Home className="w-4 h-4" />
            All Activities
          </button>
        </div>
      </div>
    </div>
  );
}
