import React from 'react';

interface MilkPipelineConnectorProps {
  isFlowing: boolean;
  hasError: boolean;
  className?: string;
}

export const MilkPipelineConnector: React.FC<MilkPipelineConnectorProps> = ({
  isFlowing,
  hasError,
  className = "w-8 h-full flex items-center justify-center shrink-0",
}) => {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 40 24"
        className="w-8 sm:w-10 h-6 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pipe background track */}
        <line
          x1="2"
          y1="12"
          x2="30"
          y2="12"
          stroke={hasError ? '#EF4444' : isFlowing ? '#3B82F6' : '#CBD5E1'}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated milk fluid inside pipe */}
        {isFlowing && (
          <line
            x1="2"
            y1="12"
            x2="30"
            y2="12"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        )}

        {/* Arrow head */}
        <polygon
          points="26,6 38,12 26,18"
          fill={hasError ? '#EF4444' : isFlowing ? '#2563EB' : '#94A3B8'}
        />

        {/* Flowing Milk Droplet Icon */}
        {isFlowing && (
          <circle cx="18" cy="12" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" className="animate-ping" />
        )}
      </svg>
    </div>
  );
};
