import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Sector, SectorCard } from '../../types/economy';
import { CardArt, TEAM_STYLE, TeamId } from './ArenaChrome';

export interface SectorTheme {
  frame: string;
  body: string;
  title: string;
  subtitle: string;
  slot: string;
  plus: string;
  ring: string;
}

export interface SectorPlacement {
  card: SectorCard;
  team: TeamId;
}

interface SectorDropColumnProps {
  sector: Sector;
  title: string;
  subtitle: string;
  image: string;
  theme: SectorTheme;
  placements: SectorPlacement[];
  slotCount: number;
  teamNames: Record<TeamId, string>;
  /** A card is selected, so tapping the column places it. */
  canTapPlace: boolean;
  flash: 'good' | 'bad' | null;
  onPlace: (cardId: string, sector: Sector) => void;
  onTapPlace: (sector: Sector) => void;
}

export const SectorDropColumn: React.FC<SectorDropColumnProps> = ({
  sector,
  title,
  subtitle,
  image,
  theme,
  placements,
  slotCount,
  teamNames,
  canTapPlace,
  flash,
  onPlace,
  onTapPlace,
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) onPlace(cardId, sector);
  };

  const slots = Array.from({ length: Math.max(slotCount, placements.length) }, (_, i) => placements[i] ?? null);

  return (
    <div
      role={canTapPlace ? 'button' : undefined}
      tabIndex={canTapPlace ? 0 : undefined}
      aria-label={canTapPlace ? `Place selected card in ${title}` : undefined}
      onClick={canTapPlace ? () => onTapPlace(sector) : undefined}
      onKeyDown={(e) => {
        if (canTapPlace && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onTapPlace(sector);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false);
      }}
      onDrop={handleDrop}
      className={`relative flex flex-col min-h-0 rounded-[20px] border-[3px] ${theme.frame} bg-gradient-to-b ${
        theme.body
      } overflow-hidden shadow-[0_6px_18px_rgba(30,64,120,0.14)] transition-all duration-200 ${
        isOver ? `ring-4 ${theme.ring} scale-[1.02]` : ''
      } ${canTapPlace && !isOver ? `ring-2 ${theme.ring} cursor-pointer hover:scale-[1.01]` : ''} ${
        flash === 'good' ? 'ring-4 ring-emerald-400' : flash === 'bad' ? 'ring-4 ring-red-400 animate-shake' : ''
      }`}
    >
      <div className="relative h-20 xl:h-28 2xl:h-32 shrink-0">
        <img src={image} alt="" draggable={false} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/95 to-transparent" />
      </div>

      <div className="text-center px-2 pt-1 pb-1.5 bg-white/95 shrink-0">
        <h3 className={`font-black uppercase leading-tight text-base xl:text-[22px] ${theme.title}`}>{title}</h3>
        <p className={`text-xs xl:text-sm font-semibold ${theme.subtitle}`}>{subtitle}</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-1.5 xl:gap-2 p-2 xl:p-3">
        {slots.map((placement, i) =>
          placement ? (
            <div
              key={placement.card.id}
              className={`flex-1 min-h-[42px] flex items-center gap-2 rounded-xl bg-white border-2 ${
                placement.team === 'teamA' ? 'border-blue-300' : 'border-orange-300'
              } px-1.5 py-1 shadow-sm animate-popIn`}
            >
              <div className="h-9 xl:h-11 aspect-[4/3] rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <CardArt
                  imageUrl={placement.card.imageUrl}
                  illustrationKey={placement.card.illustrationKey}
                  alt={placement.card.title}
                />
              </div>
              <span className="flex-1 min-w-0 text-[11px] xl:text-[13px] font-bold text-slate-700 leading-tight line-clamp-2 text-left">
                {placement.card.title}
              </span>
              <span
                className={`shrink-0 w-6 h-6 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow ${
                  TEAM_STYLE[placement.team].solid
                }`}
                title={`Sorted by ${teamNames[placement.team]}`}
              >
                {TEAM_STYLE[placement.team].initial}
              </span>
            </div>
          ) : (
            <div
              key={`empty-${i}`}
              className={`flex-1 min-h-[42px] rounded-xl border-2 border-dashed ${theme.slot} flex items-center justify-center`}
            >
              <span className={`w-7 h-7 xl:w-8 xl:h-8 rounded-full flex items-center justify-center ${theme.plus}`}>
                <Plus className="w-4 h-4 xl:w-5 xl:h-5" strokeWidth={3} />
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};
