import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReflexTrainingType } from '../../practice/type';
import { createRandomComment } from '../../streamer/service/streamer-content.service';
import { createAnalogyPrompt, type AnalogyPromptKind } from '../data/analogy-prompt.data';
import { createEnglishAnalogyPrompt } from '../data/english-analogy-prompt.data';
import type { ContentLanguage } from '../../../domain/practice';

export type ReflexPrompt = {
  text: string;
  label: string;
  kind: 'comment' | AnalogyPromptKind;
};

export type ReflexAttempt = { prompt: string; responseSeconds: number };
export type ReflexPhase = 'running' | 'complete';

export function useReflexSession(trainingType: ReflexTrainingType, language: ContentLanguage, targetRounds: number) {
  const createPrompt = useCallback((previousText?: string): ReflexPrompt => {
    if (trainingType === 'analogy') return language === 'en' ? createEnglishAnalogyPrompt(previousText) : createAnalogyPrompt(previousText);
    return { text: createRandomComment(previousText ? [previousText] : [], language), label: language === 'en' ? 'Reply to the comment' : 'コメントに返す', kind: 'comment' };
  }, [language, trainingType]);
  const [prompt, setPrompt] = useState<ReflexPrompt>(() => createPrompt());
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<ReflexPhase>('running');
  const [attempts, setAttempts] = useState<ReflexAttempt[]>([]);
  const historyRef = useRef<string[]>([prompt.text]);
  const promptStartedAtRef = useRef(performance.now());

  const next = useCallback(() => {
    if (phase !== 'running') return;
    const history = historyRef.current;
    const completedAttempt = {
      prompt: prompt.text,
      responseSeconds: Math.max(0.1, (performance.now() - promptStartedAtRef.current) / 1_000),
    };
    setAttempts((current) => [...current, completedAttempt]);
    if (round >= targetRounds) {
      setPhase('complete');
      return;
    }
    const nextPrompt = trainingType === 'comment'
      ? { text: createRandomComment(history.slice(-10), language), label: language === 'en' ? 'Reply to the comment' : 'コメントに返す', kind: 'comment' as const }
      : createPrompt(history[history.length - 1]);
    historyRef.current = [...history, nextPrompt.text];
    setPrompt(nextPrompt);
    setRound((current) => current + 1);
    promptStartedAtRef.current = performance.now();
  }, [createPrompt, language, phase, prompt.text, round, targetRounds, trainingType]);

  const restart = useCallback(() => {
    const firstPrompt = createPrompt();
    setPrompt(firstPrompt);
    setRound(1);
    setPhase('running');
    setAttempts([]);
    historyRef.current = [firstPrompt.text];
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
