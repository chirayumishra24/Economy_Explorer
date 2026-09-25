import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Pause, Timer, Volume2, VolumeX, X } from 'lucide-react';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';
import { sound } from '../../utils/audio';

export type TeamId = 'teamA' | 'teamB';

/** Frosted white card used for every panel in both activities. */
export const PANEL =
  'bg-white/90 backdrop-blur-sm rounded-[22px] border border-white shadow-[0_6px_20px_rgba(30,64,120,0.14)]';

export const TEAM_STYLE: Record<
  TeamId,
  {
    gradient: string;
    bar: string;
    heading: string;
    solid: string;
    soft: string;
    ring: string;
    avatar: 'boy' | 'girl';
    initial: string;
  }
> = {
  teamA: {
    gradient: 'from-[#1463D6] via-[#2A86EE] to-[#63B6FF]',
    bar: 'from-sky-400 to-blue-600',
    heading: 'text-blue-700',
    solid: 'bg-blue-600',
    soft: 'bg-blue-50',
    ring: 'ring-blue-400',
    avatar: 'boy',
    initial: 'K',
  },
  teamB: {
    gradient: 'from-[#E4570B] via-[#F57A1F] to-[#FFAA4D]',
    bar: 'from-amber-400 to-orange-600',
    heading: 'text-orange-600',
    solid: 'bg-orange-500',
    soft: 'bg-orange-50',
    ring: 'ring-orange-400',
    avatar: 'girl',
    initial: 'H',
  },
};

export const formatClock = (secs: number) => {
  const mins = Math.floor(secs / 60);
  const rest = secs % 60;
  return `${mins.toString().padStart(2, '0')}:${rest.toString().padStart(2, '0')}`;
};

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Ticking countdown that calls onExpire once when it reaches zero while running. */
export function useCountdown(initialSeconds: number, running: boolean, onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimeLeft((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && timeLeft === 0) expireRef.current();
  }, [timeLeft, running]);

  return [timeLeft, setTimeLeft] as const;
}

export const WoodSign: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`relative inline-flex items-center justify-center rounded-lg border-[3px] border-[#7A4A1E] bg-gradient-to-b from-[#F7DFB2] via-[#EBC68C] to-[#D6A762] text-[#4A2A10] font-black shadow-[0_4px_0_#6B3E16,0_8px_14px_rgba(0,0,0,0.18)] ${className}`}
  >
    <span className="absolute left-1 top-1 w-1.5 h-1.5 rounded-full bg-[#7A4A1E]/70" />
    <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-[#7A4A1E]/70" />
    <span className="absolute left-1 bottom-1 w-1.5 h-1.5 rounded-full bg-[#7A4A1E]/70" />
    <span className="absolute right-1 bottom-1 w-1.5 h-1.5 rounded-full bg-[#7A4A1E]/70" />
    {children}
  </div>
);

