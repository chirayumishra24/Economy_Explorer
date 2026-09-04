import React, { useState } from 'react';
import { useEconomy } from '../../../context/EconomyStore';
import { ECONOMIC_NODES } from '../../../data/nodes';
import { CONNECTIONS } from '../../../data/connections';
import { EconomicNode, Sector } from '../../../types/economy';
import { NodeCard } from './NodeCard';
import { NodeIconRenderer } from '../../icons/EconomicIcons';
import { sound } from '../../../utils/audio';
import { UI_TRANSLATIONS, NODE_TRANSLATIONS } from '../../../data/translations';

export const ExploreMap: React.FC = () => {
  const { state, dispatch } = useEconomy();
  const [selectedNode, setSelectedNode] = useState<EconomicNode | null>(null);
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');

  const lang = state.language;
  const ui = UI_TRANSLATIONS[lang];
  const isMoneyFlow = state.flowMode === 'money';

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

  const handleToggleFlowMode = (mode: 'goods' | 'money') => {
    sound.playClick();
    dispatch({ type: 'SET_FLOW_MODE', flowMode: mode });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Bar: Sector Filter & Flow Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/90 border border-border rounded-card p-3 shadow-soft z-20">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
            {lang === 'hi' ? 'दिखाएं:' : 'Highlight:'}
          </span>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('all'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'all' ? 'bg-textMain text-surface' : 'bg-background hover:bg-border/60 text-textMain border border-border'
            }`}
          >
            {ui.sectors.all}
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('primary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'primary' ? 'bg-sectorPrimary text-surface' : 'bg-sectorPrimary/15 text-sectorPrimary border border-sectorPrimary/30 hover:bg-sectorPrimary/25'
            }`}
          >
            {ui.sectors.primary}
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('secondary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'secondary' ? 'bg-sectorSecondary text-surface' : 'bg-sectorSecondary/15 text-sectorSecondary border border-sectorSecondary/30 hover:bg-sectorSecondary/25'
            }`}
          >
            {ui.sectors.secondary}
          </button>
          <button
            onClick={() => { sound.playClick(); setSectorFilter('tertiary'); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              sectorFilter === 'tertiary' ? 'bg-sectorTertiary text-surface' : 'bg-sectorTertiary/15 text-sectorTertiary border border-sectorTertiary/30 hover:bg-sectorTertiary/25'
            }`}
          >
            {ui.sectors.tertiary}
          </button>
        </div>

        {/* Dual Flow Mode Selector */}
        <div className="flex items-center gap-1.5 bg-background p-1 rounded-btn border border-border">
          <button
            onClick={() => handleToggleFlowMode('goods')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all min-h-[32px] ${
              !isMoneyFlow
                ? 'bg-textMain text-surface shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            {ui.flowMode.goods}
          </button>
          <button
            onClick={() => handleToggleFlowMode('money')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all min-h-[32px] ${
              isMoneyFlow
                ? 'bg-accentOrange text-surface shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            {ui.flowMode.money}
          </button>
        </div>

        {/* Exploration Goal Checklist */}
        <div className="flex items-center gap-2 text-xs font-bold bg-background px-3 py-1.5 rounded-btn border border-border">
          <span className="text-textMuted font-normal">{lang === 'hi' ? 'मिशन:' : 'Mission:'}</span>
          <span className={visitedPrimary ? 'text-sectorPrimary' : 'text-textMuted'}>
            {visitedPrimary ? '✓' : '○'} {lang === 'hi' ? 'प्राथमिक' : 'Primary'}
          </span>
          <span className={visitedSecondary ? 'text-sectorSecondary' : 'text-textMuted'}>
            {visitedSecondary ? '✓' : '○'} {lang === 'hi' ? 'द्वितीयक' : 'Secondary'}
          </span>
          <span className={visitedTertiary ? 'text-sectorTertiary' : 'text-textMuted'}>
            {visitedTertiary ? '✓' : '○'} {lang === 'hi' ? 'तृतीयक' : 'Tertiary'}
          </span>
        </div>
      </div>

      {/* Dynamic Flow & Educational Info Banner */}
      <div className={`border rounded-btn px-3 py-2 mt-2 flex items-center justify-between text-xs z-10 transition-colors duration-300 ${
        isMoneyFlow
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-900'
          : 'bg-background/80 border-border/80 text-textMuted'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{isMoneyFlow ? '💸' : '💡'}</span>
          <span className="font-medium leading-relaxed">
            {isMoneyFlow ? ui.flowMode.bannerMoney : ui.flowMode.bannerGoods}
          </span>
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
              sectorFilter === 'all' || fromNode.sector === sectorFilter || toNode.sector === sectorFilter;

            return (
              <g key={conn.id} opacity={isHighlighted ? 0.9 : 0.2} className="transition-opacity duration-300">
                {/* Connection Line */}
                <line
                  x1={`${fromNode.position.x}%`}
                  y1={`${fromNode.position.y}%`}
                  x2={`${toNode.position.x}%`}
                  y2={`${toNode.position.y}%`}
                  stroke={isMoneyFlow ? '#E5A93C' : '#CDC6BA'}
                  strokeWidth={isMoneyFlow ? '3' : '2.5'}
                  strokeDasharray={isMoneyFlow ? '6,3' : '4,4'}
                  markerEnd="url(#arrow)"
                />

                {/* Animated Packet / Currency Pulse along connection */}
                {!state.reducedMotion && (
                  isMoneyFlow ? (
                    <g>
                      <circle r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5">
                        <animate
                          attributeName="cx"
                          values={`${toNode.position.x}%;${fromNode.position.x}%`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values={`${toNode.position.y}%;${fromNode.position.y}%`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <text
                        fontSize="9"
                        fontWeight="900"
                        fill="#FFFFFF"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        ₹
                        <animate
                          attributeName="x"
                          values={`${toNode.position.x}%;${fromNode.position.x}%`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="y"
                          values={`${toNode.position.y}%;${fromNode.position.y}%`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </text>
                    </g>
                  ) : (
                    <circle r="4.5" fill={fromNode.sector === 'primary' ? '#2E8B57' : fromNode.sector === 'secondary' ? '#E07A3F' : '#2F6FB0'}>
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
                  )
                )}
              </g>
            );
          })}
        </svg>

        {/* 10 Economic Nodes Rendered on Canvas */}
        {ECONOMIC_NODES.map((node) => {
          const trans = NODE_TRANSLATIONS[node.id]?.[lang];
          const displayLabel = trans?.label || node.label;
          const displayWho = trans?.who || node.who;

          const isVisited = state.visitedNodeIds.includes(node.id);
          const isMatchingSector = sectorFilter === 'all' || node.sector === sectorFilter;
          const isDimmed = !isMatchingSector;

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
                title={`Click to inspect ${displayLabel} (${displayWho})`}
                aria-label={`Inspect ${displayLabel}, ${node.sector} sector`}
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
                  {displayLabel}
                </span>
                <span className="text-[10px] text-textMuted mt-0.5 truncate max-w-[100px]">
                  {displayWho.split(',')[0]}
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
              <h4 className="text-sm font-bold text-textMain">
                {lang === 'hi' ? 'अन्वेषण पूरा हुआ!' : 'Exploration Complete!'}
              </h4>
              <p className="text-xs text-textMuted">
                {lang === 'hi'
                  ? 'आपने अर्थव्यवस्था के तीनों क्षेत्रों के लोगों और गतिविधियों को खोज लिया है।'
                  : 'You discovered people and activities in all three sectors of the economy.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleNextStop}
            className="px-5 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-bold text-xs shadow-soft min-h-[44px] flex items-center gap-1.5"
          >
            <span>
              {lang === 'hi' ? 'उत्पाद की यात्रा देखें' : 'CONTINUE TO FOLLOW THE PRODUCT'}
            </span>
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
