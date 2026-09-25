import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, GripVertical, Lightbulb, RotateCcw, Workflow, X, ListChecks } from 'lucide-react';
import { StoryEvent, TeamId } from '../../types/economy';
import { STORY_ROUNDS, TEAMS } from '../../data/teamActivitiesData';
import {
  ArenaCard,
  ArenaShell,
  PrimaryButton,
  ResultsModal,
  TEAM_STYLES,
  TeamPanelHeader,
  useCountdown,
} from './ArenaShell';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';
import { sound } from '../../utils/audio';
import { triggerConfettiBurst } from '../../utils/confetti';

const ROUND_SECONDS = 5 * 60;
const HINTS_PER_GAME = 2;
const STEPS = 6;
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

type Board = (string | null)[];
const emptyBoard = (): Board => Array(STEPS).fill(null);
const emptyBoards = (): Record<TeamId, Board> => ({ teamA: emptyBoard(), teamB: emptyBoard() });
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const scoreBoard = (board: Board, events: StoryEvent[]) =>
  board.reduce((sum, id, i) => sum + (id && id === events[i].id ? 1 : 0), 0);

const EventArt: React.FC<{ event: StoryEvent; className?: string }> = ({ event, className = '' }) =>
  event.image ? (
    <img src={event.image} alt="" className={`object-cover ${className}`} draggable={false} />
  ) : (
    <div className={`overflow-hidden ${className}`}>
      <ActivitySceneRenderer illustrationKey={event.illustrationKey ?? ''} className="w-full h-full" />
    </div>
  );

interface AmulFlowchartChallengeProps {
  onGoToSectorSorter?: () => void;
  onExit?: () => void;
}

