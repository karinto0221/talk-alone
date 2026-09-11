import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReflexTrainingType } from '../../practice/type';
import { createRandomComment } from '../../streamer/service/streamer-content.service';
import { createAnalogyPrompt, type AnalogyPromptKind } from '../data/analogy-prompt.data';

export type ReflexPrompt = {
  text: string;
  label: string;
  kind: 'comment' | AnalogyPromptKind;
};

export function useReflexSession(trainingType: ReflexTrainingType) {
  const createPrompt = useCallback((previousText?: string): ReflexPrompt => {
    if (trainingType === 'analogy') return createAnalogyPrompt(previousText);
    return { text: createRandomComment(previousText ? [previousText] : []), label: 'コメントに返す', kind: 'comment' };
  }, [trainingType]);
  const [prompt, setPrompt] = useState<ReflexPrompt>(() => createPrompt());
  const [round, setRound] = useState(1);
  const historyRef = useRef<string[]>([prompt.text]);

  const next = useCallback(() => {
    const history = historyRef.current;
    const nextPrompt = trainingType === 'comment'
      ? { text: createRandomComment(history.slice(-10)), label: 'コメントに返す', kind: 'comment' as const }
      : createPrompt(history[history.length - 1]);
    historyRef.current = [...history, nextPrompt.text];
    setPrompt(nextPrompt);
    setRound((current) => current + 1);
  }, [createPrompt, trainingType]);

  return useMemo(() => ({
    prompt,
    round,
    loading: false,
    error: '',
    next,
  }), [prompt, round, next]);
}
