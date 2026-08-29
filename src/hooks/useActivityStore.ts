'use client';

import { useState, useCallback } from 'react';
import { ActivityAppState, ActivityId, GameMode, Team, Player } from '../types/economy';

const INITIAL_STATE: ActivityAppState = {
  currentScreen: 'hub',
  currentActivity: null,
  gameMode: null,
  teams: null,
  players: null,
  roundNumber: 0,
  activityState: {},
  winnerName: null,
  finalScores: null,
};

export function useActivityStore() {
  const [state, setState] = useState<ActivityAppState>(INITIAL_STATE);

  const selectActivity = useCallback((id: ActivityId, mode: GameMode) => {
    setState(prev => ({
      ...prev,
      currentScreen: 'setup',
      currentActivity: id,
      gameMode: mode,
    }));
  }, []);

  const startTeamGame = useCallback((team1Name: string, team2Name: string, color1: string, color2: string) => {
    setState(prev => ({
      ...prev,
      currentScreen: 'playing',
      teams: [
        { name: team1Name || 'Team A', score: 0, color: color1 },
        { name: team2Name || 'Team B', score: 0, color: color2 },
      ],
      roundNumber: 1,
      activityState: {},
    }));
  }, []);

  const startIndividualGame = useCallback((p1Name: string, p2Name: string, isAI = false, aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    setState(prev => ({
      ...prev,
      currentScreen: 'playing',
      players: [
        { name: p1Name || 'Player 1', score: 0 },
        { name: p2Name || (isAI ? 'AI Bot' : 'Player 2'), score: 0, isAI, aiDifficulty },
      ],
      roundNumber: 1,
      activityState: {},
    }));
  }, []);

  const updateTeamScore = useCallback((teamIndex: 0 | 1, delta: number) => {
    setState(prev => {
      if (!prev.teams) return prev;
      const updated = [...prev.teams] as [Team, Team];
      updated[teamIndex] = { ...updated[teamIndex], score: Math.max(0, updated[teamIndex].score + delta) };
      return { ...prev, teams: updated };
    });
  }, []);

  const updatePlayerScore = useCallback((playerIndex: 0 | 1, delta: number) => {
    setState(prev => {
      if (!prev.players) return prev;
      const updated = [...prev.players] as [Player, Player];
      updated[playerIndex] = { ...updated[playerIndex], score: Math.max(0, updated[playerIndex].score + delta) };
      return { ...prev, players: updated };
    });
  }, []);

  const setRound = useCallback((round: number) => {
    setState(prev => ({ ...prev, roundNumber: round }));
  }, []);

  const nextRound = useCallback(() => {
    setState(prev => ({ ...prev, roundNumber: prev.roundNumber + 1 }));
  }, []);

  const setActivityState = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      activityState: { ...prev.activityState, [key]: value },
    }));
  }, []);

  const endGame = useCallback((winnerName: string, scores: { name: string; score: number }[]) => {
    setState(prev => ({
      ...prev,
      currentScreen: 'results',
      winnerName,
      finalScores: scores,
    }));
  }, []);

  const playAgain = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentScreen: 'setup',
      roundNumber: 0,
      activityState: {},
      winnerName: null,
      finalScores: null,
      teams: prev.teams ? [
        { ...prev.teams[0], score: 0 },
        { ...prev.teams[1], score: 0 },
      ] : null,
      players: prev.players ? [
        { ...prev.players[0], score: 0 },
        { ...prev.players[1], score: 0 },
      ] : null,
    }));
  }, []);

  const backToHub = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    selectActivity,
    startTeamGame,
    startIndividualGame,
    updateTeamScore,
    updatePlayerScore,
    setRound,
    nextRound,
    setActivityState,
    endGame,
    playAgain,
    backToHub,
  };
}
