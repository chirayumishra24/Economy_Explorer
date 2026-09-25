import React from 'react';

interface SceneProps {
  className?: string;
  size?: number | string;
}

export const WheatHarvestScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FEF3C7" />
    {/* Sun */}
    <circle cx="165" cy="30" r="18" fill="#FBBF24" />
    <circle cx="165" cy="30" r="23" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
    {/* Rolling Hill background */}
    <path d="M0 90 Q 60 70 120 85 T 200 80 L 200 130 L 0 130 Z" fill="#D97706" fillOpacity="0.25" />
    <path d="M0 100 Q 80 85 150 98 T 200 95 L 200 130 L 0 130 Z" fill="#F59E0B" fillOpacity="0.4" />
    {/* Wheat Stalks */}
    {[20, 35, 50, 70, 85, 105, 120, 140, 160, 180].map((x, i) => (
      <g key={i}>
        <path d={`M ${x} 125 Q ${x + 5} 95 ${x + (i % 2 === 0 ? 6 : -4)} 75`} stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx={x + (i % 2 === 0 ? 7 : -3)} cy="72" rx="4" ry="8" fill="#FBBF24" transform={`rotate(${i % 2 === 0 ? 15 : -15} ${x} 72)`} />
        <ellipse cx={x + (i % 2 === 0 ? 4 : -6)} cy="80" rx="3.5" ry="6" fill="#F59E0B" />
      </g>
    ))}
    {/* Farmer Character Silhouette with Sickle */}
    <circle cx="70" cy="55" r="9" fill="#92400E" />
    <path d="M60 52 C 60 46 80 46 80 52" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
    <path d="M64 64 L 76 64 L 80 92 L 60 92 Z" fill="#B45309" />
    {/* Arm & Sickle */}
    <path d="M76 66 L 90 74" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
    <path d="M88 74 C 95 68 100 78 94 82" stroke="#6B7280" strokeWidth="2.5" fill="none" />
    {/* Cut Wheat Sheaf */}
    <rect x="100" y="85" width="22" height="15" rx="3" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
    <line x1="111" y1="85" x2="111" y2="100" stroke="#B45309" strokeWidth="2" />
  </svg>
);

export const DairyMilkingScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#ECFDF5" />
    {/* Shed Frame */}
    <path d="M10 25 L 100 8 L 190 25" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
    <line x1="25" y1="25" x2="25" y2="120" stroke="#10B981" strokeWidth="2.5" />
    <line x1="175" y1="25" x2="175" y2="120" stroke="#10B981" strokeWidth="2.5" />
    {/* Floor Hay */}
    <rect x="15" y="112" width="170" height="12" rx="4" fill="#FDE68A" />
    {/* Cow Body */}
    <ellipse cx="115" cy="72" rx="42" ry="26" fill="#F3F4F6" stroke="#374151" strokeWidth="2" />
    {/* Cow Spots */}
    <path d="M95 62 Q 105 55 110 68 Q 102 78 95 62 Z" fill="#1F2937" />
    <path d="M125 72 Q 135 68 138 80 Q 128 85 125 72 Z" fill="#1F2937" />
    {/* Cow Head */}
    <ellipse cx="65" cy="58" rx="16" ry="14" fill="#F3F4F6" stroke="#374151" strokeWidth="2" />
    <ellipse cx="65" cy="65" rx="10" ry="7" fill="#FECDD3" />
    <circle cx="61" cy="54" r="2.5" fill="#111827" />
    <path d="M54 48 L 50 38 Q 55 42 58 46" fill="#D1D5DB" stroke="#374151" strokeWidth="1.5" />
    <path d="M72 48 L 76 38 Q 72 42 68 46" fill="#D1D5DB" stroke="#374151" strokeWidth="1.5" />
    {/* Cow Legs */}
    <line x1="88" y1="95" x2="88" y2="118" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    <line x1="102" y1="95" x2="102" y2="118" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    <line x1="135" y1="95" x2="135" y2="118" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    <line x1="148" y1="95" x2="148" y2="118" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    {/* Stainless Steel Bucket with White Milk */}
    <path d="M110 98 L 125 98 L 122 118 L 113 118 Z" fill="#E5E7EB" stroke="#6B7280" strokeWidth="1.5" />
    <ellipse cx="117.5" cy="98" rx="7.5" ry="3" fill="#FFFFFF" stroke="#9CA3AF" />
    {/* Milking stream */}
    <line x1="117" y1="88" x2="117" y2="97" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

