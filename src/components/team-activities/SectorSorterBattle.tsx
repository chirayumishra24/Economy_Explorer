import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Factory, Hand, Leaf, Lightbulb, RotateCcw, Trophy, Users } from 'lucide-react';
import { Sector, SectorCard } from '../../types/economy';
import { SECTOR_CARDS, INITIAL_TEAMS } from '../../data/teamActivitiesData';
import { SectorDropColumn, SectorPlacement, SectorTheme } from './SectorDropColumn';
import { SceneryBackdrop } from './SceneryBackdrop';
import {
  ActivityTopBar,
  CardArt,
  KidAvatar,
  PANEL,
  ResultModal,
  TEAM_STYLE,
  TeamId,
  TeamPanel,
  shuffle,
  useCountdown,
} from './ArenaChrome';
import { sound } from '../../utils/audio';
import { triggerConfettiBurst } from '../../utils/confetti';

interface SectorSorterBattleProps {
  onGoToAmulFlowchart?: () => void;
  onExit?: () => void;
}

// Teams alternate turns; one round = one turn each, so each team gets TURNS_PER_TEAM tries.
const TURNS_PER_TEAM = 6;
const MATCH_SECONDS = 300;
const SLOTS_PER_SECTOR = 4;

const SECTORS: Array<{
  id: Sector;
  title: string;
  subtitle: string;
  image: string;
  examples: string;
  icon: React.ReactNode;
  iconBg: string;
  hintBg: string;
  theme: SectorTheme;
}> = [
  {
    id: 'primary',
    title: 'Primary Sector',
    subtitle: 'Uses natural resources',
    image: './images/primary_farmer_wheat.jpg',
    examples: 'e.g. farming, fishing, mining',
    icon: <Leaf className="w-5 h-5 xl:w-6 xl:h-6" strokeWidth={2.5} />,
    iconBg: 'bg-emerald-500',
    hintBg: 'bg-emerald-50',
    theme: {
      frame: 'border-emerald-300',
      body: 'from-emerald-50 to-emerald-100/70',
      title: 'text-emerald-800',
      subtitle: 'text-emerald-700',
      slot: 'border-emerald-300 bg-white/60',
      plus: 'bg-emerald-200 text-emerald-700',
      ring: 'ring-emerald-400',
    },
  },
  {
    id: 'secondary',
    title: 'Secondary Sector',
    subtitle: 'Makes goods from raw materials',
    image: './images/secondary_dairy_factory.jpg',
    examples: 'e.g. factories, mills, construction',
    icon: <Factory className="w-5 h-5 xl:w-6 xl:h-6" strokeWidth={2.5} />,
    iconBg: 'bg-blue-500',
    hintBg: 'bg-blue-50',
    theme: {
      frame: 'border-sky-300',
      body: 'from-sky-50 to-sky-100/70',
      title: 'text-blue-800',
      subtitle: 'text-blue-700',
      slot: 'border-sky-300 bg-white/60',
      plus: 'bg-sky-200 text-blue-700',
      ring: 'ring-sky-400',
    },
  },
  {
    id: 'tertiary',
    title: 'Tertiary Sector',
    subtitle: 'Provides services',
    image: './images/tertiary_kirana_store.jpg',
    examples: 'e.g. teaching, transport, healthcare',
    icon: <Users className="w-5 h-5 xl:w-6 xl:h-6" strokeWidth={2.5} />,
    iconBg: 'bg-violet-500',
    hintBg: 'bg-violet-50',
    theme: {
      frame: 'border-violet-300',
      body: 'from-violet-50 to-violet-100/70',
      title: 'text-violet-800',
      subtitle: 'text-violet-700',
      slot: 'border-violet-300 bg-white/60',
      plus: 'bg-violet-200 text-violet-700',
      ring: 'ring-violet-400',
    },
  },
];

const HOW_TO_PLAY = [
  { text: 'Look at the pictures and read what’s happening.', color: 'bg-emerald-500' },
  { text: 'On your team’s turn, drag a card to the correct sector column.', color: 'bg-blue-500' },
  { text: 'Each correct placement gives your team 1 point!', color: 'bg-orange-500' },
];

const emptyPlacements = (): Record<Sector, SectorPlacement[]> => ({ primary: [], secondary: [], tertiary: [] });

