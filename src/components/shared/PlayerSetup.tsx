'use client';

import React, { useState } from 'react';
import { Swords, X, Play, Bot, User, Keyboard, Zap, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface PlayerSetupProps {
  activityTitle: string;
  onStart: (p1Name: string, p2Name: string, isAI?: boolean, aiDifficulty?: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
}

const AI_BOTS = [
  {
    level: 'easy' as const,
    name: 'Rookie Intern 🤖',
    desc: 'Takes time to think, 60% accuracy',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-800'
  },
  {
    level: 'medium' as const,
    name: 'Junior Trader 🤖',
    desc: 'Moderate speed, 80% accuracy',
    color: 'border-blue-300 bg-blue-50 text-blue-800'
  },
  {
    level: 'hard' as const,
    name: 'Chief Economist 🤖',
    desc: 'Lightning fast, 95% accuracy',
    color: 'border-purple-300 bg-purple-50 text-purple-800'
  }
];

export function PlayerSetup({ activityTitle, onStart, onBack }: PlayerSetupProps) {
  const [mode, setMode] = useState<'pvp' | 'ai'>('pvp');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [selectedBotIdx, setSelectedBotIdx] = useState(1);

  const handleStart = () => {
    sound.playClick();
    if (mode === 'ai') {
      const bot = AI_BOTS[selectedBotIdx];
      onStart(p1 || 'Player 1', bot.name, true, bot.level);
    } else {
      onStart(p1 || 'Player 1', p2 || 'Player 2', false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full p-6 sm:p-7 relative animate-scale-in border border-gray-100">
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-soft">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-gray-900">{activityTitle}</h2>
          <p className="text-xs text-gray-500 mt-1">Choose game mode & player setup</p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-5">
          <button
            onClick={() => { sound.playClick(); setMode('pvp'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'pvp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" /> 2 Players (Local)
          </button>
          <button
            onClick={() => { sound.playClick(); setMode('ai'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'ai' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bot className="w-4 h-4" /> Solo vs AI Bot
          </button>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Player 1 Name</label>
            <input
              type="text"
              value={p1}
              onChange={e => setP1(e.target.value)}
              placeholder="e.g. Aarav"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent font-medium"
              maxLength={15}
            />
          </div>

          {mode === 'pvp' ? (
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Player 2 Name</label>
              <input
                type="text"
                value={p2}
                onChange={e => setP2(e.target.value)}
                placeholder="e.g. Meera"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent font-medium"
                maxLength={15}
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select AI Bot Difficulty</label>
              <div className="space-y-2">
                {AI_BOTS.map((bot, i) => (
                  <button
                    key={bot.level}
                    type="button"
                    onClick={() => { sound.playClick(); setSelectedBotIdx(i); }}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      selectedBotIdx === i ? `${bot.color} scale-[1.02] shadow-sm` : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{bot.name}</p>
                      <p className="text-[11px] opacity-80">{bot.desc}</p>
                    </div>
                    {selectedBotIdx === i && <Sparkles className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Controls Reminder */}
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 mb-5 flex items-center gap-2 text-[11px] text-amber-800">
          <Keyboard className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Keyboard ready:</strong> Use hotkeys for ultra-fast reaction!
          </span>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-semibold text-base
            flex items-center justify-center gap-2 hover:shadow-elevated transition-all duration-200 active:scale-[0.98]"
        >
          <Play className="w-5 h-5" />
          Start Battle!
        </button>
      </div>
    </div>
  );
}