export const RiverFishingScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#E0F2FE" />
    {/* Distant Riverbank with trees */}
    <path d="M0 45 Q 60 38 120 44 T 200 40 L 200 50 L 0 50 Z" fill="#BBF7D0" />
    {[20, 50, 80, 140, 175].map((x, i) => (
      <path key={i} d={`M ${x} 42 L ${x + 6} 28 L ${x + 12} 42 Z`} fill="#16A34A" />
    ))}
    {/* Flowing Water Waves */}
    <path d="M0 50 C 40 54 70 48 110 52 C 150 56 180 50 200 53 L 200 130 L 0 130 Z" fill="#38BDF8" fillOpacity="0.45" />
    <path d="M0 80 Q 50 75 100 80 T 200 78 L 200 130 L 0 130 Z" fill="#0284C7" fillOpacity="0.3" />
    {/* Wooden Canoe Boat */}
    <path d="M35 88 Q 80 102 125 88 L 115 82 Q 80 90 45 82 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
    {/* Fisherman */}
    <circle cx="78" cy="68" r="6" fill="#B45309" />
    <path d="M72 74 L 84 74 L 82 88 L 74 88 Z" fill="#F97316" />
    {/* Fishing Net cast onto water */}
    <path d="M85 75 Q 120 65 155 85 Q 140 105 105 95 Z" stroke="#F8FAFC" strokeWidth="1.5" strokeDasharray="3 3" fill="#FFFFFF" fillOpacity="0.2" />
    {/* Leaping River Fish */}
    <ellipse cx="140" cy="85" rx="7" ry="3.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" transform="rotate(-20 140 85)" />
    <polygon points="146,85 151,81 151,89" fill="#0284C7" />
  </svg>
);

export const TimberForestScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#F0FDF4" />
    {/* Forest Background Trees */}
    {[30, 70, 110, 150, 185].map((x, i) => (
      <g key={i}>
        <rect x={x + 4} y="55" width="8" height="60" fill="#78350F" />
        <polygon points={`${x},65 ${x + 8},30 ${x + 16},65`} fill="#15803D" />
        <polygon points={`${x - 3},85 ${x + 8},55 ${x + 19},85`} fill="#166534" />
      </g>
    ))}
    {/* Forest ground */}
    <rect x="0" y="105" width="200" height="25" fill="#14532D" />
    {/* Stacked Timber Logs */}
    <g transform="translate(70, 92)">
      <rect x="0" y="8" width="55" height="12" rx="3" fill="#92400E" stroke="#5C2B09" strokeWidth="1.5" />
      <circle cx="5" cy="14" r="5" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      <circle cx="5" cy="14" r="2.5" stroke="#78350F" strokeWidth="1" />
      
      <rect x="6" y="-3" width="52" height="12" rx="3" fill="#A16207" stroke="#5C2B09" strokeWidth="1.5" />
      <circle cx="10" cy="3" r="5" fill="#CA8A04" stroke="#78350F" strokeWidth="1.5" />
      <circle cx="10" cy="3" r="2.5" stroke="#78350F" strokeWidth="1" />
    </g>
  </svg>
);

