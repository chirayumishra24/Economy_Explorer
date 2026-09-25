import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, Volume2, VolumeX, Timer, X } from 'lucide-react';
import { TeamId, TeamProfile } from '../../types/economy';
import { useEconomy } from '../../context/EconomyStore';
import { sound } from '../../utils/audio';

export const TEAM_STYLES: Record<
  TeamId,
  { gradient: string; text: string; soft: string; border: string; bar: string; ring: string; solid: string; dot: string }
> = {
  teamA: {
    gradient: 'from-[#3AA0FF] via-[#1E7BE6] to-[#1660C9]',
    text: 'text-arenaBlue',
    soft: 'bg-[#EEF6FF]',
    border: 'border-[#9CCBFF]',
    bar: 'bg-arenaBlue',
    ring: 'ring-[#5AB0FF]',
    solid: 'bg-arenaBlue',
    dot: 'bg-arenaBlue',
  },
  teamB: {
    gradient: 'from-[#FF9A3C] via-[#F47A22] to-[#EE5A1A]',
    text: 'text-arenaOrange',
    soft: 'bg-[#FFF4EB]',
    border: 'border-[#FFC39A]',
    bar: 'bg-arenaOrange',
    ring: 'ring-[#FFA467]',
    solid: 'bg-arenaOrange',
    dot: 'bg-arenaOrange',
  },
};

/** Counts down once per second while `running`; returns [secondsLeft, reset]. */
export function useCountdown(seconds: number, running: boolean): [number, (next?: number) => void] {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [running, left]);
  return [left, (next = seconds) => setLeft(next)];
}

const formatClock = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** Sunny village landscape drawn behind every arena screen. */
const ScenicBackground: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="arena-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7CC8F8" />
        <stop offset="0.55" stopColor="#CDEBFF" />
        <stop offset="1" stopColor="#F3FAFF" />
      </linearGradient>
      <linearGradient id="arena-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1D8A8" />
        <stop offset="1" stopColor="#E2BD7F" />
      </linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#arena-sky)" />
    {[
      [180, 120, 1],
      [640, 70, 0.8],
      [1180, 110, 1.1],
      [1460, 60, 0.7],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF" opacity="0.9">
        <ellipse cx="0" cy="0" rx="60" ry="22" />
        <ellipse cx="40" cy="-14" rx="40" ry="24" />
        <ellipse cx="-38" cy="-8" rx="32" ry="18" />
      </g>
    ))}
    <path d="M0 420 L180 300 L330 390 L520 270 L700 380 L900 290 L1080 380 L1270 280 L1450 370 L1600 320 L1600 560 L0 560 Z" fill="#A8C9D8" />
    <path d="M0 470 Q200 400 420 450 T840 440 T1260 430 T1600 450 L1600 620 L0 620 Z" fill="#8CC56A" />
    <path d="M0 540 Q260 480 560 530 T1120 520 T1600 520 L1600 760 L0 760 Z" fill="#6DB24A" />
    {[60, 150, 250, 1330, 1420, 1520, 420, 1180].map((x, i) => (
      <g key={i} transform={`translate(${x} ${i % 2 ? 520 : 540})`}>
        <rect x="-5" y="0" width="10" height="46" fill="#7A4E26" />
        <circle cx="0" cy="-8" r="34" fill={i % 3 ? '#3F9A3A' : '#4FAE45'} />
        <circle cx="-22" cy="6" r="22" fill="#3A8E35" />
        <circle cx="22" cy="4" r="24" fill="#47A23F" />
      </g>
    ))}
    <path d="M0 740 Q400 700 800 730 T1600 720 L1600 900 L0 900 Z" fill="url(#arena-ground)" />
  </svg>
);

/** Rustic wooden plank used for "ACTIVITY N" and the tagline sign. */
export const WoodSign: React.FC<{ children: React.ReactNode; className?: string; tilt?: string }> = ({
  children,
  className = '',
  tilt = '-rotate-2',
}) => (
  <div
    className={`relative ${tilt} rounded-lg border-2 border-[#5E3B18] bg-gradient-to-b from-[#C68A4E] via-[#A86F37] to-[#8A5A2B] shadow-[0_4px_0_#5E3B18,0_8px_16px_rgba(0,0,0,0.25)] ${className}`}
  >
    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4A2E12]" />
    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4A2E12]" />
    {children}
  </div>
);

/** Frosted white card used throughout the arena layouts. */
export const ArenaCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`rounded-2xl bg-white/95 border border-white shadow-[0_6px_18px_rgba(22,48,107,0.12)] ${className}`}>
    {children}
  </div>
);

