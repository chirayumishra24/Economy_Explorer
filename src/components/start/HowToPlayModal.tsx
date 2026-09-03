import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { FarmIcon, FactoryIcon, TruckIcon, ShopIcon } from '../icons/EconomicIcons';

interface Props {
  onClose: () => void;
  onStart: () => void;
}

interface Step {
  number: number;
  icon: React.ReactNode;
  label: string;
  rule: string; // <= 8 words!
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: <FarmIcon className="w-8 h-8 text-sectorPrimary" />,
    label: 'Explore Nodes',
    rule: 'Click people to see their economic work.' // 7 words
  },
  {
    number: 2,
    icon: <TruckIcon className="w-8 h-8 text-sectorTertiary" />,
    label: 'Trace Journeys',
    rule: 'Watch raw materials transform into finished goods.' // 7 words
  },
  {
    number: 3,
    icon: <div className="w-8 h-8 rounded-full bg-accentYellow flex items-center justify-center font-bold text-textMain text-lg">?</div>,
    label: 'Predict Disruptions',
    rule: 'Guess what happens before changing the machine.' // 7 words
  },
  {
    number: 4,
    icon: <FactoryIcon className="w-8 h-8 text-sectorSecondary" />,
    label: 'Watch the Ripple',
    rule: 'See consequences travel through all connected activities.' // 7 words
  },
  {
    number: 5,
    icon: <div className="w-8 h-8 rounded-full bg-statusSuccess flex items-center justify-center text-white font-bold text-lg">✓</div>,
    label: 'Repair the Chain',
    rule: 'Reconnect broken routes to restart economic flow.' // 7 words
  },
  {
    number: 6,
    icon: <ShopIcon className="w-8 h-8 text-sectorTertiary" />,
    label: 'Earn Your Badge',
    rule: 'Complete the assessment to become Economy Expert.' // 7 words
  }
];

export const HowToPlayModal: React.FC<Props> = ({ onClose, onStart }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'stops' | 'classroom'>('quick');

  return (
    <div className="fixed inset-0 z-50 bg-textMain/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-card shadow-lift max-w-2xl w-full p-5 sm:p-7 flex flex-col justify-between max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div>
            <h2 className="text-xl font-bold text-textMain">How to Play & Use the Economy Machine</h2>
            <p className="text-xs text-textMuted">Class 6 Social Science · Guide & Instructions</p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-textMuted hover:text-textMain min-h-[44px]"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border/70 pb-2 mb-3">
          <button
            onClick={() => { sound.playClick(); setActiveTab('quick'); }}
            className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'quick' ? 'bg-textMain text-surface shadow-sm' : 'bg-background hover:bg-border/60 text-textMuted border border-border'
            }`}
          >
            📋 Quick Rules
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('stops'); }}
            className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'stops' ? 'bg-textMain text-surface shadow-sm' : 'bg-background hover:bg-border/60 text-textMuted border border-border'
            }`}
          >
            🕹️ Mode-by-Mode Instructions
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('classroom'); }}
            className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'classroom' ? 'bg-textMain text-surface shadow-sm' : 'bg-background hover:bg-border/60 text-textMuted border border-border'
            }`}
          >
            👨‍🏫 Smartboard & Controls
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 scrollable-panel pr-1">
          {activeTab === 'quick' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-1">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="p-3 rounded-btn bg-background border border-border/70 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-textMuted">STEP {step.number}</span>
                      <h3 className="text-sm font-bold text-textMain">{step.label}</h3>
                    </div>
                    <p className="text-xs text-textMuted mt-0.5 leading-snug">{step.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stops' && (
            <div className="space-y-3 my-1 text-xs">
              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-sectorPrimary block mb-1">1. Explore the Economy Machine:</span>
                <p className="text-textMuted leading-relaxed">
                  Click on any worker (farmer, mill operator, truck driver, shopkeeper) to open their card. Learn whether they produce a tangible good or provide a service. Open at least one person in Primary, Secondary, and Tertiary sectors to unlock Stop 2.
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-sectorTertiary block mb-1">2. Follow the Product:</span>
                <p className="text-textMuted leading-relaxed">
                  Select a product (Cotton Shirt, Fresh Milk, or Wooden Desk). Click <strong>[ NEXT STAGE → ]</strong> to move the token stage-by-stage. Watch how raw natural materials are transformed into finished items.
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-statusDisrupted block mb-1">3. What If? (Disruption & Ripple):</span>
                <p className="text-textMuted leading-relaxed">
                  Choose a disruption scenario. The machine freezes! Pick your prediction before running the simulation. Click <strong>[ RUN THE ECONOMY ]</strong> to watch the consequence pulse ripple through connected activities. Choose the explanation to earn reasoning points.
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-statusWarning block mb-1">4. Fix the Economy:</span>
                <p className="text-textMuted leading-relaxed">
                  The economy arrives with 2 missing routes. Tap a starting node (e.g. Cotton Farm), then tap its destination (Transport Truck) to draw the missing link. No dragging required! Once repaired, click <strong>[ TEST SYSTEM ]</strong>.
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-textMain block mb-1">5. Final Challenge (Chain Builder):</span>
                <p className="text-textMuted leading-relaxed">
                  First solve the Detective case. Then tap the shuffled cards in order from nature to the final school consumer. Click <strong>[ RUN THE CHAIN ]</strong> to animate the completed journey.
                </p>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70">
                <span className="font-bold text-statusSuccess block mb-1">6. Assessment & Evaluation:</span>
                <p className="text-textMuted leading-relaxed">
                  Answer 10 curriculum questions. Each question displays an immediate explanation. Review your 100-point score breakdown across Exploration, Prediction, Reasoning, Problem Solving, and Assessment.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'classroom' && (
            <div className="space-y-3 my-1 text-xs">
              <div className="p-3 rounded-btn bg-background border border-border/70 flex items-start gap-3">
                <span className="text-xl">👨‍🏫</span>
                <div>
                  <h4 className="font-bold text-textMain">Classroom Mode (Smartboard)</h4>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Tap the 👨‍🏫 icon in the top header. This scales all text and touch buttons to 125% for easy viewing from the back of the classroom and hides individual student scores.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70 flex items-start gap-3">
                <span className="text-xl">🔊</span>
                <div>
                  <h4 className="font-bold text-textMain">Synthesized Audio</h4>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Toggle sound using the speaker icon. Sounds are generated live with the Web Audio API — completely offline without external audio files. Default is muted.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70 flex items-start gap-3">
                <span className="text-xl">⌨️</span>
                <div>
                  <h4 className="font-bold text-textMain">Keyboard & Touch Operability</h4>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    All buttons and node cards support full keyboard access (Tab and Enter/Space). On smartboards and tablets, all connections work with two simple taps without dragging.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-btn bg-background border border-border/70 flex items-start gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="font-bold text-textMain">Teacher Reports & Printing</h4>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Click &ldquo;For Teachers&rdquo; in the footer to review class progress and print a clean session summary using browser print (Ctrl+P / ⌘+P). Zero student PII is collected.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-4 pt-3 border-t border-border flex justify-end gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-btn border border-border text-xs font-bold text-textMain hover:bg-background min-h-[44px]"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              sound.playMachineStart();
              onStart();
            }}
            className="px-6 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain text-sm font-bold shadow-soft min-h-[44px] flex items-center gap-2 active:scale-95 transition-transform"
          >
            <span>LET&apos;S START</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