export const PotteryWheelScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FFF7ED" />
    {/* Workshop Wall and Shelf with finished pots */}
    <line x1="20" y1="35" x2="180" y2="35" stroke="#FDBA74" strokeWidth="3" />
    <path d="M40 35 Q 40 22 47 22 Q 54 22 54 35 Z" fill="#C2410C" />
    <path d="M75 35 Q 75 18 83 18 Q 91 18 91 35 Z" fill="#EA580C" />
    <path d="M140 35 Q 140 24 148 24 Q 156 24 156 35 Z" fill="#9A3412" />
    {/* Potter's Wheel Base */}
    <ellipse cx="100" cy="108" rx="42" ry="12" fill="#78350F" stroke="#451A03" strokeWidth="2" />
    <ellipse cx="100" cy="102" rx="36" ry="9" fill="#9A3412" stroke="#451A03" strokeWidth="1.5" />
    {/* Clay being shaped on wheel */}
    <path d="M88 100 C 80 82 84 62 100 62 C 116 62 120 82 112 100 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
    <ellipse cx="100" cy="62" rx="10" ry="3.5" fill="#D97706" />
    {/* Potter's Hands */}
    <path d="M74 80 Q 84 78 88 82" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
    <path d="M126 80 Q 116 78 112 82" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
    {/* Motion swirl lines on wheel */}
    <path d="M80 102 Q 95 106 110 102" stroke="#FDBA74" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

export const FlourMillScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FFFBEB" />
    {/* Chakki Mill Hopper */}
    <polygon points="75,25 125,25 110,60 90,60" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
    {/* Golden Wheat Grains falling into hopper */}
    <ellipse cx="100" cy="25" rx="20" ry="5" fill="#FBBF24" />
    <circle cx="98" cy="38" r="2" fill="#D97706" />
    <circle cx="103" cy="45" r="2" fill="#D97706" />
    {/* Heavy Grinding Stones */}
    <rect x="70" y="60" width="60" height="20" rx="4" fill="#6B7280" stroke="#374151" strokeWidth="2" />
    <line x1="72" y1="70" x2="128" y2="70" stroke="#4B5563" strokeWidth="2" strokeDasharray="4 2" />
    {/* Powder Chute */}
    <path d="M92 80 L 86 98 L 114 98 L 108 80 Z" fill="#D1D5DB" stroke="#6B7280" strokeWidth="1.5" />
    {/* White Atta Flour Bag */}
    <path d="M76 98 L 124 98 L 120 124 L 80 124 Z" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="2" />
    <text x="89" y="115" fill="#92400E" fontSize="9" fontWeight="bold">ATTA</text>
    {/* Fine flour dust */}
    <circle cx="95" cy="92" r="1.5" fill="#E5E7EB" />
    <circle cx="104" cy="94" r="1.5" fill="#E5E7EB" />
  </svg>
);

export const TextileLoomScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FDF4FF" />
    {/* Loom Wooden Frame */}
    <rect x="25" y="20" width="10" height="95" fill="#78350F" />
    <rect x="165" y="20" width="10" height="95" fill="#78350F" />
    <rect x="25" y="25" width="150" height="8" fill="#92400E" />
    <rect x="25" y="105" width="150" height="8" fill="#92400E" />
    {/* Vertical Warp Threads */}
    {[45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155].map((x, i) => (
      <line key={i} x1={x} y1="33" x2={x} y2="105" stroke={i % 2 === 0 ? "#C084FC" : "#F472B6"} strokeWidth="1.5" />
    ))}
    {/* Finished Woven Cloth section */}
    <rect x="42" y="75" width="116" height="30" fill="#9333EA" fillOpacity="0.85" />
    {/* Golden Border pattern */}
    <line x1="42" y1="85" x2="158" y2="85" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="3 2" />
    {/* Weaver Shuttle passing through */}
    <polygon points="120,62 145,67 120,72" fill="#D97706" stroke="#78350F" strokeWidth="1" />
  </svg>
);

export const ButterProcessingScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FEFCE8" />
    {/* Industrial Vat Wall */}
    <rect x="35" y="25" width="85" height="70" rx="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    {/* Churner Axis & Blades */}
    <line x1="77" y1="15" x2="77" y2="70" stroke="#475569" strokeWidth="3" />
    <ellipse cx="77" cy="65" rx="28" ry="8" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
    {/* Golden Cream / Butter froth */}
    <path d="M40 75 Q 60 70 77 75 T 115 75 L 115 90 L 40 90 Z" fill="#FDE047" />
    {/* Conveyor Belt leading out */}
    <rect x="110" y="80" width="75" height="12" rx="3" fill="#475569" />
    {/* Packed Golden Butter Blocks */}
    <rect x="125" y="66" width="22" height="14" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <rect x="155" y="66" width="22" height="14" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <text x="127" y="76" fill="#854D0E" fontSize="6.5" fontWeight="bold">AMUL</text>
    <text x="157" y="76" fill="#854D0E" fontSize="6.5" fontWeight="bold">AMUL</text>
  </svg>
);

