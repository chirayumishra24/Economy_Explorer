'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  ArrowLeft,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Bot,
  Keyboard,
  BookOpen,
  Trophy,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { BOARD_TILES, SNAKES_LADDERS_QUESTION_BANK } from '../../data/activityGameData';
import { Player, BoardTile } from '../../types/economy';
import { ScoreBoard } from '../shared/ScoreBoard';
import { sound } from '../../utils/soundEffects';

interface EconomySnakesLaddersProps {
  players: [Player, Player];
  onUpdateScore: (playerIndex: 0 | 1, delta: number) => void;
  onEndGame: (winner: string, scores: { name: string; score: number }[]) => void;
  onBack: () => void;
}

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
const BOARD_SIZE = 36;
const PLAYER_COLORS = ['#3B82F6', '#F43F5E'];

type QuestionItem = typeof SNAKES_LADDERS_QUESTION_BANK[0];

export function EconomySnakesLadders({ players, onUpdateScore, onEndGame, onBack }: EconomySnakesLaddersProps) {
  const [positions, setPositions] = useState([1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState([0, 0]);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Dynamic non-repeating question pool
  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionItem[]>([]);
  const [questionPointer, setQuestionPointer] = useState(0);

  const aiActionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize randomized question queue on mount
  useEffect(() => {
    const scrambled = [...SNAKES_LADDERS_QUESTION_BANK].sort(() => Math.random() - 0.5);
    setShuffledQuestions(scrambled);
    setQuestionPointer(0);
  }, []);

  const getNextUniqueQuestion = useCallback((): QuestionItem => {
    if (shuffledQuestions.length === 0) {
      return SNAKES_LADDERS_QUESTION_BANK[0];
    }
    const q = shuffledQuestions[questionPointer % shuffledQuestions.length];
    setQuestionPointer(prev => prev + 1);
    return q;
  }, [shuffledQuestions, questionPointer]);

  const rollDice = useCallback(() => {
    if (rolling || activeQuestion || gameOver) return;
    setRolling(true);
    setMessage(null);
    sound.playDiceRoll();

    // Animate dice roll
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setRolling(false);

        // Move player
        setPositions(prev => {
          const newPositions = [...prev];
          const newPos = Math.min(prev[currentPlayer] + finalValue, BOARD_SIZE);

          if (newPos > BOARD_SIZE) {
            setMessage(`Need exact roll to finish!`);
            return prev;
          }

          newPositions[currentPlayer] = newPos;

          if (newPos === BOARD_SIZE) {
            setGameOver(true);
            sound.playVictory();
            setTimeout(() => {
              onEndGame(players[currentPlayer].name, [
                { name: players[0].name, score: (correctCount[0] * 10) + (currentPlayer === 0 ? 50 : 0) },
                { name: players[1].name, score: (correctCount[1] * 10) + (currentPlayer === 1 ? 50 : 0) },
              ]);
            }, 1800);
            setMessage(`🎉 ${players[currentPlayer].name} reached Tile 36 & won the game!`);
            return newPositions;
          }

          // Check tile type
          const tile = BOARD_TILES[newPos - 1];
          if (tile.type === 'question') {
            // Draw guaranteed unique question
            const nextQ = getNextUniqueQuestion();
            setTimeout(() => setActiveQuestion(nextQ), 500);
          } else if (tile.type === 'ladder') {
            setTimeout(() => {
              sound.playCoin();
              newPositions[currentPlayer] = tile.ladderTo!;
              setPositions([...newPositions]);
              setMessage(`📈 ${tile.label || 'Ladder!'} Climb to ${tile.ladderTo}!`);
              setTimeout(() => { setMessage(null); setCurrentPlayer(p => ((1 - p) as 0 | 1)); }, 1400);
            }, 500);
          } else if (tile.type === 'snake') {
            setTimeout(() => {
              sound.playWrong();
              newPositions[currentPlayer] = tile.snakeTo!;
              setPositions([...newPositions]);
              setMessage(`🐍 ${tile.label || 'Snake!'} Slide to ${tile.snakeTo}!`);
              setTimeout(() => { setMessage(null); setCurrentPlayer(p => ((1 - p) as 0 | 1)); }, 1400);
            }, 500);
          } else {
            setTimeout(() => setCurrentPlayer(p => ((1 - p) as 0 | 1)), 600);
          }

          return newPositions;
        });
      }
    }, 80);
  }, [rolling, activeQuestion, gameOver, currentPlayer, players, onEndGame, correctCount, getNextUniqueQuestion]);

  const answerQuestion = useCallback((selectedIndex: number) => {
    if (!activeQuestion) return;
    const correct = selectedIndex === activeQuestion.correctIndex;
    const newCorrect = [...correctCount];

    if (correct) {
      sound.playCorrect();
      newCorrect[currentPlayer]++;
      setCorrectCount(newCorrect);
      onUpdateScore(currentPlayer, 10);
      setMessage('✅ Correct! Safe on this tile (+10 pts).');
    } else {
      sound.playWrong();
      setPositions(prev => {
        const newP = [...prev];
        newP[currentPlayer] = Math.max(1, newP[currentPlayer] - 3);
        return newP;
      });
      setMessage(`❌ Wrong! Retreat 3 tiles. Correct: ${activeQuestion.options[activeQuestion.correctIndex]}`);
    }

    setActiveQuestion(null);
    setTimeout(() => {
      setMessage(null);
      setCurrentPlayer(p => ((1 - p) as 0 | 1));
    }, 1800);
  }, [activeQuestion, currentPlayer, correctCount, onUpdateScore]);

  // AI Auto-Turn
  useEffect(() => {
    if (!gameStarted || gameOver || currentPlayer !== 1 || !players[1].isAI) return;

    if (!activeQuestion && !rolling) {
      aiActionTimerRef.current = setTimeout(() => {
        rollDice();
      }, 1200);
    }

    return () => {
      if (aiActionTimerRef.current) clearTimeout(aiActionTimerRef.current);
    };
  }, [gameStarted, gameOver, currentPlayer, players, activeQuestion, rolling, rollDice]);

  // AI Question Solver
  useEffect(() => {
    if (!activeQuestion || currentPlayer !== 1 || !players[1].isAI) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const accuracy = botLevel === 'easy' ? 0.6 : botLevel === 'medium' ? 0.85 : 0.95;

    const timer = setTimeout(() => {
      const isCorrect = Math.random() < accuracy;
      const chosenIdx = isCorrect
        ? activeQuestion.correctIndex
        : (activeQuestion.correctIndex + 1) % activeQuestion.options.length;

      answerQuestion(chosenIdx);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeQuestion, currentPlayer, players, answerQuestion]);

  // Spacebar Hotkey to Roll for Human Player
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (currentPlayer === 0 && !rolling && !activeQuestion) {
          e.preventDefault();
          rollDice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, currentPlayer, rolling, activeQuestion, rollDice]);

  // ─── STARTING RULES & GAME FLOW SCREEN ─────────────────────────────
  if (!gameStarted) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-elevated animate-scale-in">
          {/* Header Banner */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center mx-auto mb-3 shadow-soft">
              <Dice5 className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              NCERT Grade 6 Social Science • Chapter 14
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-2 mb-1">
              Economy Snakes & Ladders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Master economic activities, primary/secondary/tertiary sectors, and goods vs services on the 36-tile board!
            </p>
          </div>

          {/* 5-Stage Game Flow (Visual Roadmap) */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Complete Game Flow (5 Stages)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                  1
                </span>
                <p className="text-xs font-bold text-indigo-900 mb-0.5">Roll Dice</p>
                <p className="text-[10px] text-gray-500 leading-tight">Press Space or Tap on your turn</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-center flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                  2
                </span>
                <p className="text-xs font-bold text-blue-900 mb-0.5">Move Token</p>
                <p className="text-[10px] text-gray-500 leading-tight">Advance along 36 economic tiles</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                  3
                </span>
                <p className="text-xs font-bold text-amber-900 mb-0.5">Checkpoint</p>
                <p className="text-[10px] text-gray-500 leading-tight">Answer non-repeating economy question</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-center flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                  4
                </span>
                <p className="text-xs font-bold text-rose-900 mb-0.5">Shocks / Booms</p>
                <p className="text-[10px] text-gray-500 leading-tight">Climb ladders 📈 or slide snakes 🐍</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">
                  5
                </span>
                <p className="text-xs font-bold text-emerald-900 mb-0.5">Final Goal</p>
                <p className="text-[10px] text-gray-500 leading-tight">Exact roll to Tile 36 +50 pts</p>
              </div>
            </div>
          </div>

          {/* Rules & Scoring Matrix */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80 mb-6 space-y-2 text-xs text-gray-700">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4 text-ncert-blue" /> Official Game Rules & Scoring Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                <p className="font-bold text-emerald-700 flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> GDP Booms (Ladders):
                </p>
                <p className="text-gray-500 mt-0.5">
                  Tiles 3, 8, 17, 21 rocket you upward (e.g. Industrialization, Export Growth).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                <p className="font-bold text-red-600 flex items-center gap-1">
                  <ArrowDown className="w-3.5 h-3.5 text-red-500" /> Economic Shocks (Snakes):
                </p>
                <p className="text-gray-500 mt-0.5">
                  Tiles 14, 24, 30, 35 slide you down (Recession, Drought, Supply Chain break).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                <p className="font-bold text-amber-700 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Question Checkpoints:
                </p>
                <p className="text-gray-500 mt-0.5">
                  <strong>✅ Correct:</strong> Stay on tile + earn <strong>+10 points</strong>.<br />
                  <strong>❌ Wrong:</strong> Retreat <strong>3 tiles</strong> backward.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                <p className="font-bold text-indigo-700 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-indigo-500" /> Non-Repeating Question Engine:
                </p>
                <p className="text-gray-500 mt-0.5">
                  Every checkpoint pulls a fresh, unused question from the 30+ question bank!
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5 text-gray-700" /> Hotkey: Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300 text-gray-900 font-mono">Space</kbd> to roll
              </span>
              <span className="text-indigo-600 font-semibold">
                Match: {players[0].name} vs {players[1].name}
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => {
              sound.playClick();
              setGameStarted(true);
              setPositions([1, 1]);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white font-bold text-base hover:shadow-elevated transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Dice5 className="w-5 h-5" />
            I Understand the Rules — Roll into Board!
          </button>
        </div>
      </div>
    );
  }

  // Render 6x6 Board Grid
  const renderBoard = () => {
    const rows = [];
    for (let row = 5; row >= 0; row--) {
      const cells = [];
      const isReversed = row % 2 === 1;
      for (let col = 0; col < 6; col++) {
        const actualCol = isReversed ? (5 - col) : col;
        const pos = row * 6 + actualCol + 1;
        const tile = BOARD_TILES[pos - 1];
        const p1Here = positions[0] === pos;
        const p2Here = positions[1] === pos;

        let bgClass = 'bg-white border-gray-200';
        if (tile.type === 'ladder') bgClass = 'bg-emerald-50 border-emerald-300';
        else if (tile.type === 'snake') bgClass = 'bg-red-50 border-red-300';
        else if (tile.type === 'question') bgClass = 'bg-amber-50 border-amber-300';

        cells.push(
          <div key={pos} className={`relative aspect-square border-2 rounded-xl p-1 flex flex-col justify-between text-[10px] ${bgClass} transition-all shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-400">{pos}</span>
              {tile.type === 'ladder' && <ArrowUp className="w-3.5 h-3.5 text-emerald-600 font-bold" />}
              {tile.type === 'snake' && <ArrowDown className="w-3.5 h-3.5 text-red-500 font-bold" />}
              {tile.type === 'question' && <HelpCircle className="w-3.5 h-3.5 text-amber-500 font-bold" />}
            </div>

            {tile.label && (
              <span className="text-[7px] font-bold text-center leading-tight line-clamp-1 opacity-80">
                {tile.label}
              </span>
            )}

            <div className="flex gap-1 justify-center mt-auto">
              {p1Here && <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md animate-bounce-slow" style={{ backgroundColor: PLAYER_COLORS[0] }} />}
              {p2Here && <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md animate-bounce-slow" style={{ backgroundColor: PLAYER_COLORS[1] }} />}
            </div>
          </div>
        );
      }
      rows.push(<div key={row} className="grid grid-cols-6 gap-1.5">{cells}</div>);
    }
    return <div className="space-y-1.5">{rows}</div>;
  };

  const DiceIcon = diceValue ? DICE_ICONS[diceValue - 1] : Dice1;

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <ScoreBoard
        players={[
          { name: players[0].name, score: correctCount[0] * 10 },
          { name: players[1].name, score: correctCount[1] * 10 },
        ]}
      />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 py-6 gap-6 relative max-w-5xl mx-auto w-full">
        {/* Top left action controls */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="p-2 rounded-xl hover:bg-white text-gray-400 bg-white/60 border border-gray-200 shadow-sm"
            title="Exit Activity"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { sound.playClick(); setShowRulesModal(true); }}
            className="px-3 py-2 rounded-xl bg-white/80 border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-sm hover:bg-white"
          >
            <Info className="w-4 h-4 text-indigo-600" />
            Rules & Flow
          </button>
        </div>

        {/* 6x6 Board */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-3xl p-4 border border-gray-200 shadow-elevated mt-12 lg:mt-0">
          {renderBoard()}
        </div>

        {/* Controls & Turn info */}
        <div className="flex flex-col items-center gap-4 min-w-[220px]">
          {/* Current player indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: PLAYER_COLORS[currentPlayer] }} />
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
              {currentPlayer === 1 && players[1].isAI && <Bot className="w-3.5 h-3.5 text-purple-600" />}
              {players[currentPlayer].name}'s Turn
            </span>
          </div>

          {/* Dice Button */}
          <button
            onClick={rollDice}
            disabled={rolling || !!activeQuestion || gameOver || (currentPlayer === 1 && !!players[1].isAI)}
            className={`w-24 h-24 rounded-3xl bg-white border-2 border-gray-200 shadow-elevated flex flex-col items-center justify-center 
              transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${rolling ? 'animate-spin-slow' : ''}`}
          >
            <DiceIcon className="w-14 h-14 text-ncert-blue" />
          </button>
          <p className="text-[11px] text-gray-400 font-medium">
            {currentPlayer === 1 && players[1].isAI ? '🤖 AI is rolling...' : 'Press [Space] or Tap to Roll'}
          </p>

          {/* Tile positions */}
          <div className="text-xs text-gray-600 bg-white rounded-2xl p-3 border border-gray-200 shadow-sm w-full space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLAYER_COLORS[0] }} />
                {players[0].name}
              </span>
              <strong className="text-gray-900">Tile {positions[0]}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLAYER_COLORS[1] }} />
                {players[1].name}
              </span>
              <strong className="text-gray-900">Tile {positions[1]}</strong>
            </div>
          </div>

          {/* Toast Message */}
          {message && (
            <div className="bg-white rounded-2xl shadow-elevated border border-gray-200 px-4 py-3 text-xs text-center font-bold text-gray-800 max-w-[240px] animate-fade-in">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Unique Question Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full p-6 sm:p-7 animate-scale-in border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <p className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                  Economy Checkpoint ({players[currentPlayer].name})
                </p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Fresh Question
              </span>
            </div>

            <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{activeQuestion.text}</p>

            {currentPlayer === 0 || !players[1].isAI ? (
              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => answerQuestion(i)}
                    className="w-full text-left px-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-ncert-blue 
                      hover:bg-ncert-blue-50 transition-all text-xs font-semibold text-gray-800 shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-semibold text-purple-600 animate-pulse">
                🤖 AI is analyzing the checkpoint question...
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-4 text-center">
              ✅ Correct = stay on tile +10 pts | ❌ Wrong = retreat 3 tiles
            </p>
          </div>
        </div>
      )}

      {/* Rules In-Game Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-elevated max-w-lg w-full p-6 relative animate-scale-in">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Game Rules & Board Flow
            </h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <p className="font-bold text-indigo-900 mb-1">🎮 5-Stage Turn Progression:</p>
                <p>1. Roll Dice ➔ 2. Advance ➔ 3. Solve Checkpoint ➔ 4. Booms/Shocks ➔ 5. Goal Tile 36.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <p className="font-bold text-emerald-900 mb-1">📈 GDP Booms (Ladders):</p>
                <p>Tiles 3 ➔ 11, 8 ➔ 16, 17 ➔ 26, 21 ➔ 32.</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100">
                <p className="font-bold text-red-900 mb-1">🐍 Recessions (Snakes):</p>
                <p>Tiles 14 ➔ 6, 24 ➔ 15, 30 ➔ 20, 35 ➔ 27.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <p className="font-bold text-amber-900 mb-1">❓ Non-Repeating Checkpoints:</p>
                <p>Correct = +10 pts & hold position. Wrong = retreat 3 tiles.</p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full mt-5 py-3 rounded-xl bg-ncert-blue text-white font-bold text-xs hover:bg-ncert-blue-dark transition-all"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
