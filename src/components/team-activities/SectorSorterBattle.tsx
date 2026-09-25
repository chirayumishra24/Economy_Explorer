import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Hand, Leaf, Lightbulb, Plus, Settings, Users, Check, X } from 'lucide-react';
import { Sector, SectorCard, TeamId } from '../../types/economy';
import { SECTOR_CARDS, SECTOR_META, TEAMS } from '../../data/teamActivitiesData';
import {
  ArenaCard,
  ArenaShell,
  PrimaryButton,
  ResultsModal,
  TEAM_STYLES,
  TeamPanelHeader,
  useCountdown,
} from './ArenaShell';
import { sound } from '../../utils/audio';
import { triggerConfettiBurst } from '../../utils/confetti';

const TURN_SECONDS = 45;
const CARDS_PER_TEAM = SECTOR_CARDS.length / 2;
const SECTORS: Sector[] = ['primary', 'secondary', 'tertiary'];

const COLUMN_STYLES: Record<Sector, { title: string; sub: string; panel: string; slot: string; plus: string; glow: string }> = {
  primary: {
    title: 'text-[#1F6B34]',
    sub: 'text-[#1F6B34]/80',
    panel: 'from-[#E9F8EC] to-[#F6FCF7] border-[#9ED9A9]',
    slot: 'border-[#9ED9A9]',
    plus: 'bg-[#8FD19C]',
    glow: 'ring-[#4CB860]',
  },
  secondary: {
    title: 'text-[#1B4FA8]',
    sub: 'text-[#1B4FA8]/80',
    panel: 'from-[#E6F0FF] to-[#F5F9FF] border-[#8FB8F2]',
    slot: 'border-[#8FB8F2]',
    plus: 'bg-[#7FB0F5]',
    glow: 'ring-[#3E86E8]',
  },
  tertiary: {
    title: 'text-[#6B2FA8]',
    sub: 'text-[#6B2FA8]/80',
    panel: 'from-[#F3EAFE] to-[#FBF7FF] border-[#C9A8F2]',
    slot: 'border-[#C9A8F2]',
    plus: 'bg-[#B98DEB]',
    glow: 'ring-[#9A5BE0]',
  },
};

interface Placement {
  teamId: TeamId;
  correct: boolean;
  guessed: Sector;
}

interface SectorSorterBattleProps {
  onGoToAmulFlowchart?: () => void;
  onExit?: () => void;
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export const SectorSorterBattle: React.FC<SectorSorterBattleProps> = ({ onGoToAmulFlowchart, onExit }) => {
  const [deck, setDeck] = useState<SectorCard[]>(() => shuffle(SECTOR_CARDS));
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [placementOrder, setPlacementOrder] = useState<string[]>([]);
  const [turn, setTurn] = useState<TeamId>('teamA');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Sector | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);

  const isGameOver = placementOrder.length === deck.length;
  const [secondsLeft, resetTimer] = useCountdown(TURN_SECONDS, !isGameOver);

  const correctCount = useMemo(() => {
    const counts: Record<TeamId, number> = { teamA: 0, teamB: 0 };
    Object.values(placements).forEach((p) => p.correct && counts[p.teamId]++);
    return counts;
  }, [placements]);