export const MilkTankerScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#F0F9FF" />
    {/* Highway Road & Hills */}
    <path d="M0 60 Q 60 45 130 55 T 200 50 L 200 130 L 0 130 Z" fill="#BAE6FD" fillOpacity="0.4" />
    <rect x="0" y="95" width="200" height="35" fill="#334155" />
    <line x1="0" y1="112" x2="200" y2="112" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="12 8" />
    {/* Tanker Truck Cabin */}
    <path d="M125 55 L 160 55 L 175 75 L 175 100 L 125 100 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
    {/* Windshield */}
    <polygon points="148,60 162,60 171,74 148,74" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1" />
    {/* Insulated Stainless Steel Tank */}
    <rect x="25" y="48" width="98" height="48" rx="16" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    <ellipse cx="32" cy="72" rx="6" ry="20" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
    {/* Cold Chain Badge on Tank */}
    <rect x="52" y="62" width="46" height="18" rx="4" fill="#0284C7" />
    <text x="56" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">MILK TANK</text>
    {/* Truck Wheels */}
    {[42, 75, 105, 155].map((cx, i) => (
      <g key={i}>
        <circle cx={cx} cy="100" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx={cx} cy="100" r="4.5" fill="#94A3B8" />
      </g>
    ))}
  </svg>
);

export const VillageBankScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#F8FAFC" />
    {/* Bank Building Pillars */}
    <polygon points="20,38 100,14 180,38" fill="#1E3A8A" />
    <rect x="30" y="38" width="140" height="8" fill="#1D4ED8" />
    {[40, 75, 115, 150].map((x, i) => (
      <rect key={i} x={x} y="46" width="12" height="60" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
    ))}
    <rect x="25" y="106" width="150" height="14" rx="2" fill="#CBD5E1" />
    {/* Bank Officer Desk */}
    <rect x="70" y="75" width="60" height="30" rx="4" fill="#0284C7" />
    {/* Passbook & Rupee symbol */}
    <rect x="80" y="68" width="18" height="12" rx="2" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1" />
    <circle cx="112" cy="74" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    <text x="109.5" y="78" fill="#78350F" fontSize="8" fontWeight="bold">₹</text>
  </svg>
);

export const BazaarShopScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FEF2F2" />
    {/* Striped Canopy Awning */}
    <g>
      {[0, 25, 50, 75, 100, 125, 150, 175].map((x, i) => (
        <path key={i} d={`M ${x} 20 L ${x + 25} 20 L ${x + 20} 45 L ${x - 5} 45 Z`} fill={i % 2 === 0 ? "#DC2626" : "#FFFFFF"} stroke="#991B1B" strokeWidth="1" />
      ))}
    </g>
    {/* Shop Counter */}
    <rect x="20" y="70" width="160" height="45" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2" />
    {/* Weighing Balance Scale */}
    <line x1="90" y1="52" x2="110" y2="52" stroke="#374151" strokeWidth="2" />
    <line x1="100" y1="46" x2="100" y2="70" stroke="#374151" strokeWidth="2.5" />
    <path d="M85 52 L 85 64 Q 90 68 95 64 Z" fill="#9CA3AF" />
    <path d="M105 52 L 105 64 Q 110 68 115 64 Z" fill="#9CA3AF" />
    {/* Food Crates on Counter */}
    <rect x="35" y="58" width="28" height="14" rx="2" fill="#B45309" />
    <circle cx="43" cy="55" r="4" fill="#EF4444" />
    <circle cx="51" cy="55" r="4" fill="#EF4444" />
    {/* Packets */}
    <rect x="135" y="52" width="12" height="18" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
    <rect x="150" y="52" width="12" height="18" rx="2" fill="#10B981" stroke="#047857" strokeWidth="1" />
  </svg>
);

