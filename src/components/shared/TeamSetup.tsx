'use client';

import React, { useState } from 'react';
import { Users, X, Play, Palette } from 'lucide-react';
import { TEAM_COLORS } from '../../data/activityGameData';

interface TeamSetupProps {
  activityTitle: string;
  onStart: (team1Name: string, team2Name: string, color1: string, color2: string) => void;
  onBack: () => void;
}

export function TeamSetup({ activityTitle, onStart, onBack }: TeamSetupProps) {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [color1Idx, setColor1Idx] = useState(0);
  const [color2Idx, setColor2Idx] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 relative animate-scale-in">
        <button onClick={onBack} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-gray-900">{activityTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">Set up your teams to begin!</p>
        </div>

        <div className="space-y-5">
          {/* Team 1 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Team 1 Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={team1}
                onChange={e => setTeam1(e.target.value)}
                placeholder="e.g. Economic Tigers"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ncert-blue-light focus:border-transparent"
                maxLength={20}
              />
              <div className="flex gap-1">
                {TEAM_COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => { setColor1Idx(i); if (color2Idx === i) setColor2Idx((i + 1) % TEAM_COLORS.length); }}
                    className={`w-9 h-9 rounded-lg ${c.bg} transition-all ${color1Idx === i ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-50 hover:opacity-80'}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Team 2 Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={team2}
                onChange={e => setTeam2(e.target.value)}
                placeholder="e.g. GDP Warriors"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ncert-blue-light focus:border-transparent"
                maxLength={20}
              />
              <div className="flex gap-1">
                {TEAM_COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => { setColor2Idx(i); if (color1Idx === i) setColor1Idx((i + 1) % TEAM_COLORS.length); }}
                    className={`w-9 h-9 rounded-lg ${c.bg} transition-all ${color2Idx === i ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-50 hover:opacity-80'}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onStart(team1, team2, TEAM_COLORS[color1Idx].hex, TEAM_COLORS[color2Idx].hex)}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-ncert-blue to-ncert-blue-light text-white font-semibold 
            flex items-center justify-center gap-2 hover:shadow-elevated transition-all duration-200 active:scale-[0.98]"
        >
          <Play className="w-5 h-5" />
          Start Game!
        </button>
      </div>
    </div>
  );
}
