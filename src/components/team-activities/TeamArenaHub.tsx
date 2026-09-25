import React, { useState } from 'react';
import { SectorSorterBattle } from './SectorSorterBattle';
import { AmulFlowchartChallenge } from './AmulFlowchartChallenge';
import { sound } from '../../utils/audio';

interface TeamArenaHubProps {
  initialActivity?: 'sector-battle' | 'amul-flowchart' | 'menu';
  onBackToMain: () => void;
}

export const TeamArenaHub: React.FC<TeamArenaHubProps> = ({
  initialActivity = 'menu',
  onBackToMain,
}) => {
  const [activeActivity, setActiveActivity] = useState<'menu' | 'sector-battle' | 'amul-flowchart'>(
    initialActivity
  );

  const handleSelectActivity = (activity: 'sector-battle' | 'amul-flowchart') => {
    sound.playMachineStart();
    setActiveActivity(activity);
  };

  if (activeActivity === 'sector-battle') {
    return (
      <SectorSorterBattle
        onGoToAmulFlowchart={() => {
          sound.playClick();
          setActiveActivity('amul-flowchart');
        }}
        onExit={() => {
          sound.playClick();
          setActiveActivity('menu');
        }}
      />
    );
  }

  if (activeActivity === 'amul-flowchart') {
    return (
      <AmulFlowchartChallenge
        onGoToSectorSorter={() => {
          sound.playClick();
          setActiveActivity('sector-battle');
        }}
        onExit={() => {
          sound.playClick();
          setActiveActivity('menu');
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-background overflow-y-auto select-none">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-border/80">
        <button
          onClick={onBackToMain}
          className="px-3.5 py-2 rounded-btn border border-border bg-surface hover:bg-background text-textMain text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm min-h-[40px]"
        >
          <span>←</span>
          <span>Return to Welcome Screen</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200">
            👥 2-Team Multiplayer Arena
          </span>
        </div>
      </div>

      {/* Main Hero & Activity Chooser */}
      <div className="w-full max-w-5xl mx-auto my-auto py-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accentYellow/20 border border-accentYellow/50 text-textMain text-xs font-black uppercase tracking-wider mb-3">
          <span>🏆 CLASSROOM BATTLE ARENA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-textMain tracking-tight mb-3">
          Two-Team Economics Showdown
        </h1>

        <p className="text-sm sm:text-base text-textMuted max-w-2xl mx-auto font-medium mb-8">
          Split the classroom into two teams! Compete turn-by-turn to classify real-world Indian economic
          activities and build the White Revolution supply chain.
        </p>

        {/* 2 Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Activity 1: 3-Column Sector Sorter Battle */}
          <div
            onClick={() => handleSelectActivity('sector-battle')}
            className="bg-surface rounded-card border-2 border-border/80 hover:border-emerald-500 p-5 shadow-soft hover:shadow-lift transition-all cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Accent Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Activity 1 • Sector Sort
              </span>
              <span className="text-xl">🌾 🏭 🚚</span>
            </div>

            {/* Illustration Graphic */}
            <div className="w-full h-44 rounded-lg overflow-hidden border border-border bg-background mb-3 group-hover:scale-102 transition-transform">
              <img src="./images/primary_farmer_wheat.jpg" alt="Primary Sector Farmer" className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-black text-textMain mb-1.5 group-hover:text-emerald-700 transition-colors">
                Sector Sort
              </h3>
              <p className="text-xs sm:text-sm text-textMuted leading-relaxed mb-4">
                Team Knowledge and Team Heritage take turns dragging picture cards into the Primary, Secondary,
                or Tertiary column. One point for every correct placement!
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-bold text-textMuted">12 Picture Cards • 6 Rounds</span>
              <span className="px-4 py-2 rounded-btn bg-emerald-600 group-hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center gap-1 transition-colors">
                <span>Play Battle</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Activity 2: Amul Case Study Flowchart Challenge */}
          <div
            onClick={() => handleSelectActivity('amul-flowchart')}
            className="bg-surface rounded-card border-2 border-border/80 hover:border-blue-500 p-5 shadow-soft hover:shadow-lift transition-all cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Accent Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                Activity 2 • Amul Story Sequence
              </span>
              <span className="text-xl">🥛 🚛 🏢</span>
            </div>

            {/* Illustration Graphic */}
            <div className="w-full h-44 rounded-lg overflow-hidden border border-border bg-background mb-3 group-hover:scale-102 transition-transform">
              <img src="./images/secondary_dairy_factory.jpg" alt="Amul Dairy Processing Plant" className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-black text-textMain mb-1.5 group-hover:text-blue-700 transition-colors">
                Amul Story Sequence
              </h3>
              <p className="text-xs sm:text-sm text-textMuted leading-relaxed mb-4">
                Both teams build their own 6-step flowchart at the same time, putting the events of the Amul
                story in order. Use hints wisely, then submit your order!
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-bold text-textMuted">3 Stories • 6 Steps Each</span>
              <span className="px-4 py-2 rounded-btn bg-blue-600 group-hover:bg-blue-700 text-white font-black text-xs shadow-sm flex items-center gap-1 transition-colors">
                <span>Start Flowchart</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl mx-auto pt-3 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted gap-2">
        <span>Designed for NCERT Class 6 Social Science Smartboard Classrooms</span>
        <span>Includes Touch Screen Tap-to-Place & Mouse Drag-and-Drop</span>
      </div>
    </div>
  );
};
