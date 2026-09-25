import React, { useState } from 'react';
import { AmulStageCard, TeamProfile } from '../../types/economy';
import { AMUL_FLOWCHART_STAGES, INITIAL_TEAMS } from '../../data/teamActivitiesData';
import { FlowchartStepSlot } from './FlowchartStepSlot';
import { MilkPipelineConnector } from './MilkPipelineConnector';
import { TeamScoreHeader } from './TeamScoreHeader';
import { ActivitySceneRenderer } from '../illustrations/ActivityScenes';
import { sound } from '../../utils/audio';
import { triggerConfettiBurst } from '../../utils/confetti';

interface AmulFlowchartChallengeProps {
  onGoToSectorSorter?: () => void;
  onExit?: () => void;
}

export const AmulFlowchartChallenge: React.FC<AmulFlowchartChallengeProps> = ({
  onGoToSectorSorter,
  onExit,
}) => {
  const [teams] = useState<TeamProfile[]>(INITIAL_TEAMS);
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [streaks, setStreaks] = useState({ teamA: 0, teamB: 0 });
  const [activeTeamId, setActiveTeamId] = useState<'teamA' | 'teamB'>('teamA');

  // 6 Flowchart Slots (Index 0 = Step 1, Index 5 = Step 6)
  const [placedSlots, setPlacedSlots] = useState<(AmulStageCard | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Scrambled unplaced cards in the dock
  const [dockCards, setDockCards] = useState<AmulStageCard[]>(() => {
    return [...AMUL_FLOWCHART_STAGES].sort(() => Math.random() - 0.5);
  });

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Simulation & Flow State
  const [isSimulating, setIsSimulating] = useState(false);
  const [flowStep, setFlowStep] = useState<number>(-1);
  const [errorSlotIndex, setErrorSlotIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleteSuccess, setIsCompleteSuccess] = useState(false);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const otherTeam = teams.find((t) => t.id !== activeTeamId) || teams[1];

  // Drag start from dock
  const handleDragStart = (e: React.DragEvent, card: AmulStageCard) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    setSelectedCardId(card.id);
  };

  // Place card into slot
  const handleDropIntoSlot = (slotNumber: number) => {
    if (!selectedCardId) return;
    const cardToPlace =
      dockCards.find((c) => c.id === selectedCardId) ||
      placedSlots.find((c) => c?.id === selectedCardId);

    if (!cardToPlace) return;

    sound.playProductMove();
    const slotIdx = slotNumber - 1;

    // If slot already had a card, return old card to dock
    const existingInSlot = placedSlots[slotIdx];

    const updatedSlots = [...placedSlots];
    // Remove from previous slot if moved from slot to slot
    const prevSlotIdx = placedSlots.findIndex((c) => c?.id === cardToPlace.id);
    if (prevSlotIdx !== -1) {
      updatedSlots[prevSlotIdx] = null;
    }
    updatedSlots[slotIdx] = cardToPlace;
    setPlacedSlots(updatedSlots);

    // Update dock
    let updatedDock = dockCards.filter((c) => c.id !== cardToPlace.id);
    if (existingInSlot && existingInSlot.id !== cardToPlace.id) {
      updatedDock = [...updatedDock, existingInSlot];
    }
    setDockCards(updatedDock);

    setSelectedCardId(null);
    setErrorSlotIndex(null);
    setErrorMessage(null);
  };

  // Remove card from slot
  const handleRemoveFromSlot = (slotNumber: number) => {
    sound.playClick();
    const slotIdx = slotNumber - 1;
    const card = placedSlots[slotIdx];
    if (!card) return;

    const updatedSlots = [...placedSlots];
    updatedSlots[slotIdx] = null;
    setPlacedSlots(updatedSlots);

    setDockCards((prev) => [...prev, card]);
    setErrorSlotIndex(null);
    setErrorMessage(null);
  };

  // Run Flow Simulation
  const handleRunSimulation = () => {
    // Check if all 6 slots are filled
    const emptySlotIdx = placedSlots.findIndex((s) => s === null);
    if (emptySlotIdx !== -1) {
      sound.playBuzzer();
      setErrorSlotIndex(emptySlotIdx);
      setErrorMessage(`⚠️ Step ${emptySlotIdx + 1} is empty! Please place all 6 stages of the Amul milk chain.`);
      return;
    }

    sound.playMachineStart();
    setIsSimulating(true);
    setErrorSlotIndex(null);
    setErrorMessage(null);

    // Animate step by step
    let current = 0;
    const interval = setInterval(() => {
      if (current < 6) {
        setFlowStep(current);
        const expectedStepNumber = current + 1;
        const placedCard = placedSlots[current];

        if (placedCard && placedCard.stepNumber === expectedStepNumber) {
          // Step is correct, move milk fluid forward
          sound.playWhoosh();
          current++;
        } else {
          // Flow stopped due to misplacement!
          clearInterval(interval);
          setIsSimulating(false);
          setErrorSlotIndex(current);
          sound.playBuzzer();

          const wrongCard = placedSlots[current];
          setStreaks((prev) => ({ ...prev, [activeTeamId]: 0 }));
          setErrorMessage(
            `⚠️ Pipeline Blocked at Step ${current + 1}! ` +
              (wrongCard ? wrongCard.wrongOrderClue : 'Missing stage.')
          );
        }
      } else {
        // Complete Success!
        clearInterval(interval);
        setIsSimulating(false);
        setIsCompleteSuccess(true);
        triggerConfettiBurst(3500);
        sound.playSuccessFlourish();

        // Award 30 points to the active team & increment streak
        setScores((prev) => ({
          ...prev,
          [activeTeamId]: prev[activeTeamId] + 30,
        }));
        setStreaks((prev) => ({
          ...prev,
          [activeTeamId]: prev[activeTeamId] + 1,
        }));
      }
    }, 700);
  };

  const handleResetChallenge = () => {
    sound.playClick();
    setPlacedSlots([null, null, null, null, null, null]);
    setDockCards([...AMUL_FLOWCHART_STAGES].sort(() => Math.random() - 0.5));
    setSelectedCardId(null);
    setIsSimulating(false);
    setFlowStep(-1);
    setErrorSlotIndex(null);
    setErrorMessage(null);
    setIsCompleteSuccess(false);
  };

  const handleSwitchTeamRound = () => {
    sound.playTurnSwitch();
    handleResetChallenge();
    setActiveTeamId((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-background overflow-hidden select-none">
      {/* 2-Team Score Header */}
      <TeamScoreHeader
        teams={teams}
        scores={scores}
        streaks={streaks}
        activeTeamId={activeTeamId}
        title="The Amul Case Study: Cooperative Flowchart Race"
        subtitle="Arrange the 6 stages of the Amul White Revolution milk journey in logical sequence!"
        roundInfo={`${activeTeam.name}'s Round`}
        onResetGame={handleResetChallenge}
        onExit={onExit}
      />

      {/* Main Play Area */}
      <div className="flex-1 w-full p-2.5 sm:p-4 flex flex-col justify-between gap-3 overflow-y-auto scrollable-panel">
        {/* Storyline & Diagnostic Banner */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div
            className={`w-full sm:flex-1 px-4 py-2 rounded-btn border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              errorMessage
                ? 'bg-statusDisrupted/15 border-statusDisrupted/40 text-statusDisrupted'
                : isCompleteSuccess
                ? 'bg-statusSuccess/15 border-statusSuccess/40 text-statusSuccess'
                : 'bg-surface border-border text-textMain'
            }`}
          >
            <span className="text-base sm:text-lg">
              {errorMessage ? '⚡' : isCompleteSuccess ? '🏆' : '🥛'}
            </span>
            <span className="flex-1">
              {errorMessage
                ? errorMessage
                : isCompleteSuccess
                ? `🎉 Perfect Sequence, ${activeTeam.name}! Milk flowed seamlessly from rural dairy cows to happy children!`
                : `👉 ${activeTeam.name}: Drag cards into Steps 1 to 6, then test the milk flow!`}
            </span>
          </div>

          {/* Test Milk Flow Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`px-5 py-2.5 rounded-btn font-black text-xs sm:text-sm transition-all shadow-lift flex items-center gap-2 ${
                isSimulating
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-accentYellow hover:brightness-105 text-textMain active:scale-95'
              }`}
            >
              <span>{isSimulating ? '⏳ Simulating Flow...' : '🚀 Test & Run Milk Flow'}</span>
            </button>
          </div>
        </div>

        {/* 6-Step Flowchart Pipeline Board */}
        <div className="w-full bg-surface border-2 border-border/80 rounded-card p-3 sm:p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-textMain uppercase tracking-wider">
                Amul Economic Flowchart
              </span>
              <span className="text-xs text-textMuted hidden md:inline">
                (Primary Production ➔ Cooperative Collection ➔ Transport ➔ Processing ➔ Retail ➔ Consumer)
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {placedSlots.filter(Boolean).length} / 6 Placed
            </span>
          </div>

          {/* Horizontal Flowchart Grid with connecting pipes */}
          <div className="w-full overflow-x-auto pb-2 scrollable-panel">
            <div className="flex items-center gap-1 sm:gap-2 min-w-[1240px] py-1">
              {/* Step 1 */}
              <FlowchartStepSlot
                stepNumber={1}
                expectedTitle="Cow Care & Milking"
                expectedSector="Primary"
                placedCard={placedSlots[0]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 0}
                hasError={errorSlotIndex === 0}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />

              <MilkPipelineConnector isFlowing={flowStep >= 1} hasError={errorSlotIndex === 0} />

              {/* Step 2 */}
              <FlowchartStepSlot
                stepNumber={2}
                expectedTitle="Village Collection & Fat Testing"
                expectedSector="Collection"
                placedCard={placedSlots[1]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 1}
                hasError={errorSlotIndex === 1}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />

              <MilkPipelineConnector isFlowing={flowStep >= 2} hasError={errorSlotIndex === 1} />

              {/* Step 3 */}
              <FlowchartStepSlot
                stepNumber={3}
                expectedTitle="Cold Chain Tanker Transport"
                expectedSector="Tertiary"
                placedCard={placedSlots[2]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 2}
                hasError={errorSlotIndex === 2}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />

              <MilkPipelineConnector isFlowing={flowStep >= 3} hasError={errorSlotIndex === 2} />

              {/* Step 4 */}
              <FlowchartStepSlot
                stepNumber={4}
                expectedTitle="Central Plant Pasteurization"
                expectedSector="Secondary"
                placedCard={placedSlots[3]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 3}
                hasError={errorSlotIndex === 3}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />

              <MilkPipelineConnector isFlowing={flowStep >= 4} hasError={errorSlotIndex === 3} />

              {/* Step 5 */}
              <FlowchartStepSlot
                stepNumber={5}
                expectedTitle="Amul Parlours & Retail Booths"
                expectedSector="Tertiary"
                placedCard={placedSlots[4]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 4}
                hasError={errorSlotIndex === 4}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />

              <MilkPipelineConnector isFlowing={flowStep >= 5} hasError={errorSlotIndex === 4} />

              {/* Step 6 */}
              <FlowchartStepSlot
                stepNumber={6}
                expectedTitle="Healthy Students & Families"
                expectedSector="Consumer"
                placedCard={placedSlots[5]}
                isSelectedForDrop={selectedCardId !== null}
                isSimulating={isSimulating}
                isFlowingPast={flowStep >= 5}
                hasError={errorSlotIndex === 5}
                onDropCard={handleDropIntoSlot}
                onRemoveCard={handleRemoveFromSlot}
                onTapSlot={handleDropIntoSlot}
              />
            </div>
          </div>
        </div>

        {/* Dock Cards Area (Unplaced Scenario Cards) */}
        <div className="w-full bg-surface border border-border rounded-card p-3 shadow-soft shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-textMain uppercase tracking-wider">
              📦 Available Stage Cards (Drag or Tap to Place)
            </span>
            <span className="text-[11px] text-textMuted font-bold">
              {dockCards.length === 0 ? 'All stages placed on flowchart!' : `${dockCards.length} stages left to sequence`}
            </span>
          </div>

          {dockCards.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold text-statusSuccess bg-statusSuccess/10 rounded-btn border border-statusSuccess/30">
              ✓ All 6 stages have been positioned on the flowchart! Click &ldquo;🚀 Test & Run Milk Flow&rdquo; above to verify your sequence!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {dockCards.map((card) => {
                const isSelected = selectedCardId === card.id;
                return (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCardId(isSelected ? null : card.id);
                    }}
                    className={`bg-background rounded-card p-2 border-2 cursor-grab active:cursor-grabbing transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 ring-4 ring-blue-300 scale-105 shadow-lift bg-white'
                        : 'border-border hover:border-textMain/50 shadow-soft'
                    }`}
                  >
                    {/* Thumbnail Scene */}
                    <div className="w-full h-20 rounded-lg overflow-hidden border border-border bg-surface mb-1.5 pointer-events-none">
                      <ActivitySceneRenderer illustrationKey={card.illustrationKey} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[11px] font-black text-textMain leading-tight line-clamp-2 mb-1">
                        {card.title}
                      </h4>
                      <p className="text-[9px] text-textMuted line-clamp-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-1.5 pt-1 border-t border-border/40 flex items-center justify-between text-[9px] font-bold text-textMuted">
                      <span className="truncate">{card.location.split(' ')[0]}</span>
                      <span className="text-blue-600">✋ Drag</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Complete Success Modal */}
      {isCompleteSuccess && (
        <div className="fixed inset-0 bg-textMain/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border-2 border-border rounded-card p-6 shadow-lift text-center relative overflow-hidden animate-scaleUp">
            {/* White Revolution Milk Medal */}
            <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-400 mx-auto flex items-center justify-center text-4xl mb-3 shadow-md animate-bounce">
              🥛
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-blue-700">
              NCERT Case Study Mastered!
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-textMain mt-1 mb-2">
              🎉 Outstanding, {activeTeam.name}!
            </h2>

            <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto mb-4">
              You have accurately constructed the complete supply chain flowchart of <strong>AMUL</strong>:
              from village dairy farmers to refrigerated milk tankers, pasteurization plants, retail booths,
              and nourishing morning milk for schoolchildren!
            </p>

            {/* Points Award Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-statusSuccess/15 border border-statusSuccess/40 text-statusSuccess font-black text-sm mb-5 shadow-sm">
              <span>🌟 +30 Points Earned by {activeTeam.name}!</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSwitchTeamRound}
                className="w-full sm:w-auto px-5 py-2.5 rounded-btn border-2 border-border bg-surface hover:bg-background text-textMain font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>🔄 Let {otherTeam.name} Play Round 2</span>
              </button>

              {onGoToSectorSorter && (
                <button
                  onClick={onGoToSectorSorter}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-btn bg-accentYellow hover:brightness-105 text-textMain font-black text-xs sm:text-sm shadow-lift transition-all flex items-center justify-center gap-2 group"
                >
                  <span>🌾 Back to Sector Sorter Battle</span>
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