export const AmulFlowchartChallenge: React.FC<AmulFlowchartChallengeProps> = ({ onGoToSectorSorter, onExit }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [boards, setBoards] = useState<Record<TeamId, Board>>(emptyBoards);
  const [submitted, setSubmitted] = useState<Record<TeamId, boolean>>({ teamA: false, teamB: false });
  const [hintsLeft, setHintsLeft] = useState<Record<TeamId, number>>({ teamA: HINTS_PER_GAME, teamB: HINTS_PER_GAME });
  const [roundScores, setRoundScores] = useState<Record<TeamId, number>[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState<Partial<Record<TeamId, string>>>({});
  const [showFinal, setShowFinal] = useState(false);

  const round = STORY_ROUNDS[roundIdx];
  const events = round.events;
  const [tray, setTray] = useState<StoryEvent[]>(() => shuffle(STORY_ROUNDS[0].events));
  const eventById = useMemo(() => Object.fromEntries(events.map((e) => [e.id, e])), [events]);

  const revealed = submitted.teamA && submitted.teamB;
  const [secondsLeft, resetTimer] = useCountdown(ROUND_SECONDS, !revealed);
  const isLastRound = roundIdx === STORY_ROUNDS.length - 1;

  const liveScore = (team: TeamId) => (revealed ? scoreBoard(boards[team], events) : 0);

  // Reveal: record the round's result once both boards are locked in.
  useEffect(() => {
    if (!revealed || roundScores.length > roundIdx) return;
    const result = { teamA: scoreBoard(boards.teamA, events), teamB: scoreBoard(boards.teamB, events) };
    setRoundScores((prev) => [...prev, result]);
    if (result.teamA === STEPS || result.teamB === STEPS) triggerConfettiBurst(2500);
    sound.playSuccessFlourish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  // Time's up: lock both boards as they are.
  useEffect(() => {
    if (secondsLeft === 0 && !revealed) {
      sound.playBuzzer();
      setSubmitted({ teamA: true, teamB: true });
    }
  }, [secondsLeft, revealed]);

  const flash = (team: TeamId, text: string) => {
    setNotice((prev) => ({ ...prev, [team]: text }));
    window.setTimeout(() => setNotice((prev) => (prev[team] === text ? { ...prev, [team]: undefined } : prev)), 2600);
  };

  const place = (team: TeamId, slot: number, eventId: string) => {
    if (submitted[team] || !eventById[eventId]) return;
    sound.playProductMove();
    setBoards((prev) => {
      const next = prev[team].map((id) => (id === eventId ? null : id));
      next[slot] = eventId;
      return { ...prev, [team]: next };
    });
    setSelectedId(null);
  };

  const removeFromSlot = (team: TeamId, slot: number) => {
    if (submitted[team]) return;
    sound.playClick();
    setBoards((prev) => {
      const next = [...prev[team]];
      next[slot] = null;
      return { ...prev, [team]: next };
    });
  };

  const applyHint = (team: TeamId) => {
    if (submitted[team] || hintsLeft[team] === 0) return;
    const slot = boards[team].findIndex((id, i) => id !== events[i].id);
    if (slot === -1) {
      flash(team, 'Your order already looks right — submit it!');
      return;
    }
    sound.playConnectionMade();
    const correct = events[slot];
    setBoards((prev) => {
      const next = prev[team].map((id) => (id === correct.id ? null : id));
      next[slot] = correct.id;
      return { ...prev, [team]: next };
    });
    setHintsLeft((prev) => ({ ...prev, [team]: prev[team] - 1 }));
    flash(team, `Hint: step ${slot + 1} — ${correct.clue}`);
  };

  const submit = (team: TeamId) => {
    if (submitted[team]) return;
    if (boards[team].some((id) => id === null)) {
      sound.playBuzzer();
      flash(team, 'Fill all 6 steps before submitting!');
      return;
    }
    sound.playChallengeComplete();
    setSubmitted((prev) => ({ ...prev, [team]: true }));
    const other = team === 'teamA' ? 'teamB' : 'teamA';
    if (!submitted[other]) flash(team, 'Locked in! Waiting for the other team…');
  };

  const clearAll = () => {
    sound.playClick();
    setBoards((prev) => ({
      teamA: submitted.teamA ? prev.teamA : emptyBoard(),
      teamB: submitted.teamB ? prev.teamB : emptyBoard(),
    }));
    setSelectedId(null);
  };

  const startRound = (idx: number) => {
    setRoundIdx(idx);
    setTray(shuffle(STORY_ROUNDS[idx].events));
    setBoards(emptyBoards());
    setSubmitted({ teamA: false, teamB: false });
    setSelectedId(null);
    setNotice({});
    resetTimer();
  };

  const nextRound = () => {
    sound.playMachineStart();
    if (isLastRound) {
      setShowFinal(true);
      triggerConfettiBurst(3500);
    } else {
      startRound(roundIdx + 1);
    }
  };

  const playAgain = () => {
    sound.playClick();
    setRoundScores([]);
    setHintsLeft({ teamA: HINTS_PER_GAME, teamB: HINTS_PER_GAME });
    setShowFinal(false);
    startRound(0);
  };

  const totals = roundScores.reduce(
    (acc, r) => ({ teamA: acc.teamA + r.teamA, teamB: acc.teamB + r.teamB }),
    { teamA: 0, teamB: 0 }
  );
  const roundDots = STORY_ROUNDS.map((_, i) => {
    const r = roundScores[i];
    if (r) return r.teamA === r.teamB ? ('tie' as const) : r.teamA > r.teamB ? ('teamA' as const) : ('teamB' as const);
    return i === roundIdx ? ('current' as const) : ('todo' as const);
  });
  const winner = totals.teamA === totals.teamB ? null : totals.teamA > totals.teamB ? TEAMS[0] : TEAMS[1];

  const renderTeamColumn = (teamIdx: 0 | 1) => {
    const team = TEAMS[teamIdx];
    const styles = TEAM_STYLES[team.id];
    const board = boards[team.id];
    const locked = submitted[team.id];

    return (
      <section className={`flex flex-col gap-3 min-h-0 ${teamIdx === 0 ? 'order-1' : 'order-2 lg:order-3'}`}>
        <TeamPanelHeader
          team={team}
          tagline={team.storyTagline}
          correct={liveScore(team.id)}
          total={STEPS}
          scoreLabel="Correct Order"
          isActive={locked && !revealed}
          activeLabel="Locked In!"
        />
        <ArenaCard className="p-3 flex-1 flex flex-col min-h-0">
          <h3 className={`text-center text-lg font-extrabold uppercase mb-2 ${teamIdx === 0 ? 'text-arenaBlue' : 'text-arenaRed'}`}>
            Your Flowchart
          </h3>
          <ol className="flex flex-col flex-1 min-h-0">
            {board.map((eventId, slot) => {
              const event = eventId ? eventById[eventId] : null;
              const key = `${team.id}-${slot}`;
              const isRight = revealed && eventId === events[slot].id;
              const isWrong = revealed && !isRight;
              return (
                <li key={key} className="flex flex-col items-center">
                  <div
                    onDragOver={(e) => {
                      if (locked) return;
                      e.preventDefault();
                      setDragTarget(key);
                    }}
                    onDragLeave={() => setDragTarget(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragTarget(null);
                      place(team.id, slot, e.dataTransfer.getData('text/plain'));
                    }}
                    onClick={() => selectedId && place(team.id, slot, selectedId)}
                    className={`w-full min-h-[48px] rounded-xl border-2 flex items-center gap-2 px-2 py-1 transition-all ${
                      isRight
                        ? 'border-[#2BA24C] bg-[#E9F8EC]'
                        : isWrong
                        ? 'border-arenaRed bg-[#FFF0EE]'
                        : dragTarget === key
                        ? `border-solid ${styles.border} ${styles.soft} ring-4 ${styles.ring}`
                        : event
                        ? `border-solid ${styles.border} bg-white`
                        : `border-dashed ${styles.border} ${styles.soft} ${selectedId && !locked ? `cursor-pointer ring-2 ${styles.ring} animate-pulse` : ''}`
                    }`}
                  >
                    <span
                      className={`w-8 h-8 shrink-0 rounded-full ${styles.solid} text-white font-extrabold flex items-center justify-center shadow`}
                    >
                      {slot + 1}
                    </span>
                    {event ? (
                      <div
                        draggable={!locked}
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', event.id)}
                        className={`flex-1 min-w-0 flex items-center gap-2 ${locked ? '' : 'cursor-grab'}`}
                      >
                        <EventArt event={event} className="w-12 h-9 rounded-md shrink-0" />
                        <span className="flex-1 text-xs sm:text-[13px] font-bold leading-tight line-clamp-2">{event.text}</span>
                        {revealed ? (
                          <span
                            className={`w-6 h-6 shrink-0 rounded-full text-white flex items-center justify-center ${isRight ? 'bg-[#2BA24C]' : 'bg-arenaRed'}`}
                          >
                            {isRight ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
                          </span>
                        ) : (
                          !locked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromSlot(team.id, slot);
                              }}
                              className="w-6 h-6 shrink-0 rounded-full bg-arenaNavy/10 hover:bg-arenaRed hover:text-white text-arenaNavy/60 flex items-center justify-center"
                              aria-label={`Remove event from step ${slot + 1}`}
                            >
                              <X className="w-3.5 h-3.5" strokeWidth={3} />
                            </button>
                          )
                        )}
                      </div>
                    ) : (
                      <span className={`flex-1 text-center text-sm font-semibold ${teamIdx === 0 ? 'text-arenaNavy/60' : 'text-[#B4471A]/80'}`}>
                        {isWrong ? 'Missing step' : `Drop the ${ORDINALS[slot]} event here`}
                      </span>
                    )}
                  </div>
                  {slot < STEPS - 1 && (
                    <ArrowDown className={`w-5 h-5 my-0.5 ${teamIdx === 0 ? 'text-arenaBlue' : 'text-arenaRed'}`} strokeWidth={3} />
                  )}
                </li>
              );
            })}
          </ol>

          {notice[team.id] && (
            <p role="status" className="mt-2 text-xs sm:text-sm font-bold rounded-lg bg-[#FFF8E1] border border-accentYellow px-2.5 py-1.5">
              {notice[team.id]}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => applyHint(team.id)}
              disabled={locked || hintsLeft[team.id] === 0}
              className="flex items-center gap-2 rounded-xl bg-[#FFF8E1] border-2 border-[#FBE3A0] px-3 py-2 font-extrabold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF1C4]"
            >
              <Lightbulb className="w-5 h-5 text-accentYellow fill-accentYellow/40" />
              Hint
              <span className="ml-1 rounded-md bg-accentYellow/80 px-1.5 py-0.5 text-[11px]">{hintsLeft[team.id]} Left</span>
            </button>
          </div>
          <PrimaryButton tone={team.id} className="mt-2 w-full" onClick={() => submit(team.id)} disabled={locked}>
            {locked ? (revealed ? `${liveScore(team.id)} / 6 Correct` : 'Order Locked') : 'Submit Order'}
          </PrimaryButton>
        </ArenaCard>
      </section>
    );
  };

  return (
    <ArenaShell
      activityNumber={2}
      title={[
        { text: 'AMUL', className: 'text-arenaRed' },
        { text: 'STORY', className: 'text-arenaNavy' },
        { text: 'SEQUENCE', className: 'text-arenaOrange' },
      ]}
      subtitle="Arrange the events in the correct order to show how Amul became a success."
      secondsLeft={secondsLeft}
      roundLabel={`ROUND ${roundIdx + 1} / ${STORY_ROUNDS.length}`}
      roundDots={roundDots}
      tagline={['From Farmers', 'To A Strong Cooperative', 'A Successful Journey']}
      onExit={onExit}
    >
      <main className="flex-1 grid gap-3 lg:grid-cols-[minmax(270px,1fr)_minmax(0,1.9fr)_minmax(270px,1fr)]">
        {renderTeamColumn(0)}

        {/* ---------- Centre ---------- */}
        <section className="order-3 lg:order-2 flex flex-col gap-3 min-h-0">
          <ArenaCard className="p-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase leading-none">
                  <span className="text-arenaNavy">{round.title} </span>
                  <span className="text-arenaOrange">{round.titleAccent}</span>
                </h2>
                <p className="text-sm font-semibold text-arenaNavy/75 mt-1">{round.subtitle}</p>
              </div>
              <div className="md:max-w-[46%] flex items-center gap-2 rounded-xl bg-[#FFF8E1] border border-[#FBE3A0] px-3 py-2">
                <BookOpen className="w-7 h-7 text-arenaBlue shrink-0" />
                <p className="text-xs font-semibold leading-snug">
                  Drag the cards below (or tap a card, then a step) to complete your team's flowchart of the story.
                </p>
              </div>
            </div>
            <img
              src={round.heroImage}
              alt="Amul truck, cows and dairy plant in a village"
              className="mt-3 w-full h-24 sm:h-32 object-cover rounded-xl"
              draggable={false}
            />
          </ArenaCard>

          <ArenaCard className="p-3 flex-1 min-h-0 flex flex-col">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-extrabold uppercase mb-2">
              <Workflow className="w-6 h-6 text-arenaBlue" /> Drag These Events
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 min-h-0 auto-rows-fr">
              {tray.map((event) => {
                const isSelected = selectedId === event.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    draggable={!revealed}
                    disabled={revealed}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', event.id);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onDragEnd={() => setDragTarget(null)}
                    onClick={() => {
                      sound.playClick();
                      setSelectedId(isSelected ? null : event.id);
                    }}
                    aria-pressed={isSelected}
                    className={`relative rounded-xl bg-white border-2 p-2 pl-6 flex flex-col text-center shadow-[0_3px_8px_rgba(22,48,107,0.12)] transition-all ${
                      isSelected
                        ? 'border-accentYellow ring-4 ring-accentYellow/50 -translate-y-1'
                        : 'border-[#E3ECF7] hover:-translate-y-1 hover:border-[#9CCBFF] cursor-grab active:cursor-grabbing'
                    } disabled:cursor-default disabled:hover:translate-y-0`}
                  >
                    <GripVertical className="absolute left-1 top-1/3 w-4 h-6 text-[#AFC3DD]" />
                    <EventArt event={event} className="w-full aspect-[16/9] max-h-28 rounded-lg" />
                    <span className="text-xs sm:text-sm font-semibold leading-tight mt-1.5 flex-1 flex items-center justify-center">
                      {event.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </ArenaCard>

          <ArenaCard className="p-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-extrabold uppercase whitespace-nowrap shrink-0">
                <ListChecks className="w-6 h-6 text-arenaBlue" /> Check Your Order
              </h3>
              <div className="flex-1 min-w-fit flex items-center justify-center gap-1">
                {events.map((event, i) => (
                  <React.Fragment key={event.id}>
                    <div
                      className={`w-9 h-9 2xl:w-10 2xl:h-10 shrink-0 rounded-full border-[3px] overflow-hidden flex items-center justify-center font-extrabold ${
                        revealed ? 'border-[#2BA24C]' : 'border-[#E3ECF7] bg-[#DCE9FA] text-white'
                      }`}
                      title={revealed ? `${i + 1}. ${event.text}` : `Step ${i + 1}`}
                    >
                      {revealed ? <EventArt event={event} className="w-full h-full" /> : i + 1}
                    </div>
                    {i < events.length - 1 && <ArrowRight className="w-3.5 h-3.5 shrink-0 text-arenaNavy/60" strokeWidth={3} />}
                  </React.Fragment>
                ))}
              </div>
              {revealed ? (
                <PrimaryButton tone="teamA" onClick={nextRound} className="!py-2 !text-sm">
                  {isLastRound ? 'See Results' : 'Next Round →'}
                </PrimaryButton>
              ) : (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 rounded-xl bg-[#E9EEF5] hover:bg-[#DCE3EE] px-4 py-2.5 font-extrabold uppercase text-sm"
                >
                  <RotateCcw className="w-5 h-5" /> Clear All
                </button>
              )}
            </div>
          </ArenaCard>
        </section>

        {renderTeamColumn(1)}
      </main>

      {showFinal && (
        <ResultsModal
          heading={winner ? `${winner.name} wins!` : "It's a tie!"}
          message="Great sequencing! From farmers joining hands to better lives — that's how a cooperative grows."
          teams={TEAMS}
          scores={totals}
          total={STEPS * STORY_ROUNDS.length}
          actions={
            <>
              <PrimaryButton onClick={playAgain}>Play Again</PrimaryButton>
              {onGoToSectorSorter && (
                <PrimaryButton tone="teamA" onClick={onGoToSectorSorter}>
                  ← Sector Sort
                </PrimaryButton>
              )}
            </>
          }
        />
      )}
    </ArenaShell>
  );
};
