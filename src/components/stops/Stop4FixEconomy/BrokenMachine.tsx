import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { CONNECTIONS, getWrongLinkFeedback } from '../../../data/connections';
import { NodeIconRenderer } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';

interface MissingLink {
  from: string;
  to: string;
  label: string;
  fixed: boolean;
}

export const BrokenMachine: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    'Diagnosis: 2 routes are disconnected. Click a source node, then click where goods should flow next.'
  );
  const [isTestedAndRunning, setIsTestedAndRunning] = useState<boolean>(false);

  // The 2 missing links to repair
  const [links, setLinks] = useState<MissingLink[]>([
    { from: 'cotton-farm', to: 'transport-truck', label: 'Farm to Truck (Raw Cotton)', fixed: false },
    { from: 'textile-mill', to: 'bazaar-shop', label: 'Mill to Bazaar (Finished Shirts)', fixed: false }
  ]);

  const allFixed = links.every(l => l.fixed);

  const handleNodeClick = (nodeId: string) => {
    sound.playClick();

    if (!selectedSourceId) {
      // First tap: Select source
      setSelectedSourceId(nodeId);
      const sourceNode = ECONOMIC_NODES.find(n => n.id === nodeId);
      setFeedbackMessage(`Selected ${sourceNode?.label}. Now tap where its goods or materials should travel next.`);
    } else {
      // Second tap: Select target and attempt connection
      if (selectedSourceId === nodeId) {
        // Deselect
        setSelectedSourceId(null);
        setFeedbackMessage('Selection cleared. Tap a source node to begin.');
        return;
      }

      // Check if this pair matches an unfixed required missing link
      const matchIndex = links.findIndex(
        l => !l.fixed && l.from === selectedSourceId && l.to === nodeId
      );

      if (matchIndex !== -1) {
        // Correct link repaired!
        sound.playConnectionMade();
        const updated = [...links];
        updated[matchIndex].fixed = true;
        setLinks(updated);

        const conn = CONNECTIONS.find(c => c.from === selectedSourceId && c.to === nodeId);
        dispatch({ type: 'ADD_FIXED_CONNECTION', connectionId: `${selectedSourceId}->${nodeId}` });

        setFeedbackMessage(`✓ Route connected! ${conn?.rationale || 'Goods can now flow between these stages.'}`);
        setSelectedSourceId(null);
      } else {
        // Wrong link attempted
        dispatch({ type: 'RECORD_WRONG_FIX' });
        const feedback = getWrongLinkFeedback(selectedSourceId, nodeId);
        setFeedbackMessage(`💡 ${feedback}`);
        setSelectedSourceId(null);
      }
    }
  };

  const handleTestSystem = () => {
    if (!allFixed) return;
    sound.playMachineStart();
    setIsTestedAndRunning(true);
    sound.playChallengeComplete();

    if (!state.completedStops.includes('fix-economy')) {
      dispatch({ type: 'COMPLETE_STOP', stop: 'fix-economy' });
    }
  };

  const handleGoToChallenge = () => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'final-challenge' });
  };

  // 4 Focused nodes for this repair scene
  const sceneNodeIds = ['cotton-farm', 'transport-truck', 'textile-mill', 'bazaar-shop'];
  const sceneNodes = ECONOMIC_NODES.filter(n => sceneNodeIds.includes(n.id));

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-card p-3 shadow-soft z-20">
        <div>
          <h2 className="text-sm font-black text-textMain">Fix the Broken Economy Machine</h2>
          <p className="text-xs text-textMuted">
            Tap a source node, then tap its destination to repair the missing connections.
          </p>
        </div>

        {/* Repair Checklist */}
        <div className="flex items-center gap-2">
          {links.map((link, idx) => (
            <div
              key={idx}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                link.fixed
                  ? 'bg-statusSuccess/15 text-statusSuccess border-statusSuccess/40'
                  : 'bg-statusDisrupted/15 text-statusDisrupted border-statusDisrupted/40'
              }`}
            >
              <span>{link.fixed ? '✓' : '⚠️'}</span>
              <span>{link.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="bg-background/80 border border-border/80 rounded-btn px-3 py-1.5 mt-2 flex items-center justify-between text-xs text-textMuted z-10">
        <div className="flex items-center gap-2">
          <span className="text-accentYellow font-bold">💡 How to Play:</span>
          <span>Tap a starting node, then tap its destination to draw the missing route. Once both routes are repaired, click [TEST SYSTEM] to verify.</span>
        </div>
      </div>

      {/* Main Repair Canvas */}
      <div className="relative flex-1 w-full my-2 bg-surface border border-border rounded-card p-6 shadow-soft flex flex-col justify-between overflow-hidden">
        {/* Diagnostic Feedback Prompt */}
        <div className="p-3 bg-background border border-border rounded-btn text-xs font-medium text-textMain flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>{feedbackMessage}</span>
          </div>
          {selectedSourceId && (
            <button
              onClick={() => { setSelectedSourceId(null); setFeedbackMessage('Selection cleared.'); }}
              className="text-[11px] font-bold text-textMuted hover:text-textMain underline ml-2"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Repair Circuit (Horizontal 4-Node Sequence) */}
        <div className="flex-1 flex items-center justify-around px-4 my-auto relative">
          {sceneNodes.map((node) => {
            const isSourceSelected = selectedSourceId === node.id;
            const isMillInactive = node.id === 'textile-mill' && !links[0].fixed;

            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => handleNodeClick(node.id)}
                  className={`w-20 h-20 rounded-card border-2 flex flex-col items-center justify-center transition-all min-h-[44px] min-w-[44px] ${
                    isSourceSelected
                      ? 'bg-accentYellow/30 border-accentYellow shadow-lift scale-110 ring-4 ring-accentYellow/30'
                      : isMillInactive
                      ? 'bg-background/60 border-dashed border-statusDisrupted/60 opacity-60'
                      : 'bg-surface border-border hover:border-textMain shadow-sm hover:scale-105 active:scale-95'
                  }`}
                  aria-label={`Node ${node.label}, ${isSourceSelected ? 'selected' : 'not selected'}`}
                >
                  <NodeIconRenderer name={node.icon} size={28} />
                  <span className="text-[10px] font-bold text-textMain mt-1 leading-tight text-center px-1">
                    {node.label}
                  </span>
                </button>

                {isMillInactive && (
                  <span className="text-[9px] font-bold text-statusDisrupted bg-statusDisrupted/10 rounded px-1.5 py-0.5 mt-1">
                    Halted: Waiting for cotton
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-textMuted">
            {allFixed
              ? 'All broken links repaired! Run system test to verify economic flow.'
              : 'Keep reconnecting the nodes in the direction of goods travel.'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSystem}
              disabled={!allFixed || isTestedAndRunning}
              className={`px-6 py-2.5 rounded-btn font-bold text-xs min-h-[44px] flex items-center gap-1.5 shadow-soft transition-all ${
                allFixed && !isTestedAndRunning
                  ? 'bg-accentYellow hover:brightness-105 text-textMain cursor-pointer active:scale-95'
                  : isTestedAndRunning
                  ? 'bg-statusSuccess text-white'
                  : 'bg-border/40 text-textMuted/50 cursor-not-allowed'
              }`}
            >
              {isTestedAndRunning ? '✓ SYSTEM OPERATIONAL' : '⚡ TEST SYSTEM'}
            </button>

            {isTestedAndRunning && (
              <button
                onClick={handleGoToChallenge}
                className="px-5 py-2.5 rounded-btn bg-textMain text-surface font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5 active:scale-95 animate-in fade-in"
              >
                <span>TAKE FINAL CHALLENGE</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
