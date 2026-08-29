'use client';

import React from 'react';

interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
  urgency: 'safe' | 'warning' | 'danger';
  formattedTime: string;
  size?: 'sm' | 'lg';
}

export function GameTimer({ timeLeft, totalTime, urgency, formattedTime, size = 'lg' }: GameTimerProps) {
  const radius = size === 'lg' ? 50 : 30;
  const strokeWidth = size === 'lg' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const dashOffset = circumference * (1 - progress);

  const colors = {
    safe: { stroke: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    warning: { stroke: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    danger: { stroke: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  };

  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill={colors[urgency].bg}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke={colors[urgency].stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className={`absolute font-bold font-mono tabular-nums ${
        size === 'lg' ? 'text-xl' : 'text-sm'
      } ${urgency === 'danger' ? 'text-red-500 animate-pulse' : urgency === 'warning' ? 'text-amber-500' : 'text-gray-700'}`}>
        {formattedTime}
      </span>
    </div>
  );
}