export const SectorSorterBattle: React.FC<SectorSorterBattleProps> = ({ onGoToAmulFlowchart, onExit }) => {
  const teamNames: Record<TeamId, string> = { teamA: INITIAL_TEAMS[0].name, teamB: INITIAL_TEAMS[1].name };

  const [deck, setDeck] = useState<SectorCard[]>(() => shuffle(SECTOR_CARDS));
  const [placements, setPlacements] = useState(emptyPlacements);
  const [turn, setTurn] = useState(0);
  const [correct, setCorrect] = useState<Record<TeamId, number>>({ teamA: 0, teamB: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ sector: Sector; tone: 'good' | 'bad' } | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState<'turns' | 'timeout' | null>(null);
  const [showResults, setShowResults] = useState(false);

  const [timeLeft, setTimeLeft] = useCountdown(MATCH_SECONDS, !paused && !gameOver, () => {
    setGameOver('timeout');
    sound.playBuzzer();
  });

  const activeTeam: TeamId = turn % 2 === 0 ? 'teamA' : 'teamB';
  const round = Math.min(Math.floor(turn / 2) + 1, TURNS_PER_TEAM);
  const sortedIds = useMemo(
    () => new Set(Object.values(placements).flatMap((list) => list.map((p) => p.card.id))),
    [placements]
  );

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 700);
    return () => clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    if (!shakeId) return;
    const t = setTimeout(() => setShakeId(null), 600);
    return () => clearTimeout(t);
  }, [shakeId]);

  // Let the last placement animate before the results pop up.
  useEffect(() => {
    if (!gameOver) return;
    const t = setTimeout(() => {
      setShowResults(true);
      sound.playSuccessFlourish();
      triggerConfettiBurst(3000);
    }, 900);
    return () => clearTimeout(t);
  }, [gameOver]);

  const placeCard = (cardId: string, sector: Sector) => {
    if (gameOver) return;
    if (paused) {
      setFeedback({ tone: 'info', text: 'The timer is paused. Tap the timer to resume the game.' });
      return;
    }
    const card = deck.find((c) => c.id === cardId);
    if (!card || sortedIds.has(cardId)) return;

    const team = activeTeam;
    const sectorTitle = SECTORS.find((s) => s.id === sector)!.title;
    const isCorrect = card.sector === sector;

    if (isCorrect) {
      sound.playChallengeComplete();
      setPlacements((prev) => ({ ...prev, [sector]: [...prev[sector], { card, team }] }));
      setCorrect((prev) => ({ ...prev, [team]: prev[team] + 1 }));
      setFeedback({ tone: 'good', text: `Correct, ${teamNames[team]}! “${card.title}” belongs in the ${sectorTitle}.` });
    } else {
      sound.playBuzzer();
      setShakeId(cardId);
      setFeedback({ tone: 'bad', text: `Not quite, ${teamNames[team]}! ${card.hint}` });
    }
    setFlash({ sector, tone: isCorrect ? 'good' : 'bad' });
    setSelectedId(null);

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    if (nextTurn >= TURNS_PER_TEAM * 2) {
      setGameOver('turns');
    } else {
      sound.playTurnSwitch();
    }
  };

  const resetGame = () => {
    sound.playClick();
    setDeck(shuffle(SECTOR_CARDS));
    setPlacements(emptyPlacements());
    setTurn(0);
    setCorrect({ teamA: 0, teamB: 0 });
    setSelectedId(null);
    setFeedback(null);
    setPaused(false);
    setGameOver(null);
    setShowResults(false);
    setTimeLeft(MATCH_SECONDS);
  };

  const winner: TeamId | null =
    correct.teamA > correct.teamB ? 'teamA' : correct.teamB > correct.teamA ? 'teamB' : null;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <SceneryBackdrop variant="farm" />

      <div className="relative z-10 h-full overflow-y-auto scrollable-panel">
        <div className="min-h-full flex flex-col gap-2 xl:gap-3 p-2 xl:p-4">
          <ActivityTopBar
            activityNumber={1}
            title="Sector"
            titleAccent="Sort"
            subtitle="Look at the pictures, read what’s happening and place them in the correct sector."
            timeLeft={timeLeft}
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            round={round}
            totalRounds={TURNS_PER_TEAM}
            signLines={['Different Jobs', 'Different Sectors', 'A Stronger Economy']}
            onExit={onExit}
          />

          <div className="flex-1 min-h-0 lg:min-h-[430px] grid grid-cols-1 lg:grid-cols-[minmax(230px,20%)_minmax(0,1fr)_minmax(230px,20%)] gap-2 xl:gap-3">
            {/* Left: Team Knowledge + How to play */}
            <aside className="flex flex-col gap-2 xl:gap-3 min-h-0">
              <TeamPanel
                team="teamA"
                name={teamNames.teamA}
                tagline="Explore • Think • Sort"
                score={correct.teamA}
                total={TURNS_PER_TEAM}
                scoreLabel="Correct"
                isActive={gameOver ? undefined : activeTeam === 'teamA'}
                statusChip={!gameOver && activeTeam === 'teamA' ? 'Your turn' : undefined}
              />
              <div className={`${PANEL} flex-1 p-3 xl:p-4`}>
                <h2 className="flex items-center gap-2 text-blue-700 font-black uppercase text-sm xl:text-lg">
                  <BookOpen className="w-5 h-5 xl:w-6 xl:h-6" strokeWidth={2.5} />
                  How to play
                </h2>
                <ol className="mt-2 xl:mt-4 space-y-2 xl:space-y-4">
                  {HOW_TO_PLAY.map((step, i) => (
                    <li key={step.text} className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 xl:w-9 xl:h-9 shrink-0 rounded-full ${step.color} text-white font-black text-sm xl:text-lg flex items-center justify-center shadow`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs xl:text-[15px] font-medium text-slate-700 leading-snug pt-1">
                        {step.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Center: the three sector columns */}
            <section className={`${PANEL} p-2 xl:p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 xl:gap-3 min-h-0`}>
              {SECTORS.map((s) => (
                <SectorDropColumn
                  key={s.id}
                  sector={s.id}
                  title={s.title}
                  subtitle={s.subtitle}
                  image={s.image}
                  theme={s.theme}
                  placements={placements[s.id]}
                  slotCount={SLOTS_PER_SECTOR}
                  teamNames={teamNames}
                  canTapPlace={selectedId !== null && !gameOver}
                  flash={flash?.sector === s.id ? flash.tone : null}
                  onPlace={placeCard}
                  onTapPlace={(sector) => selectedId && placeCard(selectedId, sector)}
                />
              ))}
            </section>

            {/* Right: Team Heritage + sector hints */}
            <aside className="flex flex-col gap-2 xl:gap-3 min-h-0">
              <TeamPanel
                team="teamB"
                name={teamNames.teamB}
                tagline="Observe • Decide • Place"
                score={correct.teamB}
                total={TURNS_PER_TEAM}
                scoreLabel="Correct"
                isActive={gameOver ? undefined : activeTeam === 'teamB'}
                statusChip={!gameOver && activeTeam === 'teamB' ? 'Your turn' : undefined}
              />
              <div className={`${PANEL} flex-1 p-3 xl:p-4`}>
                <h2 className="flex items-center gap-2 text-[#1B3A8C] font-black uppercase text-sm xl:text-lg">
                  <Lightbulb className="w-5 h-5 xl:w-6 xl:h-6 text-amber-500" strokeWidth={2.5} />
                  Sector hints
                </h2>
                <ul className="mt-2 xl:mt-3 space-y-2">
                  {SECTORS.map((s) => (
                    <li key={s.id} className={`flex items-start gap-3 rounded-2xl p-2 xl:p-2.5 ${s.hintBg}`}>
                      <span
                        className={`w-9 h-9 xl:w-11 xl:h-11 shrink-0 rounded-xl ${s.iconBg} text-white flex items-center justify-center shadow`}
                      >
                        {s.icon}
                      </span>
                      <div className="min-w-0">
                        <p className={`font-black text-xs xl:text-[15px] ${s.theme.title}`}>{s.title}</p>
                        <p className="text-[11px] xl:text-[13px] text-slate-700 leading-snug">{s.subtitle}</p>
                        <p className="text-[11px] xl:text-[13px] text-slate-500 leading-snug">({s.examples})</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Card dock */}
          <section className={`${PANEL} shrink-0 p-2 xl:p-3`}>
            <div className="flex flex-wrap items-center gap-2 xl:gap-3 mb-2">
              <Hand className="w-5 h-5 xl:w-6 xl:h-6 text-blue-600" strokeWidth={2.5} />
              <h2 className="font-black uppercase text-sm xl:text-base text-[#1B3A8C]">Drag these cards</h2>
              {!gameOver && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] xl:text-xs font-black text-white shadow ${TEAM_STYLE[activeTeam].solid}`}
                >
                  {teamNames[activeTeam]}’s turn
                </span>
              )}
              {feedback && (
                <p
                  key={`${turn}-${feedback.text}`}
                  role="status"
                  className={`flex-1 min-w-[220px] px-3 py-1 rounded-xl text-xs xl:text-sm font-semibold leading-snug line-clamp-2 animate-fadeIn ${
                    feedback.tone === 'good'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : feedback.tone === 'bad'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 xl:gap-3">
              {deck.map((card) => {
                const sorted = sortedIds.has(card.id);
                const selected = selectedId === card.id;
                const playable = !sorted && !gameOver;
                const toggleSelect = () => {
                  if (!playable) return;
                  sound.playClick();
                  setSelectedId(selected ? null : card.id);
                };
                // A div (not <button>) so Firefox allows dragging it.
                return (
                  <div
                    key={card.id}
                    role="button"
                    tabIndex={playable ? 0 : -1}
                    aria-disabled={!playable}
                    aria-pressed={selected}
                    draggable={playable}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', card.id);
                      e.dataTransfer.effectAllowed = 'move';
                      setSelectedId(card.id);
                    }}
                    onDragEnd={() => setSelectedId(null)}
                    onClick={toggleSelect}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSelect();
                      }
                    }}
                    className={`relative rounded-2xl bg-white p-1.5 text-center border-2 transition-all ${
                      sorted
                        ? 'opacity-45 grayscale border-transparent cursor-default'
                        : selected
                        ? `border-transparent ring-4 ${TEAM_STYLE[activeTeam].ring} -translate-y-1 shadow-lg`
                        : 'border-slate-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md cursor-grab active:cursor-grabbing'
                    } ${shakeId === card.id ? 'animate-shake !border-red-400' : ''}`}
                  >
                    <div className="h-14 sm:h-16 xl:h-20 2xl:h-24 rounded-xl overflow-hidden bg-slate-100 pointer-events-none">
                      <CardArt imageUrl={card.imageUrl} illustrationKey={card.illustrationKey} alt={card.title} />
                    </div>
                    <p className="mt-1 text-[11px] xl:text-[13px] font-semibold text-slate-700 leading-tight line-clamp-2 min-h-[2.5em]">
                      {card.title}
                    </p>
                    {sorted && (
                      <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {showResults && (
        <ResultModal>
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center mb-3 animate-floaty">
            <Trophy className="w-10 h-10 text-amber-500" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            {gameOver === 'timeout' ? 'Time’s up!' : 'All rounds played!'}
          </p>
          <h2 className="text-2xl xl:text-3xl font-black text-[#1B3A8C] mt-1">
            {winner ? `${teamNames[winner]} wins!` : 'It’s a tie. Well played, both teams!'}
          </h2>
          <p className="text-sm text-slate-600 mt-2 mb-5 max-w-md mx-auto">
            Farming, fishing and mining use nature (primary). Factories turn raw materials into goods (secondary).
            Services like transport, shops and schools help everyone (tertiary).
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['teamA', 'teamB'] as TeamId[]).map((id) => (
              <div
                key={id}
                className={`rounded-2xl p-3 bg-gradient-to-br ${TEAM_STYLE[id].gradient} text-white ${
                  winner === id ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                <KidAvatar kind={TEAM_STYLE[id].avatar} className="w-16 h-16 mx-auto" />
                <div className="font-black uppercase text-sm mt-1">{teamNames[id]}</div>
                <div className="text-3xl font-black tabular-nums">
                  {correct[id]} / {TURNS_PER_TEAM}
                </div>
                <div className="text-[11px] font-bold uppercase opacity-90">Correct</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetGame}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={3} />
              Play again
            </button>
            {onGoToAmulFlowchart && (
              <button
                type="button"
                onClick={onGoToAmulFlowchart}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 hover:brightness-105 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                Next: Amul Story Sequence
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            )}
          </div>
        </ResultModal>
      )}
    </div>
  );
};
