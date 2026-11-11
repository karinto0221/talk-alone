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

export function useReflexSession(trainingType: ReflexTrainingType, language: ContentLanguage) {
  const createPrompt = useCallback((previousText?: string): ReflexPrompt => {
    if (trainingType === 'analogy') return language === 'en' ? createEnglishAnalogyPrompt(previousText) : createAnalogyPrompt(previousText);
    return { text: createRandomComment(previousText ? [previousText] : [], language), label: language === 'en' ? 'Reply to the comment' : 'コメントに返す', kind: 'comment' };
  }, [language, trainingType]);
  const [prompt, setPrompt] = useState<ReflexPrompt>(() => createPrompt());
  const [round, setRound] = useState(1);
  const historyRef = useRef<string[]>([prompt.text]);

  const next = useCallback(() => {
    const history = historyRef.current;
    const nextPrompt = trainingType === 'comment'
      ? { text: createRandomComment(history.slice(-10), language), label: language === 'en' ? 'Reply to the comment' : 'コメントに返す', kind: 'comment' as const }
      : createPrompt(history[history.length - 1]);
    historyRef.current = [...history, nextPrompt.text];
    setPrompt(nextPrompt);
    setRound((current) => current + 1);
  }, [createPrompt, language, trainingType]);

  return useMemo(() => ({
    prompt,
    round,
    loading: false,
    error: '',
    next,
  }), [prompt, round, next]);
}
