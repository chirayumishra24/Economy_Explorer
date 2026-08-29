'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lightbulb,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { PICTIONARY_WORDS } from '../../data/activityGameData';
import { Team, PictionaryWord } from '../../types/economy';
import { useGameTimer } from '../../hooks/useGameTimer';
import { ScoreBoard } from '../shared/ScoreBoard';
import { GameTimer } from '../shared/GameTimer';
import { sound } from '../../utils/soundEffects';

interface EconomyPictionaryProps {
  teams: [Team, Team];
  onUpdateScore: (teamIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

const ROUND_TIME = 60;
const TOTAL_ROUNDS = 6;

export function EconomyPictionary({ teams, onUpdateScore, onEndGame, onBack }: EconomyPictionaryProps) {
  const [words, setWords] = useState<PictionaryWord[]>([]);
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);

  // Turn state
  const [activeDescriberTeam, setActiveDescriberTeam] = useState<0 | 1>(0);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [customClues, setCustomClues] = useState<string[]>([]);
  const [clueInput, setClueInput] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState<{
    success: boolean;
    points: number;
    text: string;
  } | null>(null);

  // Steal state
  const [isStealChance, setIsStealChance] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const timer = useGameTimer(ROUND_TIME);

  useEffect(() => {
    const shuffled = [...PICTIONARY_WORDS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setWords(shuffled);
  }, []);

  const currentWord = words[round];

  const startRound = () => {
    setRevealedHints(0);
    setCustomClues([]);
    setClueInput('');
    setGuessInput('');
    setIsWordRevealed(false);
    setRoundOutcome(null);
    setIsStealChance(false);
    timer.reset(ROUND_TIME);
    timer.start(() => handleTimeUp());
  };

  const handleStartGame = () => {
    setGameStarted(true);
    startRound();
  };

  const handleTimeUp = () => {
    if (!isStealChance) {
      setIsStealChance(true);
      timer.reset(15);
      timer.start(() => endRoundNoGuess());
    } else {
      endRoundNoGuess();
    }
  };

  const endRoundNoGuess = () => {
    timer.pause();
    setRoundOutcome({
      success: false,
      points: 0,
      text: `⏱️ Time's up! The secret economy term was "${currentWord?.word}".`
    });
  };

  const handleAddClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueInput.trim()) return;

    // Check if player typed the exact word as a clue (disallowed)
    if (currentWord && clueInput.toLowerCase().includes(currentWord.word.toLowerCase())) {
      alert(`⚠️ You cannot use the secret word "${currentWord.word}" in the clue!`);
      return;
    }

    setCustomClues(prev => [...prev, clueInput.trim()]);
    setClueInput('');
  };

  const handleRevealHint = (hintIdx: number) => {
    if (hintIdx >= revealedHints) {
      setRevealedHints(hintIdx + 1);
    }
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || !currentWord || roundOutcome) return;

    const normalizedGuess = guessInput.trim().toLowerCase();
    const normalizedTarget = currentWord.word.trim().toLowerCase();

    // Check exact or close match
    const isCorrect =
      normalizedGuess === normalizedTarget ||
      normalizedTarget.includes(normalizedGuess) && normalizedGuess.length >= 4;

    const guessingTeam = isStealChance ? ((1 - activeDescriberTeam) as 0 | 1) : activeDescriberTeam;