  const passTurn = () => {
    setTurn((t) => (t === 'teamA' ? 'teamB' : 'teamA'));
    setSelectedId(null);
    resetTimer();
    sound.playTurnSwitch();
  };

  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(id);
  }, [feedback]);

  // Time's up: the card stays in the tray and the other team plays.
  useEffect(() => {
    if (secondsLeft === 0 && !isGameOver) {
      sound.playBuzzer();
      setFeedback({ tone: 'info', text: `Time's up for ${TEAMS.find((t) => t.id === turn)!.name}! Turn passes.` });
      passTurn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const placeCard = (cardId: string, sector: Sector) => {
    const card = deck.find((c) => c.id === cardId);
    if (!card || placements[cardId] || isGameOver) return;

    const correct = card.sector === sector;
    const teamName = TEAMS.find((t) => t.id === turn)!.name;
    setPlacements((prev) => ({ ...prev, [cardId]: { teamId: turn, correct, guessed: sector } }));
    const nextOrder = [...placementOrder, cardId];
    setPlacementOrder(nextOrder);

    if (correct) {
      sound.playChallengeComplete();
      setFeedback({ tone: 'good', text: `Correct, ${teamName}! "${card.title}" belongs to the ${SECTOR_META[sector].title}. +1` });
    } else {
      sound.playBuzzer();
      setFeedback({
        tone: 'bad',
        text: `Not quite! "${card.title}" is ${SECTOR_META[card.sector].title}. ${card.hint}`,
      });
    }

    if (nextOrder.length === deck.length) {
      setSelectedId(null);
      triggerConfettiBurst(3500);
      sound.playSuccessFlourish();
    } else {
      passTurn();
    }
  };

  const resetGame = () => {
    sound.playClick();
    setDeck(shuffle(SECTOR_CARDS));
    setPlacements({});
    setPlacementOrder([]);
    setTurn('teamA');
    setSelectedId(null);
    setFeedback(null);
    resetTimer();
  };

  const roundDots = deck.map((_, i) =>
    i < placementOrder.length
      ? placements[placementOrder[i]].teamId
      : i === placementOrder.length
      ? ('current' as const)
      : ('todo' as const)
  );

  const winner =
    correctCount.teamA === correctCount.teamB ? null : correctCount.teamA > correctCount.teamB ? TEAMS[0] : TEAMS[1];

  return (
    <ArenaShell
      activityNumber={1}
      title={[
        { text: 'SECTOR', className: 'text-arenaNavy' },
        { text: 'SORT', className: 'text-arenaOrange' },
      ]}
      subtitle="Look at the pictures, read what's happening and place them in the correct sector."
      secondsLeft={secondsLeft}
      timerLabel="Turn Time Left"
      roundLabel={`ROUND ${Math.min(placementOrder.length + 1, deck.length)} / ${deck.length}`}
      roundDots={roundDots}
      tagline={['Different Jobs', 'Different Sectors', 'A Stronger Economy']}
      onExit={onExit}
    >
      <main className="flex-1 grid gap-3 lg:grid-cols-[minmax(250px,1fr)_minmax(0,2.6fr)_minmax(250px,1fr)] lg:grid-rows-[1fr_auto]">
        {/* ---------- Left: Team Knowledge + How to play ---------- */}
        <section className="flex flex-col gap-3 min-h-0 order-1">
          <TeamPanelHeader
            team={TEAMS[0]}
            tagline={TEAMS[0].sortTagline}
            correct={correctCount.teamA}
            total={CARDS_PER_TEAM}
            scoreLabel="Correct"
            isActive={!isGameOver && turn === 'teamA'}
          />
          <ArenaCard className="p-4 flex-1">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-arenaBlue uppercase mb-3">
              <BookOpen className="w-6 h-6" /> How to Play
            </h3>
            <ol className="space-y-3">
              {[
                { n: 1, color: 'bg-[#2BA24C]', text: "Look at the pictures and read what's happening." },
                { n: 2, color: 'bg-arenaBlue', text: 'Drag the card to the correct sector column (or tap card, then column).' },
                { n: 3, color: 'bg-arenaOrange', text: 'Each correct placement gives your team 1 point!' },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-3">
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full ${step.color} text-white font-extrabold flex items-center justify-center shadow`}
                  >
                    {step.n}
                  </span>
                  <span className="text-sm font-semibold leading-snug pt-1">{step.text}</span>
                </li>
              ))}
            </ol>
          </ArenaCard>
        </section>

        {/* ---------- Centre: Sector columns ---------- */}
        <section className="order-3 lg:order-2 min-h-0 flex flex-col relative">
          <ArenaCard className="p-2.5 sm:p-3 flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SECTORS.map((sector) => {
              const meta = SECTOR_META[sector];
              const styles = COLUMN_STYLES[sector];
              const placed = placementOrder.filter((id) => deck.find((c) => c.id === id)!.sector === sector);
              const slotCount = Math.max(3, placed.length + 1);
              const isTarget = dragOver === sector;
              return (
                <div
                  key={sector}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(sector);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(null);
                    placeCard(e.dataTransfer.getData('text/plain'), sector);
                  }}
                  onClick={() => selectedId && placeCard(selectedId, sector)}
                  className={`rounded-2xl border-2 bg-gradient-to-b ${styles.panel} overflow-hidden flex flex-col min-h-[260px] transition-all ${
                    isTarget ? `ring-4 ${styles.glow} scale-[1.01]` : selectedId ? `cursor-pointer hover:ring-4 ${styles.glow}` : ''
                  }`}
                >
                  <div className="relative h-24 sm:h-28 shrink-0">
                    <img src={meta.image} alt="" className="w-full h-full object-cover" draggable={false} />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-white/80" />
                  </div>
                  <div className="text-center px-2 pt-1 pb-2">
                    <h3 className={`text-lg sm:text-xl xl:text-2xl font-extrabold uppercase leading-none ${styles.title}`}>
                      {meta.title}
                    </h3>
                    <p className={`text-sm font-semibold leading-tight mt-1 ${styles.sub}`}>{meta.subtitle}</p>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto scrollable-panel px-3 pb-3 flex flex-col gap-2">
                    {Array.from({ length: slotCount }).map((_, i) => {
                      const cardId = placed[i];
                      if (!cardId) {
                        return (
                          <div
                            key={`empty-${i}`}
                            className={`h-14 shrink-0 rounded-xl border-2 border-dashed ${styles.slot} bg-white/50 flex items-center justify-center`}
                          >
                            <span className={`w-7 h-7 rounded-full ${styles.plus} text-white flex items-center justify-center`}>
                              <Plus className="w-5 h-5" strokeWidth={3} />
                            </span>
                          </div>
                        );
                      }
                      const card = deck.find((c) => c.id === cardId)!;
                      const p = placements[cardId];
                      return (
                        <div
                          key={cardId}
                          className={`h-14 shrink-0 rounded-xl bg-white border-2 flex items-center gap-2 pr-2 overflow-hidden shadow-sm animate-fadeIn ${
                            p.correct ? TEAM_STYLES[p.teamId].border : 'border-arenaRed/50'
                          }`}
                          title={p.correct ? 'Placed correctly' : `Guessed ${SECTOR_META[p.guessed].title} — moved here`}
                        >
                          <img src={card.image} alt="" className="h-full w-16 object-cover shrink-0" draggable={false} />
                          <span className="flex-1 text-xs sm:text-sm font-bold leading-tight line-clamp-2">{card.title}</span>
                          <span
                            className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-white ${
                              p.correct ? TEAM_STYLES[p.teamId].solid : 'bg-arenaRed'
                            }`}
                          >
                            {p.correct ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </ArenaCard>

          {feedback && (
            <div
              role="status"
              className={`absolute left-3 right-3 bottom-3 z-10 rounded-xl px-4 py-2 text-sm font-bold border-2 shadow-lg animate-fadeIn ${
                feedback.tone === 'good'
                  ? 'bg-[#E9F8EC] border-[#7CCB8C] text-[#1F6B34]'
                  : feedback.tone === 'bad'
                  ? 'bg-[#FFF0EE] border-[#F2A59A] text-[#A5281B]'
                  : 'bg-white border-[#9CCBFF] text-arenaNavy'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </section>

        {/* ---------- Right: Team Heritage + Sector hints ---------- */}
        <section className="flex flex-col gap-3 min-h-0 order-2 lg:order-3">
          <TeamPanelHeader
            team={TEAMS[1]}
            tagline={TEAMS[1].sortTagline}
            correct={correctCount.teamB}
            total={CARDS_PER_TEAM}
            scoreLabel="Correct"
            isActive={!isGameOver && turn === 'teamB'}
          />
          <ArenaCard className="p-3 flex-1">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-arenaNavy uppercase mb-2">
              <Lightbulb className="w-6 h-6 text-accentYellow" /> Sector Hints
            </h3>
            <div className="space-y-2">
              {[
                { sector: 'primary' as const, Icon: Leaf, bg: 'bg-[#E9F8EC]', icon: 'bg-[#2BA24C]', text: 'text-[#1F6B34]' },
                { sector: 'secondary' as const, Icon: Settings, bg: 'bg-[#F1EBFD]', icon: 'bg-[#7C4DDB]', text: 'text-[#5B2DB8]' },
                { sector: 'tertiary' as const, Icon: Users, bg: 'bg-[#FFF1E8]', icon: 'bg-arenaOrange', text: 'text-[#C2410C]' },
              ].map(({ sector, Icon, bg, icon, text }) => (
                <div key={sector} className={`${bg} rounded-xl p-2 flex items-start gap-2.5`}>
                  <span className={`w-10 h-10 shrink-0 rounded-xl ${icon} text-white flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="leading-tight">
                    <div className={`font-extrabold ${text}`}>{SECTOR_META[sector].title}</div>
                    <div className="text-xs font-semibold text-arenaNavy/80">
                      {SECTOR_META[sector].subtitle}
                      <br />
                      (e.g. {SECTOR_META[sector].examples})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ArenaCard>
        </section>

        {/* ---------- Bottom: Card tray ---------- */}
        <ArenaCard className="order-4 lg:col-span-3 p-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-extrabold uppercase">
              <Hand className="w-6 h-6 text-arenaBlue" /> Drag These Cards
            </h3>
            {!isGameOver && (
              <span className={`text-sm font-extrabold ${TEAM_STYLES[turn].text}`}>
                {TEAMS.find((t) => t.id === turn)!.name}, it's your turn!
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5">
            {deck.map((card) => {
              const placed = placements[card.id];
              const isSelected = selectedId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  draggable={!placed && !isGameOver}
                  disabled={Boolean(placed) || isGameOver}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', card.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setSelectedId(card.id);
                  }}
                  onDragEnd={() => setDragOver(null)}
                  onClick={() => {
                    sound.playClick();
                    setSelectedId(isSelected ? null : card.id);
                  }}
                  className={`relative rounded-xl bg-white border-2 p-1.5 text-center shadow-[0_3px_8px_rgba(22,48,107,0.12)] transition-all ${
                    placed
                      ? 'opacity-35 grayscale cursor-default border-transparent'
                      : isSelected
                      ? `border-accentYellow ring-4 ring-accentYellow/50 -translate-y-1`
                      : 'border-[#E3ECF7] hover:-translate-y-1 hover:border-[#9CCBFF] cursor-grab active:cursor-grabbing'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={placed ? `${card.title} (already placed)` : card.title}
                >
                  <img src={card.image} alt="" className="w-full h-16 xl:h-[4.5rem] object-cover rounded-lg pointer-events-none" draggable={false} />
                  <div className="text-xs xl:text-sm font-bold leading-tight mt-1 min-h-[2.4em] flex items-center justify-center">
                    {card.title}
                  </div>
                  {placed && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-arenaNavy text-white flex items-center justify-center">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </ArenaCard>
      </main>

      {isGameOver && (
        <ResultsModal
          heading={winner ? `${winner.name} wins!` : "It's a tie!"}
          message="All 12 jobs have been sorted into the Primary, Secondary and Tertiary sectors."
          teams={TEAMS}
          scores={correctCount}
          total={CARDS_PER_TEAM}
          actions={
            <>
              <PrimaryButton onClick={resetGame}>Play Again</PrimaryButton>
              {onGoToAmulFlowchart && (
                <PrimaryButton tone="teamB" onClick={onGoToAmulFlowchart}>
                  Next: Amul Story →
                </PrimaryButton>
              )}
            </>
          }
        />
      )}
    </ArenaShell>
  );
};
