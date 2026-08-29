'use client';

import React from 'react';
import {
  Gavel, Link, MessageCircle, ArrowLeftRight, Zap, Dices,
  Users, Swords, Clock, Signal, ChevronRight
} from 'lucide-react';
import { ACTIVITIES } from '../../data/activityGameData';
import { ActivityId, GameMode } from '../../types/economy';
import { sound } from '../../utils/soundEffects';

const ICON_MAP: Record<string, React.ReactNode> = {
  Gavel: <Gavel className="w-8 h-8" />,
  Link: <Link className="w-8 h-8" />,
  MessageCircle: <MessageCircle className="w-8 h-8" />,
  ArrowLeftRight: <ArrowLeftRight className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Dices: <Dices className="w-8 h-8" />,
};

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
};

interface ActivityHubProps {
  onSelectActivity: (id: ActivityId, mode: GameMode) => void;
}

export function ActivityHub({ onSelectActivity }: ActivityHubProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Hero Title */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ncert-blue-50 text-ncert-blue text-sm font-medium mb-4">
          <Signal className="w-4 h-4" />
          NCERT Grade 6 — Economic Activities
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ncert-blue-dark mb-3">
          Economy <span className="bg-gradient-to-r from-ncert-primarySector via-ncert-secondarySector to-ncert-tertiarySector bg-clip-text text-transparent">Explorer</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Choose an activity and compete! Team battles or 1v1 showdowns — test your economy knowledge through play.
        </p>
      </div>

      {/* Category Labels */}
      <div className="w-full max-w-5xl">
        {/* Team Activities */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Team Activities</h2>
            <span className="text-xs text-gray-400 ml-1">— 2 Teams compete</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.filter(a => a.mode === 'team').map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i}
                onSelect={() => onSelectActivity(activity.id, activity.mode)}
              />
            ))}
          </div>
        </div>

        {/* Individual Activities */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center">
              <Swords className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">1v1 Individual Battles</h2>
            <span className="text-xs text-gray-400 ml-1">— 2 Players compete</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.filter(a => a.mode === 'individual').map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i + 3}
                onSelect={() => onSelectActivity(activity.id, activity.mode)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, index, onSelect }: {
  activity: typeof ACTIVITIES[number];
  index: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={() => {
        sound.playClick();
        onSelect();
      }}
      className="group relative text-left bg-white rounded-2xl border border-gray-100 p-5 
        shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-ncert-blue-light focus:ring-offset-2"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ncert-primarySector-bg via-ncert-secondarySector-bg to-ncert-tertiarySector-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Icon + Badge row */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ncert-blue to-ncert-blue-light flex items-center justify-center text-white shadow-soft">
            {ICON_MAP[activity.icon] || <Zap className="w-6 h-6" />}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[activity.difficulty]}`}>
            {activity.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-ncert-blue transition-colors">
          {activity.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
          {activity.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {activity.duration}
          </span>
          <span className="flex items-center gap-1">
            {activity.mode === 'team' ? <Users className="w-3.5 h-3.5" /> : <Swords className="w-3.5 h-3.5" />}
            {activity.playerCount}
          </span>
        </div>

        {/* Concepts */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {activity.concepts.slice(0, 2).map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
              {c}
            </span>
          ))}
        </div>

        {/* Play arrow */}
        <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-ncert-blue/10 flex items-center justify-center 
          opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
          <ChevronRight className="w-4 h-4 text-ncert-blue" />
        </div>
      </div>
    </button>
  );
}