    if (isCorrect) {
      sound.playCorrect();
      timer.pause();
      // Calculate points
      const basePoints = isStealChance ? 15 : 20;
      const hintDeduction = revealedHints * 2;
      const finalPoints = Math.max(5, basePoints - hintDeduction);

      const newScores = [...scores] as [number, number];
      newScores[guessingTeam] += finalPoints;
      setScores(newScores);
      onUpdateScore(guessingTeam, finalPoints);

      setRoundOutcome({
        success: true,
        points: finalPoints,
        text: `🎉 Correct! ${teams[guessingTeam].name} guessed "${currentWord.word}" (+${finalPoints} pts)!`
      });
    } else {
      // Wrong guess
      sound.playWrong();
      setGuessInput('');
      if (!isStealChance) {
        setCustomClues(prev => [...prev, `❌ Guess attempted: "${guessInput}" (Incorrect)`]);
      }
    }
  };

  const handleNextRound = () => {
    sound.playClick();
    if (round + 1 >= TOTAL_ROUNDS || round + 1 >= words.length) {
      sound.playVictory();
      const winner =
        scores[0] > scores[1]
          ? teams[0].name
          : scores[1] > scores[0]
          ? teams[1].name
          : 'Tie';
      onEndGame(winner, [
        { name: teams[0].name, score: scores[0] },
        { name: teams[1].name, score: scores[1] }
      ]);
      return;
    }

    setRound(prev => prev + 1);
    setActiveDescriberTeam(prev => ((1 - prev) as 0 | 1));
    startRound();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Economy Pictionary</h1>
          <p className="text-gray-500 mb-4">
            Give smart clues to help your team guess economic terms, workers, and sectors before time runs out!
          </p>

          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-sm text-gray-700 space-y-2 mb-6 text-left">
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Describer secretly sees the word and types descriptive clues.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Teammates guess in the live log. <strong>60 seconds</strong> on the clock!</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Use optional hints or type custom clues. Steal window opens if time runs out!</span>
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Start Clue Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      <ScoreBoard
        teams={[
          { ...teams[0], score: scores[0] },
          { ...teams[1], score: scores[1] }
        ]}
        roundNumber={round + 1}
        totalRounds={TOTAL_ROUNDS}
        timerDisplay={timer.formattedTime}
        timerUrgency={timer.urgency}
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col items-center">
        {/* Top bar with back & round info */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex items-center gap-2">
            <GameTimer
              timeLeft={timer.timeLeft}
              totalTime={ROUND_TIME}
              urgency={timer.urgency}
              formattedTime={timer.formattedTime}
              size="sm"
            />
          </div>
        </div>

        {/* Turn banner */}
        <div className="text-center mb-6">
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-bold text-white shadow-soft"
            style={{ backgroundColor: teams[activeDescriberTeam].color }}
          >
            {isStealChance
              ? `⚡ STEAL WINDOW: ${teams[(1 - activeDescriberTeam) as 0 | 1].name}`
              : `${teams[activeDescriberTeam].name}'s Turn to Describe & Guess`}
          </div>
        </div>

        {/* Secret Word Box for Describer */}
        {currentWord && !roundOutcome && (
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-purple-200 shadow-elevated mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Secret Economic Term
              </span>
              <button
                onClick={() => setIsWordRevealed(!isWordRevealed)}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
              >
                {isWordRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isWordRevealed ? 'Hide Word' : 'Show Word (Describer only)'}
              </button>
            </div>

            {isWordRevealed ? (
              <div className="text-center py-4 bg-purple-50 rounded-2xl border border-purple-200 animate-fade-in">
                <p className="text-2xl font-bold text-purple-950 tracking-wide">{currentWord.word}</p>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 font-semibold uppercase mt-1 inline-block">
                  Category: {currentWord.category}
                </span>
              </div>
            ) : (
              <div
                onClick={() => setIsWordRevealed(true)}
                className="text-center py-5 bg-gray-50 rounded-2xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs text-gray-400 font-medium">
                  🔒 Click to reveal secret word (Teammates look away!)
                </p>
              </div>
            )}

            {/* Clue Hints */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Pre-set Clues & Hints:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {currentWord.hints.map((hint, hIdx) => {
                  const isRevealed = hIdx < revealedHints;
                  return (
                    <button
                      key={hIdx}
                      onClick={() => handleRevealHint(hIdx)}
                      disabled={isRevealed}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        isRevealed
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-bold block text-[10px] uppercase text-gray-500 mb-0.5">
                        Hint {hIdx + 1}
                      </span>
                      {isRevealed ? hint : 'Unlock (-2 pts)'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Clue and Guess Live Feed Area */}
        <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Describer Clue Input */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Describer: Give Clues
              </h3>
              <div className="space-y-1 max-h-36 overflow-y-auto mb-3 pr-1 text-xs">
                {customClues.length === 0 ? (
                  <p className="text-gray-400 italic">No custom clues added yet...</p>
                ) : (
                  customClues.map((c, i) => (
                    <div key={i} className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                      💡 {c}
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleAddClue} className="flex gap-1.5 mt-auto">
              <input
                type="text"
                value={clueInput}
                onChange={e => setClueInput(e.target.value)}
                placeholder="Type a clue..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Teammates Guess Input */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Teammates: Enter Guess
              </h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Listen/read the clues and type the exact economic concept or worker role!
              </p>
            </div>

            <form onSubmit={handleGuessSubmit} className="flex gap-1.5 mt-auto">
              <input
                type="text"
                value={guessInput}
                onChange={e => setGuessInput(e.target.value)}
                placeholder="Type your guess..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex-shrink-0"
              >
                Guess!
              </button>
            </form>
          </div>
        </div>

        {/* Round Outcome Dialog */}
        {roundOutcome && (
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-elevated animate-scale-in">
            {roundOutcome.success ? (
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-2" />
            ) : (
              <Clock className="w-14 h-14 text-amber-500 mx-auto mb-2" />
            )}

            <h3
              className={`text-xl font-bold mb-1 ${
                roundOutcome.success ? 'text-emerald-700' : 'text-gray-800'
              }`}
            >
              {roundOutcome.success ? 'Term Identified!' : 'Round Completed'}
            </h3>

            <p className="text-sm text-gray-600 mb-6">{roundOutcome.text}</p>

            <button
              onClick={handleNextRound}
              className="w-full py-3 rounded-xl bg-ncert-blue text-white font-semibold hover:bg-ncert-blue-dark transition-all active:scale-[0.98]"
            >
              {round + 1 >= TOTAL_ROUNDS ? 'Show Match Trophy 🏆' : 'Next Secret Word →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
