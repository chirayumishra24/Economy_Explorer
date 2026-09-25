import React from 'react';
import { AmulStageCard } from '../../types/economy';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';

interface FlowchartStepSlotProps {
  stepNumber: number;
  expectedTitle: string;
  expectedSector: string;
  placedCard: AmulStageCard | null;
  isSelectedForDrop: boolean;
  isSimulating: boolean;
  isFlowingPast: boolean;
  hasError: boolean;
  errorMessage?: string;
  onDropCard: (stepNumber: number) => void;
  onRemoveCard: (stepNumber: number) => void;
  onTapSlot: (stepNumber: number) => void;
}

export const FlowchartStepSlot: React.FC<FlowchartStepSlotProps> = ({
  stepNumber,
  expectedTitle,
  expectedSector,
  placedCard,
  isSelectedForDrop,
  isSimulating,
  isFlowingPast,
  hasError,
  onDropCard,
  onRemoveCard,
  onTapSlot,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

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
    onDropCard(stepNumber);
  };

  return (
    <div className="flex-1 min-w-[200px] max-w-[240px] flex flex-col relative select-none">
      {/* Step Slot Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onTapSlot(stepNumber)}
        className={`w-full min-h-[220px] rounded-card border-2 p-2.5 flex flex-col justify-between transition-all duration-200 relative ${
          hasError
            ? 'border-statusDisrupted bg-statusDisrupted/10 ring-4 ring-statusDisrupted/30 animate-shake'
            : isFlowingPast
            ? 'border-blue-500 bg-blue-50/90 ring-4 ring-blue-300 shadow-lift scale-102'
            : isDragOver
            ? 'border-accentYellow bg-accentYellow/15 scale-102 shadow-lift'
            : isSelectedForDrop
            ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-300 animate-pulse cursor-pointer'
            : placedCard
            ? 'border-border/80 bg-surface shadow-soft'
            : 'border-dashed border-border/80 bg-background/80 hover:bg-surface/80'
        }`}
      >
        {/* Step Header */}
        <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                isFlowingPast
                  ? 'bg-blue-600 text-white animate-pulse'
                  : hasError
                  ? 'bg-statusDisrupted text-white'
                  : placedCard
                  ? 'bg-textMain text-surface'
                  : 'bg-border text-textMuted'
              }`}
            >
              {stepNumber}
            </span>
            <span className="text-[11px] font-black text-textMain uppercase tracking-wider truncate">
              Step {stepNumber}
            </span>
          </div>

          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accentYellow/20 text-textMain border border-accentYellow/30">
            {expectedSector}
          </span>
        </div>

        {/* Content area: Placed Card or Empty Placeholder */}
        {placedCard ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Card Thumbnail */}
            <div className="w-full h-24 rounded-lg overflow-hidden border border-border bg-background relative mb-1.5">
              <ActivitySceneRenderer illustrationKey={placedCard.illustrationKey} />
              
              {/* Remove button */}
              {!isSimulating && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCard(stepNumber);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-textMain/80 hover:bg-statusDisrupted text-surface text-[10px] flex items-center justify-center transition-colors shadow-sm"
                  title="Remove card"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Title & Short description */}
            <div className="text-left flex-1">
              <h4 className="text-xs font-black text-textMain leading-tight line-clamp-2 mb-1">
                {placedCard.title}
              </h4>
              <p className="text-[10px] font-medium text-textMuted line-clamp-2 leading-relaxed">
                {placedCard.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-2 text-center text-textMuted">
            <span className="text-2xl mb-1 opacity-60">📥</span>
            <span className="text-xs font-bold text-textMain">Drop Step {stepNumber}</span>
            <span className="text-[10px] text-textMuted leading-tight mt-0.5">
              {expectedTitle}
            </span>
          </div>
        )}

        {/* Fluid Flow status indicator */}
        {isFlowingPast && (
          <div className="w-full mt-1.5 py-1 px-2 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm">
            <span>🥛</span>
            <span>Milk Flowing...</span>
          </div>
        )}

        {hasError && (
          <div className="w-full mt-1.5 py-1 px-2 rounded bg-statusDisrupted text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
            <span>⚠️</span>
            <span>Order Misaligned!</span>
          </div>
        )}
      </div>
    </div>
  );
};