export const HealthClinicScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#F0FDF4" />
    {/* Clinic Wall with Red Cross Badge */}
    <circle cx="100" cy="38" r="16" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
    <rect x="96" y="28" width="8" height="20" rx="1" fill="#DC2626" />
    <rect x="90" y="34" width="20" height="8" rx="1" fill="#DC2626" />
    {/* Examination Table */}
    <rect x="30" y="80" width="80" height="16" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
    <line x1="45" y1="96" x2="45" y2="120" stroke="#64748B" strokeWidth="3" />
    <line x1="95" y1="96" x2="95" y2="120" stroke="#64748B" strokeWidth="3" />
    {/* Stethoscope */}
    <path d="M135 60 C 135 85 160 85 160 60" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="147.5" cy="85" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
    {/* Doctor Clipboard */}
    <rect x="135" y="90" width="28" height="30" rx="3" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <line x1="140" y1="100" x2="158" y2="100" stroke="#10B981" strokeWidth="2" />
    <line x1="140" y1="108" x2="154" y2="108" stroke="#10B981" strokeWidth="2" />
  </svg>
);

// --- AMUL FLOWCHART DEDICATED SCENES ---

export const AmulMilkingScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <DairyMilkingScene className={className} />
);

export const AmulCollectionScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#ECFEFF" />
    {/* Village Center Building */}
    <rect x="20" y="25" width="160" height="95" rx="6" fill="#FFFFFF" stroke="#0891B2" strokeWidth="2" />
    <rect x="25" y="28" width="150" height="16" fill="#06B6D4" />
    <text x="35" y="40" fill="#FFFFFF" fontSize="9" fontWeight="bold">AMUL VILLAGE COOPERATIVE</text>
    {/* Stainless Steel Milk Churn Cans */}
    {[35, 55, 75].map((x, i) => (
      <g key={i}>
        <rect x={x} y="85" width="16" height="28" rx="3" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
        <ellipse cx={x + 8} cy="85" rx="6" ry="2" fill="#94A3B8" />
        <line x1={x + 3} y1="90" x2={x + 13} y2="90" stroke="#64748B" strokeWidth="1" />
      </g>
    ))}
    {/* Digital Fat Testing Machine (Lactometer) */}
    <rect x="110" y="70" width="55" height="42" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
    <rect x="115" y="76" width="45" height="16" rx="2" fill="#022C22" />
    <text x="120" y="88" fill="#34D399" fontSize="9" fontFamily="monospace" fontWeight="bold">FAT: 4.8%</text>
    {/* Payment Receipt Slip */}
    <rect x="128" y="98" width="20" height="12" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
  </svg>
);

export const AmulTankerScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <MilkTankerScene className={className} />
);

export const AmulPlantScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#F1F5F9" />
    {/* Modern Factory Silos */}
    <rect x="30" y="25" width="32" height="75" rx="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    <rect x="70" y="25" width="32" height="75" rx="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    {/* Interconnecting Stainless Steel Pasteurization Pipes */}
    <path d="M46 45 H 86 V 65 H 125" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 75 H 86 V 85 H 125" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
    {/* Pasteurization Heat Indicator */}
    <circle cx="86" cy="65" r="7" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
    <text x="82" y="68" fill="#FFFFFF" fontSize="7" fontWeight="bold">72°</text>
    {/* Pouch Packaging Machine */}
    <rect x="125" y="55" width="55" height="50" rx="4" fill="#334155" />
    {/* Sealed Milk Pouches moving out on conveyer */}
    <rect x="135" y="70" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
    <text x="137" y="82" fill="#0369A1" fontSize="5.5" fontWeight="bold">Amul</text>
    <rect x="155" y="70" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
    <text x="157" y="82" fill="#0369A1" fontSize="5.5" fontWeight="bold">Amul</text>
  </svg>
);

