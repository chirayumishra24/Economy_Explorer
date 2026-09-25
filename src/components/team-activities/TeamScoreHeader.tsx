import React from 'react';
import { TeamProfile } from '../../types/economy';

interface TeamScoreHeaderProps {
  teams: TeamProfile[];
  scores: { teamA: number; teamB: number };
  streaks: { teamA: number; teamB: number };
  activeTeamId: 'teamA' | 'teamB';
  title: string;
  subtitle: string;
  roundInfo?: string;
  onSwitchTurn?: () => void;
  onResetGame?: () => void;
  onExit?: () => void;
}

export const TeamScoreHeader: React.FC<TeamScoreHeaderProps> = ({
  teams,
  scores,
  streaks,
  activeTeamId,
  title,
  subtitle,
  roundInfo,
  onResetGame,
  onExit,
}) => {
  const teamA = teams[0];
  const teamB = teams[1];

  return (
    <div className="w-full bg-surface border-b border-border shadow-soft p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
      {/* Team A Score Card */}
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-card border-2 transition-all ${
          activeTeamId === 'teamA'
            ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-400/40 scale-102'
            : 'bg-background/80 border-border/70 opacity-75'
        }`}
      >
        <div className="text-2xl sm:text-3xl filter drop-shadow-sm">{teamA.avatar}</div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black text-blue-700 tracking-tight">{teamA.name}</span>
            {activeTeamId === 'teamA' && (
              <span className="text-[10px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase animate-pulse">
                Active Turn
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black text-textMain">{scores.teamA} pts</span>
            {streaks.teamA > 1 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-full">
                🔥 {streaks.teamA} streak!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Game Status & Turn Indicator */}
      <div className="flex-1 min-w-[200px] text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accentYellow/20 border border-accentYellow/50 text-textMain text-xs font-black uppercase tracking-wider mb-0.5 shadow-sm">
          <span>🎮 2-TEAM ARENA</span>
          {roundInfo && (
            <>
              <span>•</span>
              <span className="text-blue-700">{roundInfo}</span>
            </>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-black text-textMain leading-tight">{title}</h2>
        <p className="text-xs text-textMuted font-medium truncate hidden md:block">{subtitle}</p>
      </div>

      {/* Team B Score Card */}
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-card border-2 transition-all ${
          activeTeamId === 'teamB'
            ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-102'
            : 'bg-background/80 border-border/70 opacity-75'
        }`}
      >
        <div className="text-left">
          <div className="flex items-center gap-1.5 justify-end">
            {activeTeamId === 'teamB' && (
              <span className="text-[10px] bg-amber-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase animate-pulse">
                Active Turn
              </span>
            )}
            <span className="text-xs sm:text-sm font-black text-amber-700 tracking-tight">{teamB.name}</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            {streaks.teamB > 1 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-full">
                🔥 {streaks.teamB} streak!
              </span>
            )}
            <span className="text-lg sm:text-xl font-black text-textMain">{scores.teamB} pts</span>
          </div>
        </div>
        <div className="text-2xl sm:text-3xl filter drop-shadow-sm">{teamB.avatar}</div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
        {onResetGame && (
          <button
            onClick={onResetGame}
            className="px-2.5 py-1.5 rounded-btn bg-background hover:bg-border/60 text-textMuted border border-border text-xs font-bold transition-all min-h-[36px]"
            title="Restart round"
          >
            🔄 Reset
          </button>
        )}
        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-btn bg-textMain text-surface hover:brightness-110 text-xs font-bold transition-all min-h-[36px]"
            title="Return to Hub"
          >
            ✕ Exit
          </button>
        )}
      </div>
    </div>
  );
};
