'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useGameTimer(durationSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef<(() => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((onTimeUp?: () => void) => {
    clearTimer();
    if (onTimeUp) onTimeUpRef.current = onTimeUp;
    setIsRunning(true);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback((newDuration?: number) => {
    clearTimer();
    setTimeLeft(newDuration ?? durationSeconds);
    setIsRunning(false);
  }, [clearTimer, durationSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          if (onTimeUpRef.current) onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  // Urgency level for visual feedback
  const urgency: 'safe' | 'warning' | 'danger' =
    timeLeft > durationSeconds * 0.5 ? 'safe' :
    timeLeft > durationSeconds * 0.2 ? 'warning' : 'danger';

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  return { timeLeft, isRunning, start, pause, reset, urgency, formattedTime };
}
