import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStreamerApi } from '../../../api/hook/useStreamerApi';
import type { ReflexTrainingType } from '../../practice/type';
import { createAnalogyPrompt, type AnalogyPromptKind } from '../data/analogy-prompt.data';

export type ReflexPrompt = {
  text: string;
  label: string;
  kind: 'comment' | AnalogyPromptKind;
};

export function useReflexSession(trainingType: ReflexTrainingType) {
  const [prompt, setPrompt] = useState<ReflexPrompt | null>(null);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const streamerApi = useStreamerApi();
  const requestIdRef = useRef(0);

  const next = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (trainingType === 'analogy') {
      const nextPrompt = createAnalogyPrompt(prompt?.text);
      setPrompt({ ...nextPrompt });
      setHistory((current) => [...current, nextPrompt.text]);
      setRound((current) => current + 1);
      return;
    }

    try {
      const result = await streamerApi.createComment(history.slice(-10));
      if (requestIdRef.current !== requestId) return;
      setPrompt({ text: result.text, label: 'コメントに返す', kind: 'comment' });
      setHistory((current) => [...current, result.text]);
      setRound((current) => current + 1);
    } catch {
      // API hook exposes the error. The current prompt remains visible so the user can retry.
    }
  }, [history, prompt?.text, streamerApi.createComment, trainingType]);

  useEffect(() => {
    void next();
    return () => {
      requestIdRef.current += 1;
    };
    // The first prompt is fetched only once for the selected training type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => ({
    prompt,
    round,
    loading: streamerApi.loading,
    error: streamerApi.error,
    next,
  }), [prompt, round, streamerApi.error, streamerApi.loading, next]);
}
