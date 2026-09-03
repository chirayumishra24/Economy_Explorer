import React from 'react';
import { EconomicNode } from '../../../types/economy';
import { NodeIconRenderer, SectorBadge } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';

interface Props {
  node: EconomicNode;
  onClose: () => void;
  onNextNode?: (nodeId: string) => void;
}

export const NodeCard: React.FC<Props> = ({ node, onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-title"
      className="fixed inset-0 z-40 bg-textMain/30 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-surface border border-border rounded-card shadow-lift max-w-lg w-full p-6 relative select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-textMuted hover:text-textMain min-h-[44px]"
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Header with Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-card bg-background border border-border flex items-center justify-center text-textMain shrink-0 shadow-sm">
            <NodeIconRenderer name={node.icon} size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SectorBadge sector={node.sector} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-border/40 text-textMuted uppercase">
                {node.output.kind}
              </span>
            </div>
            <h2 id="node-title" className="text-xl font-black text-textMain">{node.label}</h2>
          </div>
        </div>

        {/* 5 Questions Structured Information */}
        <div className="space-y-3 my-4">
          {/* Who? */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">Who is working here?</span>
            <p className="text-base font-bold text-textMain mt-0.5">{node.who}</p>
          </div>

          {/* What are they doing? (<= 18 words) */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">What are they doing?</span>
            <p className="text-base text-textMain mt-0.5 font-medium">{node.doing}</p>
          </div>

          {/* Output: Good or Service? */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-btn bg-background border border-border/70">
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">Economic Output</span>
              <p className="text-sm font-bold text-textMain mt-0.5">{node.output.label}</p>
            </div>
            <div className="p-3 rounded-btn bg-background border border-border/70">
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">Type</span>
              <p className="text-sm font-bold capitalize text-textMain mt-0.5">
                {node.output.kind === 'good' ? '📦 Tangible Good' : '🤝 Supportive Service'}
              </p>
            </div>
          </div>

          {/* What happens next? */}
          <div className="p-3 rounded-btn bg-background border border-border/70">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block">What happens next?</span>
            <p className="text-sm text-textMuted mt-0.5">
              {node.sector === 'primary' && 'This raw natural material is picked up by transport to go to factories for making.'}
              {node.sector === 'secondary' && 'This newly made product travels to the bazaar shop so local families can purchase it.'}
              {node.sector === 'tertiary' && 'This service connects producers to consumers or helps keep community activities running.'}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-btn bg-accentYellow font-bold text-textMain text-sm hover:brightness-105 min-h-[44px] shadow-soft"
          >
            Done Exploring This Node
          </button>
        </div>
      </div>
    </div>
  );
};
