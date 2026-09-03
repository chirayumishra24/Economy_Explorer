import React from 'react';
import { IconName, Sector } from '../../types/economy';

interface IconProps {
  className?: string;
  size?: number;
}

export const FarmIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c0-3.3 2.7-6 6-6" />
    <path d="M4 20c0-6.6 5.4-12 12-12" />
    <circle cx="16" cy="6" r="3" />
    <path d="M3 8c1.5 2 4 3 6 3" />
  </svg>
);

export const DairyIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2h8l2 5H6l2-5z" />
    <path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
    <path d="M10 13a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
    <line x1="6" y1="11" x2="18" y2="11" />
  </svg>
);

export const ForestIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L7 9h3l-4 7h12l-4-7h3L12 2z" />
    <path d="M12 16v6" />
  </svg>
);

export const FactoryIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 20h20" />
    <path d="M6 20V10l6 4V10l6 4v6" />
    <circle cx="6" cy="6" r="2" />
  </svg>
);

export const DairyPlantIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="6" width="16" height="15" rx="2" />
    <path d="M8 2h8" />
    <path d="M12 2v4" />
    <circle cx="12" cy="13" r="3" />
    <path d="M9 13h6" />
  </svg>
);

export const WorkshopIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const ShopIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const BankIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="21" x2="21" y2="21" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <polyline points="12 3 2 10 22 10 12 3" />
    <line x1="6" y1="10" x2="6" y2="21" />
    <line x1="10" y1="10" x2="10" y2="21" />
    <line x1="14" y1="10" x2="14" y2="21" />
    <line x1="18" y1="10" x2="18" y2="21" />
  </svg>
);

export const ConsumerIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const SectorBadge: React.FC<{ sector: Sector; className?: string }> = ({ sector, className = "" }) => {
  if (sector === 'primary') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sectorPrimary/15 text-sectorPrimary border border-sectorPrimary/30 ${className}`}>
        <FarmIcon size={12} className="shrink-0" />
        Primary (Nature)
      </span>
    );
  }
  if (sector === 'secondary') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sectorSecondary/15 text-sectorSecondary border border-sectorSecondary/30 ${className}`}>
        <FactoryIcon size={12} className="shrink-0" />
        Secondary (Making)
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sectorTertiary/15 text-sectorTertiary border border-sectorTertiary/30 ${className}`}>
      <TruckIcon size={12} className="shrink-0" />
      Tertiary (Services)
    </span>
  );
};

export const NodeIconRenderer: React.FC<{ name: IconName; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  switch (name) {
    case 'farm':
      return <FarmIcon size={size} className={className} />;
    case 'dairy':
      return <DairyIcon size={size} className={className} />;
    case 'forest':
      return <ForestIcon size={size} className={className} />;
    case 'factory':
      return <FactoryIcon size={size} className={className} />;
    case 'dairy-plant':
      return <DairyPlantIcon size={size} className={className} />;
    case 'workshop':
      return <WorkshopIcon size={size} className={className} />;
    case 'truck':
      return <TruckIcon size={size} className={className} />;
    case 'shop':
      return <ShopIcon size={size} className={className} />;
    case 'bank':
      return <BankIcon size={size} className={className} />;
    case 'consumer':
      return <ConsumerIcon size={size} className={className} />;
    default:
      return <ShopIcon size={size} className={className} />;
  }
};