export const KidAvatar: React.FC<{ kind: 'boy' | 'girl'; className?: string }> = ({ kind, className }) => {
  const hoodie = kind === 'boy' ? '#2F7BE0' : '#F2711C';
  const hoodieDark = kind === 'boy' ? '#1D5AB5' : '#C4520C';
  const hair = '#3B2314';
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      {kind === 'girl' && <path d="M22 62 Q18 16 60 14 Q102 16 98 62 L102 108 Q60 116 18 108 Z" fill={hair} />}
      <path d="M12 130 Q14 94 40 86 L80 86 Q106 94 108 130 Z" fill={hoodie} />
      <path d="M40 86 Q60 108 80 86" fill="none" stroke={hoodieDark} strokeWidth="5" strokeLinecap="round" />
      <line x1="52" y1="98" x2="51" y2="116" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="98" x2="69" y2="116" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="51" y="74" width="18" height="16" rx="6" fill="#E9A87C" />
      <circle cx="31" cy="54" r="7" fill="#F2B48A" />
      <circle cx="89" cy="54" r="7" fill="#F2B48A" />
      <ellipse cx="60" cy="52" rx="29" ry="31" fill="#F7C49C" />
      {kind === 'boy' ? (
        <path
          d="M30 50 Q26 16 58 14 Q90 12 92 46 Q86 32 72 32 Q74 22 64 26 Q58 34 44 32 Q36 38 30 50 Z"
          fill={hair}
        />
      ) : (
        <>
          <path d="M31 52 Q28 18 60 17 Q92 18 89 52 Q82 32 62 30 Q48 40 31 52 Z" fill={hair} />
          <path d="M34 30 Q60 8 86 30" fill="none" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      <path d="M42 44 Q48 40 54 44" fill="none" stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 44 Q72 40 78 44" fill="none" stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="48" cy="54" rx="4.2" ry="5.2" fill="#2B1B10" />
      <ellipse cx="72" cy="54" rx="4.2" ry="5.2" fill="#2B1B10" />
      <circle cx="49.5" cy="52" r="1.5" fill="#FFFFFF" />
      <circle cx="73.5" cy="52" r="1.5" fill="#FFFFFF" />
      <circle cx="41" cy="64" r="5" fill="#F59E8B" opacity="0.5" />
      <circle cx="79" cy="64" r="5" fill="#F59E8B" opacity="0.5" />
      <path d="M58 60 Q60 63 62 60" fill="none" stroke="#C98A63" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 68 Q60 79 71 68 Z" fill="#8B2E1F" />
      <path d="M52 69 Q60 73 68 69" fill="#FFFFFF" />
    </svg>
  );
};

/** Shows the real photo when a card has one, otherwise its matching SVG scene. */
export const CardArt: React.FC<{ imageUrl?: string; illustrationKey: string; alt: string }> = ({
  imageUrl,
  illustrationKey,
  alt,
}) =>
  imageUrl ? (
    <img src={imageUrl} alt={alt} draggable={false} className="w-full h-full object-cover" />
  ) : (
    // SVG scenes keep their own aspect ratio; a blurred, enlarged copy fills the leftover space.
    <div className="relative w-full h-full overflow-hidden">
      <ActivitySceneRenderer
        illustrationKey={illustrationKey}
        className="absolute inset-0 w-full h-full scale-[2.2] blur-lg opacity-60"
      />
      <ActivitySceneRenderer illustrationKey={illustrationKey} className="relative w-full h-full" />
    </div>
  );

interface TeamPanelProps {
  team: TeamId;
  name: string;
  tagline: string;
  score: number;
  total: number;
  scoreLabel: string;
  /** true = this team's turn, false = waiting, undefined = both teams play at once */
  isActive?: boolean;
  statusChip?: string;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  team,
  name,
  tagline,
  score,
  total,
  scoreLabel,
  isActive,
  statusChip,
}) => {
  const style = TEAM_STYLE[team];
  const pct = total > 0 ? Math.min(100, (score / total) * 100) : 0;
  return (
    <div
      className={`relative shrink-0 rounded-[22px] bg-gradient-to-br ${style.gradient} border-[3px] border-white/80 shadow-[0_8px_22px_rgba(30,64,120,0.22)] overflow-hidden pl-[34%] pr-3 py-3 transition-all duration-300 ${
        isActive === true ? `ring-4 ${style.ring} ring-offset-2 ring-offset-white/60` : ''
      } ${isActive === false ? 'opacity-75 saturate-[0.75]' : ''}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.35),transparent_45%)]" />
      <KidAvatar kind={style.avatar} className="absolute left-0 bottom-0 w-[36%] max-w-[130px] drop-shadow-md" />
      {statusChip && (
        <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-yellow-300 text-slate-900 text-[10px] font-black uppercase tracking-wide shadow animate-pulse">
          {statusChip}
        </span>
      )}
      <div className="relative">
        <h3 className="text-white font-black uppercase text-lg xl:text-[22px] leading-tight tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
          {name}
        </h3>
        <p className="text-white/95 text-xs xl:text-sm font-semibold">{tagline}</p>
        <div className="mt-2 bg-white rounded-2xl px-3 py-2 shadow-inner">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl xl:text-2xl font-black text-slate-800 tabular-nums">
              {score} / {total}
            </span>
            <span className="text-[10px] xl:text-xs font-black uppercase text-slate-700">{scoreLabel}</span>
          </div>
          <div className="mt-1.5 h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const IconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({
  label,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`${PANEL} w-12 xl:w-16 shrink-0 flex items-center justify-center text-blue-600 hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all`}
  >
    {children}
  </button>
);

interface ActivityTopBarProps {
  activityNumber: number;
  title: string;
  titleAccent: string;
  subtitle: string;
  timeLeft: number;
  paused: boolean;
  onTogglePause: () => void;
  round: number;
  totalRounds: number;
  signLines: string[];
  onExit?: () => void;
}

export const ActivityTopBar: React.FC<ActivityTopBarProps> = ({
  activityNumber,
  title,
  titleAccent,
  subtitle,
  timeLeft,
  paused,
  onTogglePause,
  round,
  totalRounds,
  signLines,
  onExit,
}) => {
  const [soundOn, setSoundOn] = useState(() => sound.isEnabled());
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    sound.setEnabled(next);
    setSoundOn(next);
    if (next) sound.playClick();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  const lowTime = timeLeft <= 30;

  return (
    <header className="flex flex-wrap lg:flex-nowrap items-stretch gap-2 xl:gap-3 shrink-0">
      <div className={`${PANEL} flex-1 min-w-[280px] flex items-center gap-3 xl:gap-4 pl-2 pr-4 py-2`}>
        <WoodSign className="-rotate-3 shrink-0 uppercase text-base xl:text-2xl px-3 xl:px-5 py-1 xl:py-1.5">
          Activity {activityNumber}
        </WoodSign>
        <div className="min-w-0">
          <h1 className="font-black uppercase leading-none tracking-tight text-[24px] xl:text-[38px]">
            <span className="text-[#1B3A8C]">{title}</span> <span className="text-[#F26B1D]">{titleAccent}</span>
          </h1>
          <p className="text-xs xl:text-sm font-semibold text-slate-600 truncate mt-0.5">{subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onTogglePause}
        title={paused ? 'Resume timer' : 'Pause timer'}
        className={`${PANEL} flex items-center gap-2.5 px-4 py-2 min-w-[150px] xl:min-w-[190px] hover:bg-white transition-colors`}
      >
        {paused ? (
          <Pause className="w-8 h-8 xl:w-10 xl:h-10 text-amber-500 shrink-0" strokeWidth={2.5} />
        ) : (
          <Timer
            className={`w-8 h-8 xl:w-10 xl:h-10 shrink-0 ${lowTime ? 'text-red-500' : 'text-blue-600'}`}
            strokeWidth={2.5}
          />
        )}
        <div className="text-left">
          <div
            className={`font-black tabular-nums leading-none text-2xl xl:text-[34px] ${
              lowTime ? 'text-red-600 animate-pulse' : 'text-slate-800'
            }`}
          >
            {formatClock(timeLeft)}
          </div>
          <div className="text-[10px] xl:text-[11px] font-bold uppercase text-slate-600 mt-1">
            {paused ? 'Paused · tap to resume' : 'Time remaining'}
          </div>
        </div>
      </button>

      <div className={`${PANEL} px-4 py-2 flex flex-col justify-center min-w-[150px] xl:min-w-[210px]`}>
        <div className="text-sm xl:text-base font-black text-slate-800 uppercase">
          Round {round} / {totalRounds}
        </div>
        <div className="flex gap-1.5 mt-1.5" aria-hidden="true">
          {Array.from({ length: totalRounds }, (_, i) => (
            <span
              key={i}
              className={`w-3 h-3 xl:w-3.5 xl:h-3.5 rounded-full transition-colors ${
                i < round - 1 ? 'bg-emerald-400' : i === round - 1 ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <IconButton label={soundOn ? 'Mute sound' : 'Turn sound on'} onClick={toggleSound}>
        {soundOn ? <Volume2 className="w-6 h-6 xl:w-7 xl:h-7" /> : <VolumeX className="w-6 h-6 xl:w-7 xl:h-7" />}
      </IconButton>
      <IconButton label={isFullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
        {isFullscreen ? <Minimize2 className="w-6 h-6 xl:w-7 xl:h-7" /> : <Maximize2 className="w-6 h-6 xl:w-7 xl:h-7" />}
      </IconButton>
      {onExit && (
        <IconButton label="Leave activity" onClick={onExit}>
          <X className="w-6 h-6 xl:w-7 xl:h-7" />
        </IconButton>
      )}

      <WoodSign className="hidden 2xl:flex flex-col rotate-2 self-center shrink-0 text-center text-[13px] leading-snug px-4 py-1.5">
        {signLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </WoodSign>
    </header>
  );
};

/** Centered modal card used for round and match results. */
export const ResultModal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm animate-fadeIn">
    <div
      className={`${PANEL} bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto scrollable-panel p-6 text-center animate-scaleUp`}
    >
      {children}
    </div>
  </div>
);
