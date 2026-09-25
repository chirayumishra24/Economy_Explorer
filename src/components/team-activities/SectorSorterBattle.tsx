import React, { useState } from 'react';
import { Sector, SectorCard, TeamProfile } from '../../types/economy';
import { SECTOR_CARDS, INITIAL_TEAMS } from '../../data/teamActivitiesData';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';
import { TeamScoreHeader } from './TeamScoreHeader';
import { SectorDropColumn } from './SectorDropColumn';
import { sound } from '../../utils/audio';
import { triggerConfettiBurst } from '../../utils/confetti';

interface PlacedCardRecord {
  card: SectorCard;
  teamId: 'teamA' | 'teamB';
  teamAvatar: string;
}

interface SectorSorterBattleProps {
  onGoToAmulFlowchart?: () => void;
  onExit?: () => void;
}

export const SectorSorterBattle: React.FC<SectorSorterBattleProps> = ({
  onGoToAmulFlowchart,
  onExit,
}) => {
  const [teams] = useState<TeamProfile[]>(INITIAL_TEAMS);
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [streaks, setStreaks] = useState({ teamA: 0, teamB: 0 });
  const [activeTeamId, setActiveTeamId] = useState<'teamA' | 'teamB'>('teamA');

  // Deck of cards to classify (shuffled on load)
  const [deck, setDeck] = useState<SectorCard[]>(() => {
    return [...SECTOR_CARDS].sort(() => Math.random() - 0.5);
  });

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [selectedForTap, setSelectedForTap] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Placed cards per column
  const [placedBySector, setPlacedBySector] = useState<Record<Sector, PlacedCardRecord[]>>({
    primary: [],
    secondary: [],
    tertiary: [],
  });

  // Game feedback banner
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'steal';
    message: string;
    points?: number;
  } | null>(null);

  const [isGameOver, setIsGameOver] = useState(false);

  const currentCard = deck[currentCardIndex] || null;
  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const otherTeam = teams.find((t) => t.id !== activeTeamId) || teams[1];

  // Drag start handler
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', currentCard?.id || '');
    e.dataTransfer.effectAllowed = 'move';
    setSelectedForTap(true);
  };

  // Card classification validation logic
  const handleClassify = (targetSector: Sector) => {
    if (!currentCard || isGameOver) return;

    const isCorrect = currentCard.sector === targetSector;

    if (isCorrect) {
      // Correct Placement!
      sound.playChallengeComplete();
      sound.playProductMove();

      const currentStreak = streaks[activeTeamId] + 1;
      const streakBonus = currentStreak >= 2 ? 5 : 0;
      const pointsEarned = 10 + streakBonus;

      // Confetti burst for streaks or big wins
      if (currentStreak >= 3) {
        triggerConfettiBurst(1800);
      }

      setScores((prev) => ({
        ...prev,
        [activeTeamId]: prev[activeTeamId] + pointsEarned,
      }));

      setStreaks((prev) => ({
        ...prev,
        [activeTeamId]: currentStreak,
      }));

      // Add to placed cards
      setPlacedBySector((prev) => ({
        ...prev,
        [targetSector]: [
          ...prev[targetSector],
          { card: currentCard, teamId: activeTeamId, teamAvatar: activeTeam.avatar },
        ],
      }));

      setFeedback({
        type: 'success',
        message: `🎉 Spot on, ${activeTeam.name}! "${currentCard.title}" is in the ${targetSector.toUpperCase()} Sector.`,
        points: pointsEarned,
      });

      setSelectedForTap(false);
      setShowHint(false);

      // Check if this was the last card
      if (currentCardIndex + 1 >= deck.length) {
        setIsGameOver(true);
        triggerConfettiBurst(3500);
        sound.playSuccessFlourish();
      } else {
        // Next card and pass turn to other team
        setCurrentCardIndex((prev) => prev + 1);
        setTimeout(() => {
          setActiveTeamId((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
          sound.playTurnSwitch();
        }, 1200);
      }
    } else {
      // Incorrect Placement!
      sound.playBuzzer();

      setStreaks((prev) => ({
        ...prev,
        [activeTeamId]: 0,
      }));

      setFeedback({
        type: 'error',
        message: `💡 Not quite, ${activeTeam.name}! Clue: ${currentCard.hint} Can ${otherTeam.name} steal this turn?`,
      });

      setSelectedForTap(false);

      // Pass turn to opposing team for a steal!
      setTimeout(() => {
        setActiveTeamId((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
        sound.playTurnSwitch();
      }, 1800);
    }
  };

  const handleResetGame = () => {
    sound.playClick();
    setDeck([...SECTOR_CARDS].sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    setScores({ teamA: 0, teamB: 0 });
    setStreaks({ teamA: 0, teamB: 0 });
    setActiveTeamId('teamA');
    setPlacedBySector({ primary: [], secondary: [], tertiary: [] });
    setFeedback(null);
    setIsGameOver(false);
    setSelectedForTap(false);
    setShowHint(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-background overflow-hidden select-none">
      {/* 2-Team Score & Status Header */}
      <TeamScoreHeader
        teams={teams}
        scores={scores}
        streaks={streaks}
        activeTeamId={activeTeamId}
        title="Sector Showdown: 3-Column Sorting Battle"
        subtitle="Each team classifies one card at a time into Primary, Secondary, or Tertiary!"
        roundInfo={`Card ${Math.min(currentCardIndex + 1, deck.length)} / ${deck.length}`}
        onResetGame={handleResetGame}
        onExit={onExit}
      />

      {/* Main Play Area */}
      <div className="flex-1 w-full p-2.5 sm:p-4 flex flex-col gap-3 overflow-hidden">
        {/* Dynamic Turn & Feedback Alert */}
        <div className="w-full flex items-center justify-between gap-3">
          <div
            className={`flex-1 px-4 py-2 rounded-btn border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              feedback?.type === 'success'
                ? 'bg-statusSuccess/15 border-statusSuccess/40 text-statusSuccess'
                : feedback?.type === 'error'
                ? 'bg-statusDisrupted/15 border-statusDisrupted/40 text-statusDisrupted'
                : activeTeamId === 'teamA'
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <span className="text-base sm:text-lg">
              {feedback?.type === 'success' ? '🌟' : feedback?.type === 'error' ? '⚡' : activeTeam.avatar}
            </span>
            <span className="flex-1 truncate">
              {feedback
                ? feedback.message
                : `👉 ${activeTeam.name}'s Turn: Drag the card below to its correct economic sector!`}
            </span>
            {feedback?.points && (
              <span className="bg-statusSuccess text-white text-xs font-black px-2 py-0.5 rounded-full animate-bounce">
                +{feedback.points} PTS!
              </span>
            )}
          </div>

          {/* Quick Help / Hint Toggle */}
          {currentCard && !isGameOver && (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="px-3 py-2 rounded-btn bg-surface hover:bg-border/60 border border-border text-xs font-bold text-textMuted flex items-center gap-1.5 transition-colors shrink-0"
              title="Show educational hint"
            >
              <span>💡</span>
              <span className="hidden sm:inline">{showHint ? 'Hide Hint' : 'Need Clue?'}</span>
            </button>
          )}
        </div>

        {/* Hint Dropdown */}
        {showHint && currentCard && (
          <div className="w-full bg-accentYellow/15 border border-accentYellow/60 rounded-btn p-2.5 text-xs text-textMain animate-fadeIn flex items-start gap-2 shadow-sm">
            <span className="text-base">🔎</span>
            <div>
              <strong className="font-bold">Teacher Clue: </strong>
              <span>{currentCard.hint}</span>
            </div>
          </div>
        )}

        {/* Top Active Card Dock */}
        {!isGameOver && currentCard ? (
          <div className="w-full bg-surface border-2 border-border/80 rounded-card p-3 shadow-lift flex flex-col md:flex-row items-center gap-3 sm:gap-4 shrink-0 transition-all">
            {/* Active Card Scene Thumbnail & Drag Handle */}
            <div
              draggable
              onDragStart={handleDragStart}
              onClick={() => {
                sound.playClick();
                setSelectedForTap(!selectedForTap);
              }}
              className={`w-40 sm:w-52 h-28 sm:h-32 shrink-0 rounded-card overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all relative group ${
                selectedForTap
                  ? 'border-accentYellow ring-4 ring-accentYellow/40 scale-105 shadow-lift'
                  : 'border-border hover:border-textMain/50 shadow-soft'
              }`}
            >
              <ActivitySceneRenderer illustrationKey={currentCard.illustrationKey} />
              
              {/* Drag overlay chip */}
              <div className="absolute bottom-1 right-1 bg-textMain/80 text-surface text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none flex items-center gap-1">
                <span>✋</span>
                <span>Drag Me</span>
              </div>

              {selectedForTap && (
                <div className="absolute top-1 left-1 bg-accentYellow text-textMain text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  Card Selected!
                </div>
              )}
            </div>

            {/* What is happening in this image? Description & Action Banner */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-wider uppercase bg-accentYellow/20 text-textMain px-2 py-0.5 rounded-full border border-accentYellow/40">
                  Scenario {currentCardIndex + 1} of {deck.length}
                </span>
                <span className="text-xs font-bold text-textMuted">• {currentCard.actor}</span>
              </div>

              <h3 className="text-base sm:text-xl font-black text-textMain tracking-tight mb-1">
                {currentCard.title}
              </h3>

              <div className="bg-background/90 rounded-btn p-2 border border-border/60 text-xs sm:text-sm text-textMain font-medium leading-relaxed mb-2">
                <strong className="text-blue-700 font-bold">What is happening here? </strong>
                {currentCard.description}
              </div>

              {/* Tap to Classify Quick Buttons (Ideal for Smartboards / Touch) */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-textMuted hidden sm:inline">Tap to choose:</span>
                <button
                  onClick={() => handleClassify('primary')}
                  className="px-3 py-1.5 rounded-btn bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>🌾</span>
                  <span>Primary</span>
                </button>
                <button
                  onClick={() => handleClassify('secondary')}
                  className="px-3 py-1.5 rounded-btn bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>🏭</span>
                  <span>Secondary</span>
                </button>
                <button
                  onClick={() => handleClassify('tertiary')}
                  className="px-3 py-1.5 rounded-btn bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>🚚</span>
                  <span>Tertiary</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 3 Sector Drop Columns */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden">
          {/* 1. Primary Sector */}
          <SectorDropColumn
            sector="primary"
            title="Primary Sector"
            subtitle="Extracted directly from Nature"
            definition="Farming, Milking, Forestry, Fishing, Gathering"
            icon="🌾"
            colorTheme={{
              bg: 'bg-emerald-50/50',
              border: 'border-emerald-300',
              headerBg: 'bg-emerald-100/70',
              textColor: 'text-emerald-900',
              accentGlow: 'ring-emerald-400',
              badgeBg: 'bg-emerald-200/80 text-emerald-900 border-emerald-400',
            }}
            placedCards={placedBySector.primary}
            isCardSelected={selectedForTap}
            onDropCard={handleClassify}
            onTapPlace={handleClassify}
          />

          {/* 2. Secondary Sector */}
          <SectorDropColumn
            sector="secondary"
            title="Secondary Sector"
            subtitle="Processing & Manufacturing"
            definition="Transforming raw materials in Mills, Factories, Workshops"
            icon="🏭"
            colorTheme={{
              bg: 'bg-amber-50/50',
              border: 'border-amber-300',
              headerBg: 'bg-amber-100/70',
              textColor: 'text-amber-900',
              accentGlow: 'ring-amber-400',
              badgeBg: 'bg-amber-200/80 text-amber-900 border-amber-400',
            }}
            placedCards={placedBySector.secondary}
            isCardSelected={selectedForTap}
            onDropCard={handleClassify}
            onTapPlace={handleClassify}
          />

          {/* 3. Tertiary Sector */}
          <SectorDropColumn
            sector="tertiary"
            title="Tertiary Sector"
            subtitle="Services, Transport & Support"
            definition="Transport, Banking, Retail Shops, Health, Teaching"
            icon="🚚"
            colorTheme={{
              bg: 'bg-sky-50/50',
              border: 'border-sky-300',
              headerBg: 'bg-sky-100/70',
              textColor: 'text-sky-900',
              accentGlow: 'ring-sky-400',
              badgeBg: 'bg-sky-200/80 text-sky-900 border-sky-400',
            }}
            placedCards={placedBySector.tertiary}
            isCardSelected={selectedForTap}
            onDropCard={handleClassify}
            onTapPlace={handleClassify}
          />
        </div>
      </div>

      {/* Game Over Victory Modal */}
      {isGameOver && (
        <div className="fixed inset-0 bg-textMain/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border-2 border-border rounded-card p-6 shadow-lift text-center relative overflow-hidden animate-scaleUp">
            {/* Top Trophy Banner */}
            <div className="w-20 h-20 rounded-full bg-accentYellow/20 border-2 border-accentYellow mx-auto flex items-center justify-center text-4xl mb-3 shadow-md animate-bounce">
              🏆
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-textMuted">
              Match Completed!
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-textMain mt-1 mb-2">
              {scores.teamA > scores.teamB
                ? `🎉 ${teams[0].name} Wins the Battle!`
                : scores.teamB > scores.teamA
                ? `🎉 ${teams[1].name} Wins the Battle!`
                : '🤝 It\'s a Glorious Tie!'}
            </h2>

            <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto mb-5">
              Fantastic work, young economists! All 12 real-world economic activities have been accurately
              categorized across Primary, Secondary, and Tertiary sectors.
            </p>

            {/* Scoreboard Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className={`p-3 rounded-card border-2 text-center ${
                  scores.teamA >= scores.teamB
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-background border-border'
                }`}
              >
                <div className="text-2xl mb-1">{teams[0].avatar}</div>
                <div className="text-xs font-bold text-blue-700">{teams[0].name}</div>
                <div className="text-2xl font-black text-textMain mt-1">{scores.teamA} pts</div>
              </div>

              <div
                className={`p-3 rounded-card border-2 text-center ${
                  scores.teamB >= scores.teamA
                    ? 'bg-amber-50 border-amber-500 shadow-md'
                    : 'bg-background border-border'
                }`}
              >
                <div className="text-2xl mb-1">{teams[1].avatar}</div>
                <div className="text-xs font-bold text-amber-700">{teams[1].name}</div>
                <div className="text-2xl font-black text-textMain mt-1">{scores.teamB} pts</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetGame}
                className="w-full sm:w-auto px-6 py-2.5 rounded-btn border-2 border-border bg-surface hover:bg-background text-textMain font-bold text-sm transition-all"
              >
                🔄 Play Rematch
              </button>

              {onGoToAmulFlowchart && (
                <button
                  onClick={onGoToAmulFlowchart}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-black text-sm shadow-lift transition-all flex items-center justify-center gap-2 group"
                >
                  <span>🥛 Play Amul Flowchart Challenge</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