export interface TitlePart {
  text: string;
  className: string;
}

interface ArenaShellProps {
  activityNumber: number;
  title: TitlePart[];
  subtitle: string;
  secondsLeft: number;
  timerLabel?: string;
  roundLabel: string;
  roundDots: ('teamA' | 'teamB' | 'tie' | 'current' | 'todo')[];
  tagline: string[];
  onExit?: () => void;
  children: React.ReactNode;
}

export const ArenaShell: React.FC<ArenaShellProps> = ({
  activityNumber,
  title,
  subtitle,
  secondsLeft,
  timerLabel = 'Time Remaining',
  roundLabel,
  roundDots,
  tagline,
  onExit,
  children,
}) => {
  const { state, dispatch } = useEconomy();
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
  };

  const lowTime = secondsLeft <= 10;

  return (
    <div className="relative w-full h-full overflow-hidden font-display text-arenaNavy select-none">
      <ScenicBackground />

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col gap-3 p-3 sm:p-4">
        {/* ---------- Top bar ---------- */}
        <header className="flex flex-wrap xl:flex-nowrap items-stretch gap-3 shrink-0">
          <div className="flex items-stretch gap-0 min-w-0 flex-1">
            <WoodSign className="z-10 self-center px-5 py-2 shrink-0">
              <span className="text-white font-extrabold text-lg sm:text-2xl tracking-wide [text-shadow:0_2px_0_#4A2E12] whitespace-nowrap">
                ACTIVITY {activityNumber}
              </span>
            </WoodSign>
            <ArenaCard className="-ml-3 pl-7 pr-5 py-1.5 flex flex-col justify-center min-w-0 flex-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-none tracking-tight">
                {title.map((part, i) => (
                  <span key={i} className={part.className}>
                    {part.text}
                    {i < title.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-arenaNavy/80 leading-tight mt-1 line-clamp-2">
                {subtitle}
              </p>
            </ArenaCard>
          </div>

          <div className="flex items-stretch gap-3 flex-wrap sm:flex-nowrap">
            <ArenaCard className="px-4 py-1.5 flex items-center gap-3">
              <Timer className={`w-9 h-9 ${lowTime ? 'text-arenaRed animate-pulse' : 'text-arenaBlue'}`} strokeWidth={2.4} />
              <div className="leading-none">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${lowTime ? 'text-arenaRed' : 'text-arenaNavy'}`}
                  aria-live="polite"
                >
                  {formatClock(secondsLeft)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-arenaNavy/70 mt-0.5">
                  {timerLabel}
                </div>
              </div>
            </ArenaCard>

            <ArenaCard className="px-4 py-2 flex flex-col justify-center min-w-[150px]">
              <div className="text-sm sm:text-base font-extrabold leading-none">{roundLabel}</div>
              <div className="flex items-center gap-1.5 mt-2">
                {roundDots.map((dot, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      dot === 'teamA'
                        ? TEAM_STYLES.teamA.dot
                        : dot === 'teamB'
                        ? TEAM_STYLES.teamB.dot
                        : dot === 'tie'
                        ? 'bg-gradient-to-r from-arenaBlue to-arenaOrange'
                        : dot === 'current'
                        ? 'bg-arenaBlue ring-2 ring-arenaBlue/30'
                        : 'bg-[#D6E2F2]'
                    }`}
                  />
                ))}
              </div>
            </ArenaCard>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  dispatch({ type: 'TOGGLE_SOUND' });
                  if (!state.soundEnabled) setTimeout(() => sound.playClick(), 30);
                }}
                className="w-12 h-12 rounded-2xl bg-white/95 shadow-[0_6px_18px_rgba(22,48,107,0.12)] flex items-center justify-center text-arenaBlue hover:scale-105 transition-transform"
                title={state.soundEnabled ? 'Mute sound' : 'Turn sound on'}
                aria-label={state.soundEnabled ? 'Mute sound' : 'Turn sound on'}
              >
                {state.soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-2xl bg-white/95 shadow-[0_6px_18px_rgba(22,48,107,0.12)] flex items-center justify-center text-arenaBlue hover:scale-105 transition-transform"
                title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              >
                {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="w-12 h-12 rounded-2xl bg-white/95 shadow-[0_6px_18px_rgba(22,48,107,0.12)] flex items-center justify-center text-arenaNavy/70 hover:text-arenaRed hover:scale-105 transition-transform"
                  title="Leave activity"
                  aria-label="Leave activity"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <WoodSign tilt="rotate-2" className="hidden 2xl:flex items-center px-5 py-1.5">
              <div className="text-center text-white font-bold text-sm leading-tight [text-shadow:0_1px_0_#4A2E12]">
                {tagline.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </WoodSign>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};

interface TeamPanelHeaderProps {
  team: TeamProfile;
  tagline: string;
  correct: number;
  total: number;
  scoreLabel: string;
  isActive?: boolean;
  activeLabel?: string;
}

/** Gradient team banner with avatar, "x / y" score box and progress bar. */
export const TeamPanelHeader: React.FC<TeamPanelHeaderProps> = ({
  team,
  tagline,
  correct,
  total,
  scoreLabel,
  isActive,
  activeLabel = 'Your Turn!',
}) => {
  const styles = TEAM_STYLES[team.id];
  const pct = total ? Math.min(100, (correct / total) * 100) : 0;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${styles.gradient} p-2.5 pl-[92px] sm:pl-[112px] min-h-[128px] shadow-[0_8px_20px_rgba(22,48,107,0.2)] border-2 border-white/70 transition-all ${
        isActive ? `ring-4 ${styles.ring} scale-[1.01]` : ''
      }`}
    >
      <img
        src={team.avatarImage}
        alt=""
        className="absolute left-1 bottom-0 h-[120px] sm:h-[132px] w-[88px] sm:w-[106px] object-cover object-top rounded-bl-2xl [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
        draggable={false}
      />
      {isActive && (
        <span className="absolute -top-3 right-3 bg-accentYellow text-arenaNavy text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow animate-bounce">
          {activeLabel}
        </span>
      )}
      <div className="text-white font-extrabold text-[clamp(1rem,1.2vw,1.5rem)] uppercase leading-none tracking-wide whitespace-nowrap [text-shadow:0_2px_0_rgba(0,0,0,0.15)]">
        {team.name}
      </div>
      <div className="text-white/95 font-semibold text-[clamp(0.75rem,0.95vw,1rem)] leading-tight mt-1 whitespace-nowrap">{tagline}</div>
      <div className="mt-2 rounded-xl bg-white px-3 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-extrabold tabular-nums leading-none whitespace-nowrap">
            {correct} / {total}
          </span>
          <span className="text-xs 2xl:text-sm font-bold text-arenaNavy/80 uppercase text-right leading-tight">{scoreLabel}</span>
        </div>
        <div className="mt-1.5 h-2.5 rounded-full bg-[#E3ECF7] overflow-hidden">
          <div className={`h-full rounded-full ${styles.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

/** Blurred full-screen overlay used for end-of-game results. */
export const ResultsModal: React.FC<{
  heading: string;
  message: string;
  teams: TeamProfile[];
  scores: Record<TeamId, number>;
  total: number;
  actions: React.ReactNode;
}> = ({ heading, message, teams, scores, total, actions }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-arenaNavy/50 backdrop-blur-sm animate-fadeIn font-display">
    <ArenaCard className="w-full max-w-xl p-6 text-center">
      <div className="text-5xl mb-2" aria-hidden="true">
        🏆
      </div>
      <h2 className="text-3xl font-extrabold text-arenaNavy leading-tight">{heading}</h2>
      <p className="text-sm font-semibold text-arenaNavy/75 mt-2 mb-5">{message}</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`rounded-2xl bg-gradient-to-br ${TEAM_STYLES[team.id].gradient} p-3 text-white flex items-center gap-3`}
          >
            <img src={team.avatarImage} alt="" className="w-14 h-14 rounded-xl object-cover object-top bg-white/20" />
            <div className="text-left">
              <div className="text-sm font-bold uppercase leading-tight">{team.name}</div>
              <div className="text-2xl font-extrabold tabular-nums">
                {scores[team.id]} / {total}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">{actions}</div>
    </ArenaCard>
  </div>
);

export const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: TeamId | 'neutral' }
> = ({ tone = 'neutral', className = '', children, ...rest }) => (
  <button
    {...rest}
    className={`rounded-2xl px-5 py-3 font-extrabold uppercase tracking-wide text-white text-base sm:text-lg shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${
      tone === 'neutral'
        ? 'bg-gradient-to-b from-[#34495E] to-arenaNavy'
        : `bg-gradient-to-b ${TEAM_STYLES[tone].gradient}`
    } ${className}`}
  >
    {children}
  </button>
);
