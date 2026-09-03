import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { CONNECTIONS } from '../../../data/connections';
import { EconomicNode, Sector } from '../../../types/economy';
import { NodeCard } from './NodeCard';
import { NodeIconRenderer } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';

export const ExploreMap: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [selectedNode, setSelectedNode] = useState<EconomicNode | null>(null);
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');
  const [kindFilter, setKindFilter] = useState<'all' | 'good' | 'service'>('all');

  const visitedPrimary = state.visitedNodeIds.some(id => {
    const n = ECONOMIC_NODES.find(item => item.id === id);
    return n?.sector === 'primary';
  });
  const visitedSecondary = state.visitedNodeIds.some(id => {
    const n = ECONOMIC_NODES.find(item => item.id === id);
    return n?.sector === 'secondary';
  });
  const visitedTertiary = state.visitedNodeIds.some(id => {
    const n = ECONOMIC_NODES.find(item => item.id === id);
    return n?.sector === 'tertiary';
  });

  const isExploreComplete = visitedPrimary && visitedSecondary && visitedTertiary;

  const handleNodeClick = (node: EconomicNode) => {
    sound.playClick();
    setSelectedNode(node);
    dispatch({ type: 'VISIT_NODE', nodeId: node.id });

    // Check if this click completes the exploration
    const nextVisited = [...state.visitedNodeIds, node.id];
    const p = nextVisited.some(id => ECONOMIC_NODES.find(n => n.id === id)?.sector === 'primary');
    const s = nextVisited.some(id => ECONOMIC_NODES.find(n => n.id === id)?.sector === 'secondary');
    const t = nextVisited.some(id => ECONOMIC_NODES.find(n => n.id === id)?.sector === 'tertiary');
    if (p && s && t && !state.completedStops.includes('explore')) {
      sound.playChallengeComplete();
      dispatch({ type: 'COMPLETE_STOP', stop: 'explore' });
    }
  };

  const handleNextStop = () => {
    sound.playClick();
    dispatch({ type: 'NAVIGATE_STOP', stop: 'follow-product' });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Bar: Sector Filter & Mission Goal */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/90 border border-border rounded-card p-3 shadow-soft z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Highlight:</span>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('all'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'all' ? 'bg-textMain text-surface' : 'bg-background hover:bg-border/60 text-textMain border border-border'
            }`}
          >
            All Sectors
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('primary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'primary' ? 'bg-sectorPrimary text-surface' : 'bg-sectorPrimary/15 text-sectorPrimary border border-sectorPrimary/30 hover:bg-sectorPrimary/25'
            }`}
          >
            Primary (Nature)
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('secondary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'secondary' ? 'bg-sectorSecondary text-surface' : 'bg-sectorSecondary/15 text-sectorSecondary border border-sectorSecondary/30 hover:bg-sectorSecondary/25'
            }`}
          >
            Secondary (Making)
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('tertiary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'tertiary' ? 'bg-sectorTertiary text-surface' : 'bg-sectorTertiary/15 text-sectorTertiary border border-sectorTertiary/30 hover:bg-sectorTertiary/25'
            }`}
          >
            Tertiary (Services)
          </button>
        </div>

        {/* Goods vs Services Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider hidden sm:inline">Output:</span>
          <button
            onClick={() => { sound.playClick(); setKindFilter(kindFilter === 'good' ? 'all' : 'good'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              kindFilter === 'good' ? 'bg-accentYellow text-textMain font-bold' : 'bg-background hover:bg-border/60 text-textMuted border border-border'
            }`}
          >
            📦 Goods Only
          </button>
          <button
            onClick={() => { sound.playClick(); setKindFilter(kindFilter === 'service' ? 'all' : 'service'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              kindFilter === 'service' ? 'bg-accentYellow text-textMain font-bold' : 'bg-background hover:bg-border/60 text-textMuted border border-border'
            }`}
          >
            🤝 Services Only
          </button>
        </div>

        {/* Exploration Goal Checklist */}
        <div className="flex items-center gap-2 text-xs font-bold bg-background px-3 py-1.5 rounded-btn border border-border">
          <span className="text-textMuted font-normal">Mission:</span>
          <span className={visitedPrimary ? 'text-sectorPrimary' : 'text-textMuted'}>
            {visitedPrimary ? '✓' : '○'} Primary
          </span>
          <span className={visitedSecondary ? 'text-sectorSecondary' : 'text-textMuted'}>
            {visitedSecondary ? '✓' : '○'} Secondary
          </span>
          <span className={visitedTertiary ? 'text-sectorTertiary' : 'text-textMuted'}>
            {visitedTertiary ? '✓' : '○'} Tertiary
          </span>
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="bg-background/80 border border-border/80 rounded-btn px-3 py-1.5 mt-2 flex items-center justify-between text-xs text-textMuted z-10">
        <div className="flex items-center gap-2">
          <span className="text-accentYellow font-bold">💡 How to Play:</span>
          <span>Tap any node on the map to inspect who works there, what they do, and their sector. Explore at least one of each sector to unlock Stop 2.</span>
        </div>
      </div>

      {/* Main Graph Interactive Canvas */}
      <div className="relative flex-1 w-full h-full my-2 bg-surface border border-border rounded-card shadow-soft overflow-hidden">
        {/* SVG Connection Tracks and Moving Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#B3ACA0" />
            </marker>
          </defs>

          {CONNECTIONS.map((conn) => {
            const fromNode = ECONOMIC_NODES.find(n => n.id === conn.from);
            const toNode = ECONOMIC_NODES.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              (sectorFilter === 'all' || fromNode.sector === sectorFilter || toNode.sector === sectorFilter) &&
              (kindFilter === 'all' || fromNode.output.kind === kindFilter || toNode.output.kind === kindFilter);

            return (
              <g key={conn.id} opacity={isHighlighted ? 0.9 : 0.2} className="transition-opacity duration-300">
                {/* Connection Line */}
                <line
                  x1={`${fromNode.position.x}%`}
                  y1={`${fromNode.position.y}%`}
                  x2={`${toNode.position.x}%`}
                  y2={`${toNode.position.y}%`}
                  stroke="#CDC6BA"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  markerEnd="url(#arrow)"
                />

                {/* Animated Packet Pulse along connection */}
                {!state.reducedMotion && (
                  <circle r="4" fill={fromNode.sector === 'primary' ? '#2E8B57' : fromNode.sector === 'secondary' ? '#E07A3F' : '#2F6FB0'}>
                    <animate
                      attributeName="cx"
                      values={`${fromNode.position.x}%;${toNode.position.x}%`}
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values={`${fromNode.position.y}%;${toNode.position.y}%`}
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* 10 Economic Nodes Rendered on Canvas */}
        {ECONOMIC_NODES.map((node) => {
          const isVisited = state.visitedNodeIds.includes(node.id);
          const isMatchingSector = sectorFilter === 'all' || node.sector === sectorFilter;
          const isMatchingKind = kindFilter === 'all' || node.output.kind === kindFilter;
          const isDimmed = !isMatchingSector || !isMatchingKind;

          const sectorBorderColor =
            node.sector === 'primary'
              ? 'border-sectorPrimary hover:bg-sectorPrimary/10'
              : node.sector === 'secondary'
              ? 'border-sectorSecondary hover:bg-sectorSecondary/10'
              : 'border-sectorTertiary hover:bg-sectorTertiary/10';

          return (
            <div
              key={node.id}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-10 transition-all duration-300 ${
                isDimmed ? 'opacity-30 scale-90' : 'opacity-100 scale-100'
              }`}
            >
              <button
                onClick={() => handleNodeClick(node)}
                className={`flex flex-col items-center p-2.5 rounded-card bg-surface border-2 shadow-soft hover:shadow-lift hover:scale-105 active:scale-95 transition-all min-h-[44px] min-w-[110px] ${sectorBorderColor}`}
                title={`Click to inspect ${node.label} (${node.who})`}
                aria-label={`Inspect ${node.label}, ${node.sector} sector`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`p-1.5 rounded-full ${
                    node.sector === 'primary' ? 'bg-sectorPrimary/15 text-sectorPrimary' : node.sector === 'secondary' ? 'bg-sectorSecondary/15 text-sectorSecondary' : 'bg-sectorTertiary/15 text-sectorTertiary'
                  }`}>
                    <NodeIconRenderer name={node.icon} size={22} />
                  </div>
                  {isVisited && (
                    <span className="w-4 h-4 rounded-full bg-statusSuccess text-white text-[10px] flex items-center justify-center font-bold" title="Explored">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-textMain text-center leading-tight">
                  {node.label}
                </span>
                <span className="text-[10px] text-textMuted mt-0.5 truncate max-w-[100px]">
                  {node.who.split(',')[0]}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Completion Banner / Next Step Prompt */}
      {isExploreComplete && (
        <div className="mt-2 bg-statusSuccess/15 border border-statusSuccess/40 rounded-card p-3 flex items-center justify-between z-20 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-statusSuccess text-white flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <div>
              <h4 className="text-sm font-bold text-textMain">Exploration Complete!</h4>
              <p className="text-xs text-textMuted">You discovered people and activities in all three sectors of the economy.</p>
            </div>
          </div>
          <button
            onClick={handleNextStop}
            className="px-5 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5"
          >
            <span>CONTINUE TO FOLLOW THE PRODUCT</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Inspector Modal */}
      {selectedNode && (
        <NodeCard
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};
