'use client';

import React from 'react';
import { Team, Player } from '../../types/economy';

interface ScoreBoardProps {
  teams?: [Team, Team] | null;
  players?: [Player, Player] | null;
  roundNumber?: number;
  totalRounds?: number;
  timerDisplay?: string;
  timerUrgency?: 'safe' | 'warning' | 'danger';
}

export function ScoreBoard({ teams, players, roundNumber, totalRounds, timerDisplay, timerUrgency }: ScoreBoardProps) {
  const entries = teams
    ? teams.map(t => ({ name: t.name, score: t.score, color: t.color }))
    : players
    ? [
        { name: players[0].name, score: players[0].score, color: '#3B82F6' },
        { name: players[1].name, score: players[1].score, color: '#F43F5E' },
      ]
    : [];

  const urgencyColor = timerUrgency === 'danger' ? 'text-red-500' : timerUrgency === 'warning' ? 'text-amber-500' : 'text-gray-600';

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Player/Team 1 */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entries[0]?.color }} />
        <span className="text-sm font-medium text-gray-700 truncate">{entries[0]?.name}</span>
        <span className="text-lg font-bold tabular-nums" style={{ color: entries[0]?.color }}>
          {entries[0]?.score ?? 0}
        </span>
      </div>

      {/* Center: Round + Timer */}
      <div className="flex flex-col items-center px-4">
        {roundNumber != null && totalRounds != null && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Round {roundNumber}/{totalRounds}
          </span>
        )}
        {timerDisplay && (
          <span className={`text-lg font-bold font-mono tabular-nums ${urgencyColor} transition-colors`}>
            {timerDisplay}
          </span>
        )}
        {!timerDisplay && roundNumber == null && (
          <span className="text-xs text-gray-400 font-medium">VS</span>
        )}
      </div>

      {/* Right: Player/Team 2 */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-end">
        <span className="text-lg font-bold tabular-nums" style={{ color: entries[1]?.color }}>
          {entries[1]?.score ?? 0}
        </span>
        <span className="text-sm font-medium text-gray-700 truncate">{entries[1]?.name}</span>
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entries[1]?.color }} />
      </div>
    </div>
  );
}
