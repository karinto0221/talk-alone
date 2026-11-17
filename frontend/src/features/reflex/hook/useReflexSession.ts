import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReflexTrainingType } from '../../practice/type';
import { createAssociationPrompt, createCombinationPrompt, type AnalogyPromptKind } from '../data/analogy-prompt.data';
import { createEnglishAssociationPrompt, createEnglishCombinationPrompt } from '../data/english-analogy-prompt.data';
import type { ContentLanguage } from '../../../domain/practice';

export type ReflexPrompt = {
  text: string;
  label: string;
  kind: AnalogyPromptKind;
};

export type ReflexAttempt = { prompt: string; responseSeconds: number; timedOut?: boolean };
export type ReflexPhase = 'ready' | 'running' | 'complete';

type ReflexSessionOptions = {
  startImmediately?: boolean;
  timeLimitSeconds?: number;
};

export function useReflexSession(
  trainingType: ReflexTrainingType,
  language: ContentLanguage,
  targetRounds: number,
  { startImmediately = true, timeLimitSeconds }: ReflexSessionOptions = {},
) {
  const createPrompt = useCallback((previousText?: string): ReflexPrompt => {
    if (trainingType === 'association') return language === 'en' ? createEnglishAssociationPrompt(previousText) : createAssociationPrompt(previousText);
    return language === 'en' ? createEnglishCombinationPrompt(previousText) : createCombinationPrompt(previousText);
  }, [language, trainingType]);
  const [prompt, setPrompt] = useState<ReflexPrompt>(() => createPrompt());
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<ReflexPhase>(startImmediately ? 'running' : 'ready');
  const [attempts, setAttempts] = useState<ReflexAttempt[]>([]);
  const [remainingMilliseconds, setRemainingMilliseconds] = useState((timeLimitSeconds ?? 0) * 1_000);
  const promptStartedAtRef = useRef(startImmediately ? performance.now() : 0);
  const promptDeadlineRef = useRef(startImmediately && timeLimitSeconds ? performance.now() + timeLimitSeconds * 1_000 : 0);
  const advancingRef = useRef(false);

  const next = useCallback((timedOut = false) => {
    if (phase !== 'running' || advancingRef.current) return;
    advancingRef.current = true;
    const elapsedSeconds = Math.max(0.1, (performance.now() - promptStartedAtRef.current) / 1_000);
    const completedAttempt = {
      prompt: prompt.text,
      responseSeconds: timeLimitSeconds ? Math.min(timeLimitSeconds, elapsedSeconds) : elapsedSeconds,
      timedOut,
    };
    setAttempts((current) => [...current, completedAttempt]);
    if (round >= targetRounds) {
      setPhase('complete');
      return;
    }
    const nextPrompt = createPrompt(prompt.text);
    setPrompt(nextPrompt);
    setRound((current) => current + 1);
    const now = performance.now();
    promptStartedAtRef.current = now;
    if (timeLimitSeconds) {
      promptDeadlineRef.current = now + timeLimitSeconds * 1_000;
      setRemainingMilliseconds(timeLimitSeconds * 1_000);
    }
  }, [createPrompt, phase, prompt.text, round, targetRounds, timeLimitSeconds]);

  useEffect(() => {
    if (phase === 'running') advancingRef.current = false;
  }, [phase, round]);

  const start = useCallback(() => {
    const now = performance.now();
    promptStartedAtRef.current = now;
    if (timeLimitSeconds) {
      promptDeadlineRef.current = now + timeLimitSeconds * 1_000;
      setRemainingMilliseconds(timeLimitSeconds * 1_000);
    }
    setPhase('running');
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (phase !== 'running' || !timeLimitSeconds) return;
    let timerId = 0;
    const updateRemainingTime = () => {
      const remaining = Math.max(0, promptDeadlineRef.current - performance.now());
      setRemainingMilliseconds(remaining);
      if (remaining <= 0) {
        next(true);
        return;
      }
      timerId = window.setTimeout(updateRemainingTime, Math.min(100, remaining));
    };
    updateRemainingTime();
    return () => window.clearTimeout(timerId);
  }, [next, phase, round, timeLimitSeconds]);

  const restart = useCallback(() => {
    const firstPrompt = createPrompt();
    setPrompt(firstPrompt);
    setRound(1);
    setPhase(startImmediately ? 'running' : 'ready');
    setAttempts([]);
    const now = performance.now();
    promptStartedAtRef.current = startImmediately ? now : 0;
    if (timeLimitSeconds) {
      promptDeadlineRef.current = startImmediately ? now + timeLimitSeconds * 1_000 : 0;
      setRemainingMilliseconds(timeLimitSeconds * 1_000);
    }
  }, [createPrompt, startImmediately, timeLimitSeconds]);

  return useMemo(() => ({
    phase,
    prompt,
    round,
    targetRounds,
    attempts,
    loading: false,
    error: '',
    remainingSeconds: remainingMilliseconds / 1_000,
    start,
    next,
    restart,
  }), [attempts, next, phase, prompt, remainingMilliseconds, restart, round, start, targetRounds]);
}
