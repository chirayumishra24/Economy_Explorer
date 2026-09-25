import React, { useState } from 'react';
import { Check, Lightbulb, X } from 'lucide-react';
import { StoryEvent } from '../../types/economy';
import { CardArt, TeamId } from './ArenaChrome';

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

const SLOT_STYLE: Record<TeamId, { idle: string; number: string; placeholder: string }> = {
  teamA: {
    idle: 'border-sky-300 bg-sky-50/70',
    number: 'bg-gradient-to-b from-sky-400 to-blue-600',
    placeholder: 'text-slate-500',
  },
  teamB: {
    idle: 'border-orange-300 bg-orange-50/70',
    number: 'bg-gradient-to-b from-amber-400 to-orange-600',
    placeholder: 'text-orange-700/80',
  },
};

interface FlowchartStepSlotProps {
  index: number;
  team: TeamId;
  event: StoryEvent | null;
  result: 'correct' | 'wrong' | null;
  /** Placed by a hint, so it cannot be moved. */
  locked: boolean;
  highlightEmpty: boolean;
  /** An event card is selected, so tapping this slot places it. */
  canTapPlace: boolean;
  disabled: boolean;
  onDropEvent: (eventId: string, index: number) => void;
  onTap: (index: number) => void;
  onRemove: (index: number) => void;
}

export const FlowchartStepSlot: React.FC<FlowchartStepSlotProps> = ({
  index,
  team,
  event,
  result,
  locked,
  highlightEmpty,
  canTapPlace,
  disabled,
  onDropEvent,
  onTap,
  onRemove,
}) => {
  const [isOver, setIsOver] = useState(false);
  const style = SLOT_STYLE[team];
  const acceptsInput = !disabled && !locked;
  const tappable = acceptsInput && canTapPlace;

  const stateClass =
    result === 'correct'
      ? 'border-solid border-emerald-400 bg-emerald-50'
      : result === 'wrong'
      ? 'border-solid border-red-400 bg-red-50'
      : highlightEmpty && !event
      ? 'border-dashed border-red-400 bg-red-50 animate-shake'
      : event
      ? `border-solid ${style.idle} bg-white`
      : `border-dashed ${style.idle}`;

  return (
    <div
      role={tappable ? 'button' : undefined}
      tabIndex={tappable ? 0 : undefined}
      aria-label={tappable ? `Place selected event at step ${index + 1}` : undefined}
      onClick={tappable ? () => onTap(index) : undefined}
      onKeyDown={(e) => {
        if (tappable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onTap(index);
        }
      }}
      onDragOver={(e) => {
        if (!acceptsInput) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const eventId = e.dataTransfer.getData('text/plain');
        if (eventId && acceptsInput) onDropEvent(eventId, index);
      }}
      className={`relative flex items-center gap-2 xl:gap-2.5 rounded-xl border-2 px-2 py-1 min-h-[44px] xl:min-h-[52px] transition-all ${stateClass} ${
        isOver ? 'ring-4 ring-amber-300 scale-[1.02]' : tappable ? 'ring-2 ring-amber-300 cursor-pointer' : ''
      }`}
    >
      <span
        className={`w-8 h-8 xl:w-9 xl:h-9 shrink-0 rounded-full flex items-center justify-center font-black text-white text-sm xl:text-base shadow ${
          result === 'correct' ? 'bg-emerald-500' : result === 'wrong' ? 'bg-red-500' : style.number
        }`}
      >
        {index + 1}
      </span>

      {event ? (
        <>
          <div
            draggable={acceptsInput}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', event.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            className={`flex-1 min-w-0 flex items-center gap-2 animate-popIn ${acceptsInput ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <div className="w-11 h-8 xl:w-14 xl:h-10 rounded-md overflow-hidden shrink-0 bg-slate-100 pointer-events-none">
              <CardArt imageUrl={event.imageUrl} illustrationKey={event.illustrationKey} alt="" />
            </div>
            <span className="text-[11px] xl:text-[13px] font-semibold text-slate-700 leading-tight line-clamp-2">
              {event.text}
            </span>
          </div>
          {result === 'correct' ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={3} aria-label="Correct position" />
          ) : result === 'wrong' ? (
            <X className="w-5 h-5 text-red-500 shrink-0" strokeWidth={3} aria-label="Wrong position" />
          ) : locked ? (
            <span title="Placed by a hint" className="shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
            </span>
          ) : (
            !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                title="Remove from this step"
                aria-label={`Remove event from step ${index + 1}`}
                className="w-6 h-6 shrink-0 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            )
          )}
        </>
      ) : (
        <span className={`flex-1 text-center text-[12px] xl:text-sm font-medium ${style.placeholder}`}>
          Drop the {ORDINALS[index] ?? `#${index + 1}`} event here
        </span>
      )}
    </div>
  );
};
