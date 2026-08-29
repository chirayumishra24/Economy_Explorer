'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ArrowLeft, HelpCircle, ArrowUp, ArrowDown, Bot, Keyboard } from 'lucide-react';
import { BOARD_TILES } from '../../data/activityGameData';
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

export function EconomySnakesLadders({ players, onUpdateScore, onEndGame, onBack }: EconomySnakesLaddersProps) {
  const [positions, setPositions] = useState([1, 1]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [questionTile, setQuestionTile] = useState<BoardTile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState([0, 0]);

  const aiActionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const rollDice = useCallback(() => {
    if (rolling || questionTile || gameOver) return;
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
            setMessage(`🎉 ${players[currentPlayer].name} reaches the final tile!`);
            return newPositions;
          }

          // Check tile type
          const tile = BOARD_TILES[newPos - 1];
          if (tile.type === 'question') {
            setTimeout(() => setQuestionTile(tile), 500);
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
  }, [rolling, questionTile, gameOver, currentPlayer, players, onEndGame, correctCount]);

  const answerQuestion = useCallback((selectedIndex: number) => {
    if (!questionTile?.question) return;
    const correct = selectedIndex === questionTile.question.correctIndex;
    const newCorrect = [...correctCount];

    if (correct) {
      sound.playCorrect();
      newCorrect[currentPlayer]++;
      setCorrectCount(newCorrect);
      onUpdateScore(currentPlayer, 10);
      setMessage('✅ Correct! Safe on this tile.');
    } else {
      sound.playWrong();
      setPositions(prev => {
        const newP = [...prev];
        newP[currentPlayer] = Math.max(1, newP[currentPlayer] - 3);
        return newP;
      });
      setMessage(`❌ Wrong! Go back 3 tiles. Correct: ${questionTile.question.options[questionTile.question.correctIndex]}`);
    }

    setQuestionTile(null);
    setTimeout(() => {
      setMessage(null);
      setCurrentPlayer(p => ((1 - p) as 0 | 1));
    }, 1800);
  }, [questionTile, currentPlayer, correctCount, onUpdateScore]);

  // AI Auto-Turn
  useEffect(() => {
    if (!gameStarted || gameOver || currentPlayer !== 1 || !players[1].isAI) return;

    if (!questionTile && !rolling) {
      aiActionTimerRef.current = setTimeout(() => {
        rollDice();
      }, 1200);
    }

    return () => {
      if (aiActionTimerRef.current) clearTimeout(aiActionTimerRef.current);
    };
  }, [gameStarted, gameOver, currentPlayer, players, questionTile, rolling, rollDice]);

  // AI Question Solver
  useEffect(() => {
    if (!questionTile?.question || currentPlayer !== 1 || !players[1].isAI) return;

    const botLevel = players[1].aiDifficulty || 'medium';
    const accuracy = botLevel === 'easy' ? 0.6 : botLevel === 'medium' ? 0.85 : 0.95;

    const timer = setTimeout(() => {
      const isCorrect = Math.random() < accuracy;
      const chosenIdx = isCorrect
        ? questionTile.question!.correctIndex
        : (questionTile.question!.correctIndex + 1) % questionTile.question!.options.length;

      answerQuestion(chosenIdx);
    }, 1500);

    return () => clearTimeout(timer);
  }, [questionTile, currentPlayer, players, answerQuestion]);

  // Spacebar Hotkey to Roll for Human Player
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (currentPlayer === 0 && !rolling && !questionTile) {
          e.preventDefault();
          rollDice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, currentPlayer, rolling, questionTile, rollDice]);

  if (!gameStarted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-elevated">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Dice5 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Economy Snakes & Ladders</h1>
          <p className="text-gray-500 mb-4">Roll, answer, climb, and dodge!</p>
          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 space-y-2 mb-6 text-left border border-gray-100">
            <p>🎲 <strong>Roll the dice</strong> to advance across 36 tiles</p>
            <p>❓ <strong>Question tiles</strong> — answer correctly to stay, wrong = go back 3</p>
            <p>📈 <strong>GDP Boom Ladders</strong> — ride up the economic expansion!</p>
            <p>🐍 <strong>Recession Snakes</strong> — slide down supply shocks!</p>
            <p className="pt-2 border-t border-gray-200 flex items-center gap-1 text-gray-800 font-bold">
              <Keyboard className="w-3.5 h-3.5 text-ncert-blue" /> Press <kbd className="px-1.5 py-0.5 bg-white rounded border">Space</kbd> on your turn to roll dice!
            </p>
          </div>
          <button
            onClick={() => { sound.playClick(); setGameStarted(true); setPositions([1, 1]); }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            Roll into the Board! 🎲
          </button>
        </div>
      </div>
    );
  }

  // Render board as 6x6 grid
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
    <div className="min-h-screen flex flex-col bg-ncert-warm-bg pb-12">
      <ScoreBoard
        players={[
          { name: players[0].name, score: correctCount[0] * 10 },
          { name: players[1].name, score: correctCount[1] * 10 },
        ]}
      />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 py-6 gap-6 relative max-w-5xl mx-auto w-full">
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className="absolute top-4 left-4 p-2 rounded-xl hover:bg-white text-gray-400 bg-white/60 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* 6x6 Board */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-3xl p-4 border border-gray-200 shadow-elevated">
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
            disabled={rolling || !!questionTile || gameOver || (currentPlayer === 1 && !!players[1].isAI)}
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

      {/* Question Modal */}
      {questionTile?.question && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full p-6 sm:p-7 animate-scale-in border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <p className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                Economy Checkpoint ({players[currentPlayer].name})
              </p>
            </div>
            <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{questionTile.question.text}</p>

            {currentPlayer === 0 || !players[1].isAI ? (
              <div className="space-y-2.5">
                {questionTile.question.options.map((opt, i) => (
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
                🤖 AI is answering the checkpoint question...
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-4 text-center">
              ✅ Correct = stay on tile | ❌ Wrong = retreat 3 tiles
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
