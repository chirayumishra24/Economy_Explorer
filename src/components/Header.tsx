'use client';

import React, { useState } from 'react';
import { Gamepad2, ArrowLeft, Trophy, Sparkles, Home, Volume2, VolumeX } from 'lucide-react';
import { ActivityId } from '../types/economy';
import { ACTIVITIES } from '../data/activityGameData';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  currentActivityId: ActivityId | null;
  onBackToHub: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentActivityId, onBackToHub }) => {
  const [muted, setMuted] = useState(sound.getMuted());
  const currentActivity = ACTIVITIES.find(a => a.id === currentActivityId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-ncert-warm-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHub}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-ncert-blue to-ncert-blue-light flex items-center justify-center text-white shadow-soft hover:scale-105 transition-transform"
            >
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ncert-blue bg-ncert-blue-50 px-2 py-0.5 rounded">
                  NCERT Grade 6 • Chapter 14
                </span>
                <span className="hidden md:inline-flex text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Theme E: Economic Life
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                ECONOMY EXPLORER
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Interactive Activities
                </span>
              </h1>
            </div>
          </div>

          {/* Active Activity Indicator & Sound & Back to Hub button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => {
                const isMuted = sound.toggleMute();
                setMuted(isMuted);
              }}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {currentActivity ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-gray-500">
                  Playing: <strong className="text-gray-900">{currentActivity.title}</strong>
                </span>
                <button
                  onClick={onBackToHub}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">All Activities</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  6 Competitive Games
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
