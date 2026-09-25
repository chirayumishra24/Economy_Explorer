import React from 'react';

interface SceneryBackdropProps {
  variant?: 'farm' | 'dairy';
}

const Tree: React.FC<{ x: number; y: number; s?: number; tone?: 'light' | 'dark' }> = ({
  x,
  y,
  s = 1,
  tone = 'dark',
}) => {
  const leaf = tone === 'dark' ? '#3E8E3A' : '#5DAA45';
  const leafHi = tone === 'dark' ? '#57A84A' : '#7CC45A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-7" y="-10" width="14" height="60" rx="4" fill="#7A4B25" />
      <circle cx="0" cy="-40" r="38" fill={leaf} />
      <circle cx="-30" cy="-18" r="28" fill={leaf} />
      <circle cx="30" cy="-18" r="28" fill={leaf} />
      <circle cx="-10" cy="-52" r="20" fill={leafHi} />
      <circle cx="18" cy="-30" r="14" fill={leafHi} />
    </g>
  );
};

const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF" opacity="0.92">
    <ellipse cx="0" cy="0" rx="70" ry="26" />
    <ellipse cx="-40" cy="-8" rx="36" ry="24" />
    <ellipse cx="20" cy="-22" rx="40" ry="30" />
    <ellipse cx="55" cy="-4" rx="30" ry="20" />
  </g>
);

const Silo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-30" y="-150" width="60" height="150" fill="url(#eb-silo)" />
    <ellipse cx="0" cy="-150" rx="30" ry="10" fill="#E2E8F0" />
    <rect x="-30" y="-110" width="60" height="4" fill="#94A3B8" opacity="0.6" />
    <rect x="-30" y="-60" width="60" height="4" fill="#94A3B8" opacity="0.6" />
  </g>
);

const MilkCan: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-18" y="-50" width="36" height="50" rx="6" fill="url(#eb-silo)" />
    <rect x="-10" y="-62" width="20" height="14" rx="3" fill="#CBD5E1" />
    <rect x="-13" y="-68" width="26" height="7" rx="3" fill="#94A3B8" />
  </g>
);

/** Sunny Indian-village landscape painted behind the team activities. Purely decorative. */
export const SceneryBackdrop: React.FC<SceneryBackdropProps> = ({ variant = 'farm' }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="eb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6EC1F2" />
          <stop offset="0.5" stopColor="#BFE6FB" />
          <stop offset="1" stopColor="#EEF9FF" />
        </linearGradient>
        <radialGradient id="eb-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6C9" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF6C9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eb-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8CCB5E" />
          <stop offset="1" stopColor="#5FA83B" />
        </linearGradient>
        <linearGradient id="eb-silo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#CBD5E1" />
          <stop offset="0.45" stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="eb-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD3F5" />
          <stop offset="1" stopColor="#3BA7DB" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#eb-sky)" />
      <circle cx="1470" cy="110" r="240" fill="url(#eb-sun)" />
      <circle cx="1470" cy="110" r="52" fill="#FFE27A" />

      <Cloud x={260} y={120} s={1.1} />
      <Cloud x={760} y={80} s={0.8} />
      <Cloud x={1180} y={170} s={0.9} />

      {/* Distant mountains */}
      <path
        d="M0 450 L110 350 L210 410 L360 300 L500 400 L640 330 L780 410 L930 320 L1080 400 L1230 310 L1380 390 L1500 340 L1600 380 V900 H0 Z"
        fill="#A7D3E6"
        opacity="0.85"
      />
      {/* Rolling hills */}
      <path d="M0 530 Q220 440 440 510 T880 490 T1320 480 T1600 470 V900 H0 Z" fill="#A6D784" />
      <path d="M0 640 Q320 560 660 620 T1240 600 T1600 590 V900 H0 Z" fill="url(#eb-field)" />

      {/* Crop rows */}
      <g stroke="#E6D46B" strokeWidth="6" strokeLinecap="round" opacity="0.55" fill="none">
        <path d="M60 700 Q300 650 560 690" />
        <path d="M40 740 Q300 690 580 730" />
        <path d="M1040 690 Q1280 640 1560 680" />
        <path d="M1020 730 Q1280 680 1580 720" />
      </g>

      {/* River on the right */}
      <path d="M1600 610 Q1420 660 1380 760 Q1340 860 1180 900 H1600 Z" fill="url(#eb-water)" />
      <path d="M1560 680 Q1470 700 1440 760" stroke="#E0F6FF" strokeWidth="5" fill="none" opacity="0.7" />

      {/* Foreground meadow and dirt path */}
      <path d="M0 790 Q400 730 800 770 T1600 750 V900 H0 Z" fill="#5AA137" />
      <path d="M700 900 Q760 790 800 720 Q840 790 920 900 Z" fill="#E7C78D" />

      {/* Village house */}
      <g transform="translate(130 610)">
        <rect x="0" y="0" width="120" height="80" fill="#F5E6CC" />
        <polygon points="-15,5 60,-45 135,5" fill="#C2552D" />
        <rect x="46" y="32" width="28" height="48" fill="#8B5A2B" />
        <rect x="12" y="22" width="22" height="20" fill="#7CC8F4" />
      </g>

      {variant === 'dairy' ? (
        <>
          <Silo x={70} y={560} s={1.1} />
          <Silo x={150} y={560} s={0.9} />
          <Silo x={1400} y={560} s={1.05} />
          <Silo x={1480} y={560} s={0.85} />
          <MilkCan x={60} y={880} s={1.3} />
          <MilkCan x={120} y={890} s={1.1} />
          <MilkCan x={1510} y={880} s={1.2} />
        </>
      ) : (
        <>
          <Tree x={40} y={620} s={1.3} />
          <Tree x={1560} y={600} s={1.2} tone="light" />
          <Tree x={1450} y={640} s={0.9} />
        </>
      )}
      <Tree x={330} y={640} s={0.7} tone="light" />
      <Tree x={1250} y={600} s={0.65} tone="light" />
      <Tree x={20} y={880} s={1.1} />
      <Tree x={1585} y={880} s={1.1} tone="light" />
    </svg>
    <div className="absolute inset-0 bg-white/10" />
  </div>
);