export const AmulParlourScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#FEF2F2" />
    {/* Amul Branded Kiosk Canopy */}
    <rect x="15" y="20" width="170" height="24" rx="4" fill="#DC2626" />
    <text x="45" y="36" fill="#FFFFFF" fontSize="12" fontWeight="900" letterSpacing="1">AMUL PARLOUR</text>
    {/* Glass Freezer Counter */}
    <rect x="25" y="55" width="150" height="55" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
    {/* Milk Crates inside */}
    <rect x="40" y="75" width="30" height="25" rx="3" fill="#2563EB" />
    <rect x="75" y="75" width="30" height="25" rx="3" fill="#DC2626" />
    <rect x="110" y="75" width="30" height="25" rx="3" fill="#16A34A" />
    {/* Ice cream & Butter signage */}
    <circle cx="155" cy="72" r="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
    <text x="150" y="76" fill="#854D0E" fontSize="9">🍦</text>
  </svg>
);

export const AmulConsumerScene: React.FC<SceneProps> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="130" rx="8" fill="#EFF6FF" />
    {/* Kitchen / Dining Table */}
    <rect x="20" y="75" width="160" height="42" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
    {/* Tall Clear Glasses filled with Milk */}
    <rect x="55" y="50" width="20" height="34" rx="3" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
    <line x1="60" y1="42" x2="68" y2="72" stroke="#EF4444" strokeWidth="2" /> {/* Straw */}
    
    <rect x="125" y="50" width="20" height="34" rx="3" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
    <line x1="130" y1="42" x2="138" y2="72" stroke="#3B82F6" strokeWidth="2" /> {/* Straw */}
    
    {/* Happy Student Emoji Faces */}
    <circle cx="65" cy="28" r="14" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="60" cy="25" r="2" fill="#1E293B" />
    <circle cx="70" cy="25" r="2" fill="#1E293B" />
    <path d="M59 31 Q 65 37 71 31" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    
    <circle cx="135" cy="28" r="14" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="130" cy="25" r="2" fill="#1E293B" />
    <circle cx="140" cy="25" r="2" fill="#1E293B" />
    <path d="M129 31 Q 135 37 141 31" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Nutrition Badge */}
    <rect x="83" y="24" width="34" height="16" rx="4" fill="#10B981" />
    <text x="87" y="35" fill="#FFFFFF" fontSize="7" fontWeight="bold">HEALTH</text>
  </svg>
);

export const ActivitySceneRenderer: React.FC<{ illustrationKey: string; className?: string }> = ({
  illustrationKey,
  className = "w-full h-full"
}) => {
  switch (illustrationKey) {
    case 'wheat-harvest':
      return <WheatHarvestScene className={className} />;
    case 'dairy-milking':
      return <DairyMilkingScene className={className} />;
    case 'river-fishing':
      return <RiverFishingScene className={className} />;
    case 'timber-forest':
      return <TimberForestScene className={className} />;
    case 'pottery-wheel':
      return <PotteryWheelScene className={className} />;
    case 'flour-mill':
      return <FlourMillScene className={className} />;
    case 'textile-loom':
      return <TextileLoomScene className={className} />;
    case 'butter-processing':
      return <ButterProcessingScene className={className} />;
    case 'milk-tanker':
      return <MilkTankerScene className={className} />;
    case 'village-bank':
      return <VillageBankScene className={className} />;
    case 'bazaar-shop':
      return <BazaarShopScene className={className} />;
    case 'health-clinic':
      return <HealthClinicScene className={className} />;
    case 'amul-milking':
      return <AmulMilkingScene className={className} />;
    case 'amul-collection':
      return <AmulCollectionScene className={className} />;
    case 'amul-tanker':
      return <AmulTankerScene className={className} />;
    case 'amul-plant':
      return <AmulPlantScene className={className} />;
    case 'amul-parlour':
      return <AmulParlourScene className={className} />;
    case 'amul-consumer':
      return <AmulConsumerScene className={className} />;
    default:
      return <WheatHarvestScene className={className} />;
  }
};
