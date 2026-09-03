import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { validateDependencyChain } from '../../../utils/graphValidator';
import { NodeIconRenderer } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';

interface ChainCard {
  nodeId: string;
  action: string;
  sector: string;
}

const CARDS_POOL: ChainCard[] = [
  { nodeId: 'timber-forest', action: 'Forester Birju gathers timber logs in the forest grove.', sector: 'Primary' },
  { nodeId: 'transport-truck', action: 'Driver Jaspreet secures logs on the flatbed truck.', sector: 'Tertiary' },
  { nodeId: 'furniture-workshop', action: 'Carpenter Dev crafts smooth planks into study desks.', sector: 'Secondary' },
  { nodeId: 'bazaar-shop', action: 'Shopkeeper Salim displays desks for neighborhood schools.', sector: 'Tertiary' },
  { nodeId: 'consumer-household', action: 'Class 6 students study comfortably at their desks.', sector: 'Consumer' },
];

const REQUIRED_EDGES = [
  { from: 'timber-forest', to: 'transport-truck' },
  { from: 'transport-truck', to: 'furniture-workshop' },
  { from: 'furniture-workshop', to: 'bazaar-shop' },
  { from: 'bazaar-shop', to: 'consumer-household' },
];

export const ChainBuilder: React.FC = () => {
  const { state, dispatch } = useEconomy();

  // Phase 1: Detective seed question
  const [detectiveAnswered, setDetectiveAnswered] = useState(false);
  const [detectiveSelected, setDetectiveSelected] = useState<string | null>(null);

  // Phase 2: Chain slots (Ordered sequence built by student)
  const [placedNodeIds, setPlacedNodeIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<number>(-1);
  const [chainSuccess, setChainSuccess] = useState(false);


  const handleDetectiveChoice = (choice: string) => {
    sound.playClick();
    setDetectiveSelected(choice);
    setDetectiveAnswered(true);
  };

  const handleAddCard = (nodeId: string) => {
    sound.playClick();
    setPlacedNodeIds(prev => [...prev, nodeId]);
    setFeedback(null);
  };

  const handleRemoveCard = (index: number) => {
    sound.playClick();
    setPlacedNodeIds(prev => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const handleRunChain = () => {
    sound.playMachineStart();
    const result = validateDependencyChain(placedNodeIds, REQUIRED_EDGES);

    if (result.isValid && placedNodeIds.length === CARDS_POOL.length) {
      // Animate end to end
      let step = 0;
      const interval = setInterval(() => {
        if (step < placedNodeIds.length) {
          setAnimatingStep(step);
          sound.playProductMove();
          step++;
        } else {
          clearInterval(interval);
          setChainSuccess(true);
          sound.playSuccessFlourish();
          dispatch({ type: 'SUBMIT_CHAIN', isValid: true });
          if (!state.completedStops.includes('final-challenge')) {
            dispatch({ type: 'COMPLETE_STOP', stop: 'final-challenge' });
          }
          setFeedback('✓ Outstanding! You successfully assembled the complete economic chain.');
        }
      }, 500);
    } else {
      sound.playClick();
      dispatch({ type: 'SUBMIT_CHAIN', isValid: false });
      setFeedback(`💡 ${result.message}`);
    }
  };

  const handleGoToAssessment = () => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'assessment' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-card p-3 shadow-soft z-20">
        <div>
          <h2 className="text-sm font-black text-textMain">Stop 5: Final Challenge — Chain Builder</h2>
          <p className="text-xs text-textMuted">Solve the detective case and assemble a full product chain in order.</p>
        </div>
        <div className="text-xs font-bold px-3 py-1 rounded-full bg-accentYellow/20 border border-accentYellow/40 text-textMain">
          {chainSuccess ? '✓ Challenge Completed' : 'Assembling Product Chain'}
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="bg-background/80 border border-border/80 rounded-btn px-3 py-1.5 mt-2 flex items-center justify-between text-xs text-textMuted z-10">
        <div className="flex items-center gap-2">
          <span className="text-accentYellow font-bold">💡 How to Play:</span>
          <span>Solve the Detective question first. Then tap cards below into the 5 stages from nature to consumer and click [RUN THE CHAIN].</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative flex-1 w-full my-2 bg-surface border border-border rounded-card p-4 sm:p-5 shadow-soft flex flex-col justify-between overflow-hidden">
        {/* PHASE 1: Detective Seed Case (If not yet completed) */}
        {!detectiveAnswered ? (
          <div className="my-auto max-w-xl mx-auto p-6 bg-background border border-border rounded-card shadow-soft text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accentYellow/30 flex items-center justify-center text-xl">
              🔍
            </div>
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider block mb-1">
              Detective Challenge
            </span>
            <h3 className="text-base font-black text-textMain mb-2">
              &ldquo;Someone runs a bicycle repair stall next to the village bazaar. Which sector does this belong to?&rdquo;
            </h3>
            <p className="text-xs text-textMuted mb-4">
              Think about what is being provided to the community.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleDetectiveChoice('tertiary')}
                className="w-full p-3 rounded-btn text-left text-xs font-bold bg-surface hover:bg-border/40 border border-border text-textMain flex items-center justify-between"
              >
                <span>A. Tertiary Sector — It is a supportive repair service that keeps transport running.</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleDetectiveChoice('primary')}
                className="w-full p-3 rounded-btn text-left text-xs font-bold bg-surface hover:bg-border/40 border border-border text-textMain flex items-center justify-between"
              >
                <span>B. Primary Sector — Because bicycle rubber comes from trees.</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleDetectiveChoice('secondary')}
                className="w-full p-3 rounded-btn text-left text-xs font-bold bg-surface hover:bg-border/40 border border-border text-textMain flex items-center justify-between"
              >
                <span>C. Secondary Sector — Because spanners and wrenches are made in factories.</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          /* PHASE 2: Interactive Chain Assembly Arena */
          <div className="flex-1 flex flex-col justify-between gap-3 h-full">
            {/* Detective Feedback Strip */}
            <div className="p-2.5 rounded-btn bg-statusSuccess/15 border border-statusSuccess/30 text-xs font-medium text-textMain flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-statusSuccess">✓ Detective Solved:</span>
                <span>
                  {detectiveSelected === 'tertiary'
                    ? 'Correct! Repairing cycles is a tertiary support service that helps workers travel.'
                    : 'Good attempt! Repairing cycles provides a tertiary service, supporting workers and transport.'}
                </span>
              </div>
            </div>

            {/* Assembled Slots Sequence (Top) */}
            <div>
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block mb-1.5">
                Your Chain Sequence (Tap cards below to insert in order):
              </span>
              <div className="grid grid-cols-5 gap-2 min-h-[95px]">
                {[0, 1, 2, 3, 4].map((slotIdx) => {
                  const nodeId = placedNodeIds[slotIdx];
                  const card = CARDS_POOL.find(c => c.nodeId === nodeId);
                  const node = ECONOMIC_NODES.find(n => n.id === nodeId);
                  const isHighlightedByRun = animatingStep === slotIdx;

                  return (
                    <div
                      key={slotIdx}
                      className={`rounded-btn p-2 border-2 flex flex-col items-center justify-center text-center transition-all ${
                        isHighlightedByRun
                          ? 'bg-statusSuccess/20 border-statusSuccess shadow-lift scale-105'
                          : card
                          ? 'bg-surface border-textMain shadow-sm'
                          : 'bg-background/60 border-dashed border-border'
                      }`}
                    >
                      {card && node ? (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-border/50 text-textMain">
                              {slotIdx + 1}
                            </span>
                            <NodeIconRenderer name={node.icon} size={16} />
                          </div>
                          <span className="text-xs font-bold text-textMain leading-tight line-clamp-1">{node.label}</span>
                          <button
                            onClick={() => handleRemoveCard(slotIdx)}
                            className="mt-1 text-[10px] text-statusDisrupted hover:underline font-bold"
                            title="Remove from slot"
                          >
                            Remove ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-textMuted/60">Stage {slotIdx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Cards Pool (Bottom) */}
            <div>
              <span className="text-xs font-bold text-textMuted uppercase tracking-wider block mb-1.5">
                Unplaced Activities (Tap to add):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CARDS_POOL.map((card) => {
                  const isPlaced = placedNodeIds.includes(card.nodeId);
                  const node = ECONOMIC_NODES.find(n => n.id === card.nodeId);

                  return (
                    <button
                      key={card.nodeId}
                      onClick={() => !isPlaced && handleAddCard(card.nodeId)}
                      disabled={isPlaced}
                      className={`p-2.5 rounded-btn border text-left transition-all min-h-[44px] ${
                        isPlaced
                          ? 'opacity-30 bg-background/50 border-border cursor-not-allowed'
                          : 'bg-surface hover:bg-background border-border hover:border-textMain shadow-soft hover:scale-102 active:scale-95'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <NodeIconRenderer name={node?.icon || 'shop'} size={18} />
                        <span className="text-[11px] font-black text-textMain line-clamp-1">{node?.label}</span>
                      </div>
                      <p className="text-[10px] text-textMuted leading-tight line-clamp-2">{card.action}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-textMuted">
                {feedback || 'Arrange all 5 stages from natural harvest to classroom desk, then run the chain.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunChain}
                  disabled={placedNodeIds.length < CARDS_POOL.length || chainSuccess}
                  className={`px-6 py-2.5 rounded-btn font-bold text-xs min-h-[44px] flex items-center gap-1.5 shadow-soft transition-all ${
                    placedNodeIds.length === CARDS_POOL.length && !chainSuccess
                      ? 'bg-accentYellow hover:brightness-105 text-textMain cursor-pointer active:scale-95'
                      : chainSuccess
                      ? 'bg-statusSuccess text-white'
                      : 'bg-border/40 text-textMuted/50 cursor-not-allowed'
                  }`}
                >
                  <span>⚡ RUN THE CHAIN</span>
                  <span>→</span>
                </button>

                {chainSuccess && (
                  <button
                    onClick={handleGoToAssessment}
                    className="px-5 py-2.5 rounded-btn bg-textMain text-surface font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5 active:scale-95 animate-in fade-in"
                  >
                    <span>START FINAL ASSESSMENT</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
