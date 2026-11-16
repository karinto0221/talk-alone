import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReflexTrainingType } from '../../practice/type';
import { createAssociationPrompt, createCombinationPrompt, type AnalogyPromptKind } from '../data/analogy-prompt.data';
import { createEnglishAssociationPrompt, createEnglishCombinationPrompt } from '../data/english-analogy-prompt.data';
import type { ContentLanguage } from '../../../domain/practice';

export type ReflexPrompt = {
  text: string;
  label: string;
  kind: AnalogyPromptKind;
};

export type ReflexAttempt = { prompt: string; responseSeconds: number };
export type ReflexPhase = 'running' | 'complete';

export function useReflexSession(trainingType: ReflexTrainingType, language: ContentLanguage, targetRounds: number) {
  const createPrompt = useCallback((previousText?: string): ReflexPrompt => {
    if (trainingType === 'association') return language === 'en' ? createEnglishAssociationPrompt(previousText) : createAssociationPrompt(previousText);
    return language === 'en' ? createEnglishCombinationPrompt(previousText) : createCombinationPrompt(previousText);
  }, [language, trainingType]);
  const [prompt, setPrompt] = useState<ReflexPrompt>(() => createPrompt());
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<ReflexPhase>('running');
  const [attempts, setAttempts] = useState<ReflexAttempt[]>([]);
  const promptStartedAtRef = useRef(performance.now());

  const next = useCallback(() => {
    if (phase !== 'running') return;
    const completedAttempt = {
      prompt: prompt.text,
      responseSeconds: Math.max(0.1, (performance.now() - promptStartedAtRef.current) / 1_000),
    };
    setAttempts((current) => [...current, completedAttempt]);
    if (round >= targetRounds) {
      setPhase('complete');
      return;
    }
    const nextPrompt = createPrompt(prompt.text);
    setPrompt(nextPrompt);
    setRound((current) => current + 1);
    promptStartedAtRef.current = performance.now();
  }, [createPrompt, phase, prompt.text, round, targetRounds]);

  const restart = useCallback(() => {
    const firstPrompt = createPrompt();
    setPrompt(firstPrompt);
    setRound(1);
    setPhase('running');
    setAttempts([]);
    promptStartedAtRef.current = performance.now();
  }, [createPrompt]);

  return useMemo(() => ({
    phase,
    prompt,
    round,
    targetRounds,
    attempts,
    loading: false,
    error: '',
    next,
    restart,
  }), [attempts, next, phase, prompt, restart, round, targetRounds]);
}
