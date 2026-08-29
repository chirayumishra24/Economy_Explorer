'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ActivityHub } from '../components/ActivityHub/ActivityHub';
import { TeamSetup } from '../components/shared/TeamSetup';
import { PlayerSetup } from '../components/shared/PlayerSetup';
import { ResultScreen } from '../components/shared/ResultScreen';
import { WelcomeEntryAnimation } from '../components/ui/WelcomeEntryAnimation';
import { EconomicBackgroundAnimation } from '../components/ui/EconomicBackgroundAnimation';

// Activities
import { SectorAuctionWar } from '../components/Activities/SectorAuctionWar';
import { SupplyChainRelay } from '../components/Activities/SupplyChainRelay';
import { EconomyPictionary } from '../components/Activities/EconomyPictionary';
import { GoodsVsServicesSort } from '../components/Activities/GoodsVsServicesSort';
import { EconomyBuzzerRound } from '../components/Activities/EconomyBuzzerRound';
import { EconomySnakesLadders } from '../components/Activities/EconomySnakesLadders';

import { useActivityStore } from '../hooks/useActivityStore';
import { ACTIVITIES } from '../data/activityGameData';

export default function Home() {
  const {
    state,
    selectActivity,
    startTeamGame,
    startIndividualGame,
    updateTeamScore,
    updatePlayerScore,
    endGame,
    playAgain,
    backToHub
  } = useActivityStore();

  const currentActivityMeta = ACTIVITIES.find(a => a.id === state.currentActivity);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-ncert-warm-bg text-gray-900 relative overflow-x-hidden">
      {/* Animated Economic Activities Background */}
      <EconomicBackgroundAnimation />

      {/* Entry Welcome Animation */}
      <WelcomeEntryAnimation onStart={() => {}} />

      {/* Top Header */}
      <Header
        currentActivityId={state.currentActivity}
        onBackToHub={backToHub}
      />

      {/* Main Screen Canvas */}
      <main className="flex-1 w-full mx-auto">
        {/* SCREEN 1: ACTIVITY HUB */}
        {state.currentScreen === 'hub' && (
          <ActivityHub onSelectActivity={selectActivity} />
        )}

        {/* SCREEN 2: TEAM SETUP MODAL */}
        {state.currentScreen === 'setup' && state.gameMode === 'team' && (
          <TeamSetup
            activityTitle={currentActivityMeta?.title || 'Team Activity'}
            onStart={startTeamGame}
            onBack={backToHub}
          />
        )}

        {/* SCREEN 2: PLAYER 1v1 SETUP MODAL */}
        {state.currentScreen === 'setup' && state.gameMode === 'individual' && (
          <PlayerSetup
            activityTitle={currentActivityMeta?.title || '1v1 Battle'}
            onStart={startIndividualGame}
            onBack={backToHub}
          />
        )}

        {/* SCREEN 3: ACTIVE GAME SCREENS */}
        {state.currentScreen === 'playing' && (
          <>
            {/* Team Activity 1: Sector Auction War */}
            {state.currentActivity === 'sector-auction' && state.teams && (
              <SectorAuctionWar
                teams={state.teams}
                onUpdateScore={updateTeamScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}

            {/* Team Activity 2: Supply Chain Relay */}
            {state.currentActivity === 'supply-chain-relay' && state.teams && (
              <SupplyChainRelay
                teams={state.teams}
                onUpdateScore={updateTeamScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}

            {/* Team Activity 3: Economy Pictionary */}
            {state.currentActivity === 'economy-pictionary' && state.teams && (
              <EconomyPictionary
                teams={state.teams}
                onUpdateScore={updateTeamScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}

            {/* Individual Activity 1: Goods vs Services Sort */}
            {state.currentActivity === 'goods-vs-services' && state.players && (
              <GoodsVsServicesSort
                players={state.players}
                onUpdateScore={updatePlayerScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}

            {/* Individual Activity 2: Economy Buzzer Round */}
            {state.currentActivity === 'buzzer-round' && state.players && (
              <EconomyBuzzerRound
                players={state.players}
                onUpdateScore={updatePlayerScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}

            {/* Individual Activity 3: Economy Snakes & Ladders */}
            {state.currentActivity === 'snakes-ladders' && state.players && (
              <EconomySnakesLadders
                players={state.players}
                onUpdateScore={updatePlayerScore}
                onEndGame={endGame}
                onBack={backToHub}
              />
            )}
          </>
        )}

        {/* SCREEN 4: GAME RESULTS / TROPHY */}
        {state.currentScreen === 'results' && state.finalScores && (
          <ResultScreen
            winnerName={state.winnerName || 'Winner'}
            scores={state.finalScores}
            onPlayAgain={playAgain}
            onBackToHub={backToHub}
          />
        )}
      </main>
    </div>
  );
}
