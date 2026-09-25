import React, { useState } from 'react';
import { Sector, SectorCard } from '../../types/economy';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';

interface PlacedCardInfo {
  card: SectorCard;
  teamId: 'teamA' | 'teamB';
  teamAvatar: string;
}

interface SectorDropColumnProps {
  sector: Sector;
  title: string;
  subtitle: string;
  definition: string;
  icon: string;
  colorTheme: {
    bg: string;
    border: string;
    headerBg: string;
    textColor: string;
    accentGlow: string;
    badgeBg: string;
  };
  placedCards: PlacedCardInfo[];
  isCardSelected: boolean;
  onDropCard: (sector: Sector) => void;
  onTapPlace: (sector: Sector) => void;
}

export const SectorDropColumn: React.FC<SectorDropColumnProps> = ({
  sector,
  title,
  subtitle,
  definition,
  icon,
  colorTheme,
  placedCards,
  isCardSelected,
  onDropCard,
  onTapPlace,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropCard(sector);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => isCardSelected && onTapPlace(sector)}
      className={`flex-1 min-w-[280px] max-w-full flex flex-col rounded-card border-2 transition-all duration-200 select-none overflow-hidden relative shadow-sm ${
        colorTheme.bg
      } ${colorTheme.border} ${
        isDragOver
          ? `ring-4 ${colorTheme.accentGlow} scale-[1.02] shadow-lift bg-white`
          : isCardSelected
          ? 'cursor-pointer hover:border-textMain/60 ring-2 ring-accentYellow/50'
          : ''
      }`}
    >
      {/* Column Header */}
      <div className={`p-3.5 border-b ${colorTheme.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl filter drop-shadow-sm">{icon}</span>
          <div>
            <h3 className={`text-base sm:text-lg font-black tracking-tight leading-tight ${colorTheme.textColor}`}>
              {title}
            </h3>
            <p className="text-[11px] font-semibold text-textMuted leading-tight">{subtitle}</p>
          </div>
        </div>

        {/* Counter Badge */}
        <span
          className={`text-xs font-black px-2.5 py-1 rounded-full border shadow-sm ${colorTheme.badgeBg}`}
          title={`${placedCards.length} cards categorized into this sector`}
        >
          {placedCards.length} Cards
        </span>
      </div>

      {/* Explanatory Definition Banner */}
      <div className="px-3 py-1.5 bg-white/70 border-b border-border/40 text-[11px] font-medium text-textMuted flex items-center gap-1.5">
        <span className="font-bold text-textMain shrink-0">Rule:</span>
        <span className="truncate">{definition}</span>
      </div>

      {/* Drop / Placement Area */}
      <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-y-auto max-h-[460px] scrollable-panel">
        {placedCards.length === 0 ? (
          <div
            className={`flex-1 min-h-[160px] border-2 border-dashed rounded-card flex flex-col items-center justify-center p-4 text-center transition-all ${
              isDragOver
                ? 'border-statusSuccess bg-statusSuccess/10 scale-98'
                : isCardSelected
                ? 'border-accentYellow bg-accentYellow/10 animate-pulse'
                : 'border-border/80 bg-surface/50 text-textMuted'
            }`}
          >
            <span className="text-3xl mb-1.5 opacity-80">{icon}</span>
            <p className="text-xs sm:text-sm font-bold text-textMain mb-0.5">
              {isDragOver
                ? 'Release to drop here!'
                : isCardSelected
                ? '👉 Click here to place card!'
                : 'Drag matching card here'}
            </p>
            <p className="text-[10px] text-textMuted max-w-[200px]">
              {isCardSelected ? 'Or drop dragged card' : 'Select a card and place it in this sector'}
            </p>
          </div>
        ) : (
          <>
            {/* List of placed cards */}
            <div className="grid grid-cols-1 gap-2">
              {placedCards.map((item, idx) => (
                <div
                  key={`${item.card.id}-${idx}`}
                  className="bg-surface rounded-card p-2 border border-border shadow-soft flex items-center gap-2.5 animate-fadeIn"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-11 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                    <ActivitySceneRenderer illustrationKey={item.card.illustrationKey} />
                  </div>

                  {/* Card Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-textMain truncate leading-tight">
                        {item.card.title}
                      </h4>
                      <span
                        className="text-xs shrink-0"
                        title={`Categorized by ${item.teamId === 'teamA' ? 'Team A' : 'Team B'}`}
                      >
                        {item.teamAvatar}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-textMuted truncate">{item.card.actor}</p>
                    <p className="text-[9px] text-statusSuccess font-bold truncate">✓ {item.card.activityKind}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-drop zone when cards are already present */}
            <div
              className={`py-2 px-3 border border-dashed rounded-btn text-center text-xs font-bold transition-colors ${
                isDragOver
                  ? 'border-statusSuccess bg-statusSuccess/15 text-statusSuccess'
                  : isCardSelected
                  ? 'border-accentYellow bg-accentYellow/15 text-textMain animate-pulse cursor-pointer'
                  : 'border-border/60 text-textMuted/70'
              }`}
            >
              {isDragOver ? 'Drop here!' : isCardSelected ? '+ Click to place selected card here' : '+ Drop next card here'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
