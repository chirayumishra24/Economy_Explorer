import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  GripVertical,
  Lightbulb,
  ListChecks,
  Milk,
  RotateCcw,
  Shuffle,
  Trophy,
  X,
} from 'lucide-react';
import { StoryEvent } from '../../types/economy';
import { AMUL_STORY_ROUNDS, INITIAL_TEAMS } from '../../data/teamActivitiesData';
import { FlowchartStepSlot } from './FlowchartStepSlot';
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

interface AmulFlowchartChallengeProps {
  onGoToSectorSorter?: () => void;
  onExit?: () => void;
}

const STEPS = 6;
const ROUND_SECONDS = 300;
const HINTS_PER_ROUND = 2;
const TEAMS: TeamId[] = ['teamA', 'teamB'];
const TAGLINES: Record<TeamId, string> = {
  teamA: 'Plan • Arrange • Build',
  teamB: 'Think • Sequence • Share',
};

type Board = (string | null)[];
const emptyBoard = (): Board => Array(STEPS).fill(null);
const perTeam = <T,>(make: () => T): Record<TeamId, T> => ({ teamA: make(), teamB: make() });

export const AmulFlowchartChallenge: React.FC<AmulFlowchartChallengeProps> = ({ onGoToSectorSorter, onExit }) => {
  const teamNames: Record<TeamId, string> = { teamA: INITIAL_TEAMS[0].name, teamB: INITIAL_TEAMS[1].name };

  const [roundIdx, setRoundIdx] = useState(0);
  const round = AMUL_STORY_ROUNDS[roundIdx];
  const correctIds = useMemo(
    () => [...round.events].sort((a, b) => a.order - b.order).map((e) => e.id),
    [round]
  );
  const eventsById = useMemo(() => new Map<string, StoryEvent>(round.events.map((e) => [e.id, e])), [round]);

  // Both teams build their own flowchart at the same time from one shared pool of events.
  const [pool, setPool] = useState<StoryEvent[]>(() => shuffle(AMUL_STORY_ROUNDS[0].events));
  const [boards, setBoards] = useState(() => perTeam(emptyBoard));
  const [locked, setLocked] = useState(() => perTeam<number[]>(() => []));
  const [hintsLeft, setHintsLeft] = useState(() => perTeam(() => HINTS_PER_ROUND));
  const [submitted, setSubmitted] = useState(() => perTeam(() => false));
  const [roundScore, setRoundScore] = useState(() => perTeam(() => 0));
  const [totals, setTotals] = useState(() => perTeam(() => 0));
  const [focusTeam, setFocusTeam] = useState<TeamId>('teamA');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emptyFlash, setEmptyFlash] = useState<TeamId | null>(null);
  const [message, setMessage] = useState<{ tone: 'good' | 'bad' | 'info'; text: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [matchOver, setMatchOver] = useState(false);

  const roundDone = submitted.teamA && submitted.teamB;
  const isLastRound = roundIdx + 1 >= AMUL_STORY_ROUNDS.length;

  const scoreTeam = (team: TeamId) => {
    const score = boards[team].filter((id, i) => id === correctIds[i]).length;
    setSubmitted((prev) => ({ ...prev, [team]: true }));
    setRoundScore((prev) => ({ ...prev, [team]: score }));
    setTotals((prev) => ({ ...prev, [team]: prev[team] + score }));
    return score;
  };

  const [timeLeft, setTimeLeft] = useCountdown(ROUND_SECONDS, !paused && !roundDone && !matchOver, () => {
    sound.playBuzzer();
    setMessage({ tone: 'info', text: 'Time’s up! Both flowcharts were checked as they are.' });
    TEAMS.forEach((team) => {
      if (!submitted[team]) scoreTeam(team);
    });
  });

  useEffect(() => {
    if (!roundDone) return;
    const t = setTimeout(() => {
      setShowRoundResult(true);
      sound.playSuccessFlourish();
      triggerConfettiBurst(2500);
    }, 1200);
    return () => clearTimeout(t);
  }, [roundDone]);

  useEffect(() => {
    if (!emptyFlash) return;
    const t = setTimeout(() => setEmptyFlash(null), 700);
    return () => clearTimeout(t);
  }, [emptyFlash]);

  const blockedByPause = () => {
    if (!paused) return false;
    setMessage({ tone: 'info', text: 'The timer is paused. Tap the timer to resume the game.' });
    return true;
  };

  const placeEvent = (team: TeamId, index: number, eventId: string) => {
    if (submitted[team] || matchOver || blockedByPause() || !eventsById.has(eventId)) return;
    const board = [...boards[team]];
    const from = board.indexOf(eventId);
    if (from === index || locked[team].includes(index) || (from !== -1 && locked[team].includes(from))) return;
    // Moving within the board swaps the two steps; a card from the pool replaces whatever was there.
    if (from !== -1) board[from] = board[index];
    board[index] = eventId;
    setBoards((prev) => ({ ...prev, [team]: board }));
    setFocusTeam(team);
    setSelectedId(null);
    setMessage(null);
    sound.playProductMove();
  };

  const removeEvent = (team: TeamId, index: number) => {
    if (submitted[team] || locked[team].includes(index)) return;
    sound.playClick();
    setBoards((prev) => ({ ...prev, [team]: prev[team].map((id, i) => (i === index ? null : id)) }));
    setFocusTeam(team);
  };

  const clearBoard = (team: TeamId) => {
    if (submitted[team]) return;
    sound.playClick();
    setBoards((prev) => ({
      ...prev,
      [team]: prev[team].map((id, i) => (locked[team].includes(i) ? id : null)),
    }));
  };

  const applyHint = (team: TeamId) => {
    if (submitted[team] || hintsLeft[team] === 0 || blockedByPause()) return;
    setFocusTeam(team);
    const board = [...boards[team]];
    const index = board.findIndex((id, i) => id !== correctIds[i]);
    if (index === -1) {
      setMessage({ tone: 'good', text: `${teamNames[team]}, your flowchart looks ready. Submit your order!` });
      return;
    }
    const correctId = correctIds[index];
    const from = board.indexOf(correctId);
    if (from !== -1) board[from] = board[index];
    board[index] = correctId;
    setBoards((prev) => ({ ...prev, [team]: board }));
    setLocked((prev) => ({ ...prev, [team]: [...prev[team], index] }));
    setHintsLeft((prev) => ({ ...prev, [team]: prev[team] - 1 }));
    setMessage({ tone: 'info', text: `Hint for ${teamNames[team]}: step ${index + 1}. ${eventsById.get(correctId)!.hint}` });
    sound.playConnectionMade();
  };

  const submitOrder = (team: TeamId) => {
    if (submitted[team] || blockedByPause()) return;
    setFocusTeam(team);
    if (boards[team].some((id) => id === null)) {
      setEmptyFlash(team);
      sound.playBuzzer();
      setMessage({ tone: 'bad', text: `${teamNames[team]}, fill all ${STEPS} steps before you submit.` });
      return;
    }
    const score = scoreTeam(team);
    if (score === STEPS) {
      sound.playChallengeComplete();
      triggerConfettiBurst(1500);
      setMessage({ tone: 'good', text: `Perfect order, ${teamNames[team]}! All ${STEPS} steps are correct.` });
    } else {
      sound.playTurnSwitch();
      setMessage({
        tone: 'info',
        text: `${teamNames[team]} placed ${score} of ${STEPS} steps correctly. Red steps are in the wrong place.`,
      });
    }
  };

  const startRound = (index: number) => {
    setPool(shuffle(AMUL_STORY_ROUNDS[index].events));
    setBoards(perTeam(emptyBoard));
    setLocked(perTeam<number[]>(() => []));
    setHintsLeft(perTeam(() => HINTS_PER_ROUND));
    setSubmitted(perTeam(() => false));
    setRoundScore(perTeam(() => 0));
    setSelectedId(null);
    setEmptyFlash(null);
    setMessage(null);
    setPaused(false);
    setTimeLeft(ROUND_SECONDS);
  };

  const goToNextRound = () => {
    sound.playClick();
    setShowRoundResult(false);
    if (isLastRound) {
      setMatchOver(true);
      triggerConfettiBurst(3000);
      return;
    }
    setRoundIdx(roundIdx + 1);
    startRound(roundIdx + 1);
  };

  const restartMatch = () => {
    sound.playClick();
    setRoundIdx(0);
    startRound(0);
    setTotals(perTeam(() => 0));
    setFocusTeam('teamA');
    setShowRoundResult(false);
    setMatchOver(false);
  };

  const leader = (scores: Record<TeamId, number>): TeamId | null =>
    scores.teamA > scores.teamB ? 'teamA' : scores.teamB > scores.teamA ? 'teamB' : null;

  const renderTeamColumn = (team: TeamId) => {
    const done = submitted[team];
    return (
      <aside className="flex flex-col gap-2 xl:gap-3 min-h-0">
        <TeamPanel
          team={team}
          name={teamNames[team]}
          tagline={TAGLINES[team]}
          score={roundScore[team]}
          total={STEPS}
          scoreLabel="Correct order"
          statusChip={done ? 'Submitted' : undefined}
        />
        <div className={`${PANEL} flex-1 flex flex-col p-2.5 xl:p-3 min-h-0`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h2 className={`font-black uppercase text-sm xl:text-lg ${TEAM_STYLE[team].heading}`}>Your flowchart</h2>
            <span className="text-[11px] xl:text-xs font-bold text-slate-500">Match total: {totals[team]}</span>
          </div>

          <div className="flex flex-col">
            {boards[team].map((id, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <ArrowDown
                    className={`w-4 h-4 mx-auto my-px ${team === 'teamA' ? 'text-blue-500' : 'text-orange-500'}`}
                    strokeWidth={3}
                  />
                )}
                <FlowchartStepSlot
                  index={i}
                  team={team}
                  event={id ? eventsById.get(id) ?? null : null}
                  result={done ? (id === correctIds[i] ? 'correct' : 'wrong') : null}
                  locked={locked[team].includes(i)}
                  highlightEmpty={emptyFlash === team}
                  canTapPlace={selectedId !== null}
                  disabled={done || matchOver}
                  onDropEvent={(eventId, index) => placeEvent(team, index, eventId)}
                  onTap={(index) => selectedId && placeEvent(team, index, selectedId)}
                  onRemove={(index) => removeEvent(team, index)}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="mt-auto pt-2 xl:pt-3 space-y-2">
            <button
              type="button"
              onClick={() => applyHint(team)}
              disabled={done || hintsLeft[team] === 0}
              className="inline-flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full bg-amber-50 border-2 border-amber-200 text-slate-800 font-black text-sm uppercase hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Lightbulb className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
              Hint
              <span className="px-2 py-0.5 rounded-full bg-amber-300/80 text-[11px] text-slate-800">
                {hintsLeft[team]} left
              </span>
            </button>
            <button
              type="button"
              onClick={() => submitOrder(team)}
              disabled={done || matchOver}
              className={`w-full py-2.5 xl:py-3 rounded-full font-black uppercase text-white text-sm xl:text-lg tracking-wide shadow-lg bg-gradient-to-b ${
                team === 'teamA' ? 'from-sky-400 to-blue-600 shadow-blue-500/30' : 'from-amber-400 to-orange-600 shadow-orange-500/30'
              } hover:brightness-105 active:scale-[0.98] disabled:opacity-75 disabled:cursor-default transition-all`}
            >
              {done ? `Submitted · ${roundScore[team]} / ${STEPS}` : 'Submit order'}
            </button>
          </div>
        </div>
      </aside>
    );
  };

  const focusBoard = boards[focusTeam];
  const focusDone = submitted[focusTeam];
  const roundLeader = leader(roundScore);
  const matchLeader = leader(totals);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <SceneryBackdrop variant="dairy" />

      <div className="relative z-10 h-full overflow-y-auto scrollable-panel">
        <div className="min-h-full flex flex-col gap-2 xl:gap-3 p-2 xl:p-4">
          <ActivityTopBar
            activityNumber={2}
            title="Amul Story"
            titleAccent="Sequence"
            subtitle="Arrange the events in the correct order to show how Amul became a success."
            timeLeft={timeLeft}
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            round={roundIdx + 1}
            totalRounds={AMUL_STORY_ROUNDS.length}
            signLines={['From Farmers', 'To A Strong Cooperative', 'A Successful Journey']}
            onExit={onExit}
          />

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(250px,24%)_minmax(0,1fr)_minmax(250px,24%)] gap-2 xl:gap-3">
            {renderTeamColumn('teamA')}

            <section className="flex flex-col gap-2 xl:gap-3 min-h-0">
              {/* Story banner */}
              <div className={`${PANEL} overflow-hidden shrink-0`}>
                <div className="flex flex-wrap items-center gap-2 xl:gap-3 px-3 xl:px-4 pt-2 xl:pt-3 pb-2">
                  <Milk className="w-7 h-7 xl:w-9 xl:h-9 text-[#1B3A8C] shrink-0" strokeWidth={2.2} />
                  <div className="flex-1 min-w-[200px]">
                    <h2 className="font-black uppercase leading-none text-xl xl:text-[30px]">
                      <span className="text-[#1B3A8C]">{round.title}</span>{' '}
                      <span className="text-[#F26B1D]">{round.titleAccent}</span>
                    </h2>
                    <p className="text-xs xl:text-sm text-slate-600 font-semibold mt-1">{round.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 max-w-[340px]">
                    <BookOpen className="w-6 h-6 text-blue-600 shrink-0" strokeWidth={2.2} />
                    <p className="text-[11px] xl:text-xs text-slate-700 leading-snug">
                      Drag the cards below into your team’s flowchart, in the right order, to complete the story.
                    </p>
                  </div>
                </div>
                <div className="h-16 sm:h-20 xl:h-28 2xl:h-36">
                  <img src={round.bannerImage} alt="" draggable={false} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Shared event pool */}
              <div className={`${PANEL} flex-1 min-h-0 p-2.5 xl:p-3 flex flex-col`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Shuffle className="w-5 h-5 xl:w-6 xl:h-6 text-blue-600" strokeWidth={2.5} />
                  <h2 className="font-black uppercase text-sm xl:text-base text-[#1B3A8C]">Drag these events</h2>
                  {message && (
                    <p
                      key={message.text}
                      role="status"
                      className={`flex-1 min-w-[220px] px-3 py-1 rounded-xl text-xs xl:text-sm font-semibold leading-snug line-clamp-2 animate-fadeIn ${
                        message.tone === 'good'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : message.tone === 'bad'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {message.text}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 xl:gap-3 content-start">
                  {pool.map((ev) => {
                    const selected = selectedId === ev.id;
                    const toggleSelect = () => {
                      sound.playClick();
                      setSelectedId(selected ? null : ev.id);
                    };
                    return (
                      <div
                        key={ev.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selected}
                        draggable={!matchOver}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', ev.id);
                          e.dataTransfer.effectAllowed = 'copyMove';
                          setSelectedId(ev.id);
                        }}
                        onDragEnd={() => setSelectedId(null)}
                        onClick={toggleSelect}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSelect();
                          }
                        }}
                        className={`relative rounded-2xl bg-white border-2 pl-5 pr-1.5 pt-1.5 pb-1 text-center transition-all cursor-grab active:cursor-grabbing ${
                          selected
                            ? 'border-transparent ring-4 ring-amber-300 -translate-y-1 shadow-lg'
                            : 'border-slate-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md'
                        }`}
                      >
                        <GripVertical
                          className="absolute left-0.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300"
                          strokeWidth={3}
                        />
                        <div className="h-16 sm:h-20 xl:h-24 2xl:h-28 rounded-xl overflow-hidden bg-slate-100 pointer-events-none">
                          <CardArt imageUrl={ev.imageUrl} illustrationKey={ev.illustrationKey} alt={ev.text} />
                        </div>
                        <p className="mt-1 text-[11px] xl:text-[13px] font-semibold text-slate-700 leading-tight line-clamp-3 min-h-[2.5em]">
                          {ev.text}
                        </p>
                        {/* Which teams have already used this event */}
                        <div className="absolute top-2.5 right-2.5 flex gap-1">
                          {TEAMS.filter((t) => boards[t].includes(ev.id)).map((t) => (
                            <span
                              key={t}
                              title={`In ${teamNames[t]}’s flowchart`}
                              className={`w-5 h-5 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center shadow ${TEAM_STYLE[t].solid}`}
                            >
                              {TEAM_STYLE[t].initial}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order checker */}
              <div className={`${PANEL} shrink-0 p-2.5 xl:p-3`}>
                <div className="flex flex-wrap items-center gap-2 xl:gap-3">
                  <ListChecks className="w-5 h-5 xl:w-6 xl:h-6 text-blue-600" strokeWidth={2.5} />
                  <h2 className="font-black uppercase text-sm xl:text-base text-[#1B3A8C]">Check your order</h2>
                  <div className="ml-auto flex rounded-full bg-slate-100 p-0.5" role="tablist" aria-label="Team to check">
                    {TEAMS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={focusTeam === t}
                        onClick={() => setFocusTeam(t)}
                        className={`px-3 py-1 rounded-full text-[11px] xl:text-xs font-black transition-colors ${
                          focusTeam === t ? `${TEAM_STYLE[t].solid} text-white shadow` : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {teamNames[t]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3 mt-2">
                  <div className="flex-1 flex items-center justify-between gap-1">
                    {focusBoard.map((id, i) => {
                      const ok = id === correctIds[i];
                      return (
                        <React.Fragment key={i}>
                          {i > 0 && <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={3} />}
                          <span
                            className={`w-9 h-9 xl:w-12 xl:h-12 shrink-0 rounded-full border-4 flex items-center justify-center font-black text-sm xl:text-lg transition-colors ${
                              focusDone
                                ? ok
                                  ? 'bg-emerald-500 border-emerald-200 text-white'
                                  : 'bg-red-500 border-red-200 text-white'
                                : id
                                ? `${TEAM_STYLE[focusTeam].solid} border-white text-white shadow`
                                : 'bg-sky-50 border-sky-100 text-sky-300'
                            }`}
                          >
                            {focusDone ? (
                              ok ? (
                                <Check className="w-5 h-5" strokeWidth={3} />
                              ) : (
                                <X className="w-5 h-5" strokeWidth={3} />
                              )
                            ) : (
                              i + 1
                            )}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => clearBoard(focusTeam)}
                    disabled={focusDone || focusBoard.every((id) => id === null)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs xl:text-sm uppercase hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" strokeWidth={3} />
                    Clear all
                  </button>
                </div>
              </div>
            </section>

            {renderTeamColumn('teamB')}
          </div>
        </div>
      </div>

      {showRoundResult && (
        <ResultModal>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Round {roundIdx + 1} of {AMUL_STORY_ROUNDS.length} complete
          </p>
          <h2 className="text-2xl xl:text-3xl font-black text-[#1B3A8C] mt-1">
            {roundLeader ? `${teamNames[roundLeader]} takes this round!` : 'This round is a tie!'}
          </h2>

          <div className="grid grid-cols-2 gap-3 my-4">
            {TEAMS.map((t) => (
              <div
                key={t}
                className={`rounded-2xl p-3 bg-gradient-to-br ${TEAM_STYLE[t].gradient} text-white ${
                  roundLeader === t ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                <KidAvatar kind={TEAM_STYLE[t].avatar} className="w-14 h-14 mx-auto" />
                <div className="font-black uppercase text-sm">{teamNames[t]}</div>
                <div className="text-3xl font-black tabular-nums">
                  {roundScore[t]} / {STEPS}
                </div>
                <div className="text-[11px] font-bold uppercase opacity-90">Correct order</div>
              </div>
            ))}
          </div>

          <div className="text-left rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-5">
            <p className="font-black text-sm text-slate-700 mb-2">The correct order</p>
            <ol className="space-y-1.5">
              {correctIds.map((id, i) => (
                <li key={id} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{eventsById.get(id)!.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            onClick={goToNextRound}
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-105 text-white font-black text-sm shadow-lg inline-flex items-center justify-center gap-2 transition-all"
          >
            {isLastRound ? 'See final results' : 'Next round'}
            <ArrowRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </ResultModal>
      )}

      {matchOver && (
        <ResultModal>
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center mb-3 animate-floaty">
            <Trophy className="w-10 h-10 text-amber-500" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">All stories sequenced!</p>
          <h2 className="text-2xl xl:text-3xl font-black text-[#1B3A8C] mt-1">
            {matchLeader ? `${teamNames[matchLeader]} wins!` : 'It’s a tie. Well played, both teams!'}
          </h2>
          <p className="text-sm text-slate-600 mt-2 mb-5 max-w-md mx-auto">
            When farmers work together in a cooperative, every sector joins in: farmers produce milk, factories
            process it, and transport and shops bring it to families. The money flows back to the farmers.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {TEAMS.map((t) => (
              <div
                key={t}
                className={`rounded-2xl p-3 bg-gradient-to-br ${TEAM_STYLE[t].gradient} text-white ${
                  matchLeader === t ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                <KidAvatar kind={TEAM_STYLE[t].avatar} className="w-16 h-16 mx-auto" />
                <div className="font-black uppercase text-sm mt-1">{teamNames[t]}</div>
                <div className="text-3xl font-black tabular-nums">
                  {totals[t]} / {STEPS * AMUL_STORY_ROUNDS.length}
                </div>
                <div className="text-[11px] font-bold uppercase opacity-90">Steps in order</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={restartMatch}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={3} />
              Play again
            </button>
            {onGoToSectorSorter && (
              <button
                type="button"
                onClick={onGoToSectorSorter}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 hover:brightness-105 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                Back to Sector Sort
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            )}
          </div>
        </ResultModal>
      )}
    </div>
  );
};
