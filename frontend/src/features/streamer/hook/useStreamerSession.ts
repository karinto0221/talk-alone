import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStreamerApi } from '../../../api/hook/useStreamerApi';
import { STREAMER_USERNAMES } from '../data/streamer-user.data';

export type StreamerCommentItem = { id: string; username: string; text: string; receivedAtSeconds: number };
export type StreamerPhase = 'running' | 'complete';

const MIN_COMMENT_DELAY_MS = 60_000;
const MAX_COMMENT_DELAY_MS = 180_000;

function randomCommentDelay() {
  return Math.floor(Math.random() * (MAX_COMMENT_DELAY_MS - MIN_COMMENT_DELAY_MS + 1)) + MIN_COMMENT_DELAY_MS;
}

function randomUsername(previousUsername?: string) {
  const candidates = STREAMER_USERNAMES.filter((username) => username !== previousUsername);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? STREAMER_USERNAMES[0];
}

export function useStreamerSession(durationMinutes: number, enabled = true) {
  const totalSeconds = durationMinutes * 60;
  const [phase, setPhase] = useState<StreamerPhase>('running');
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [comments, setComments] = useState<StreamerCommentItem[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const startedAt = useRef<number | null>(null);
  const phaseRef = useRef<StreamerPhase>('running');
  const streamerApi = useStreamerApi();

  const finish = useCallback(() => {
    phaseRef.current = 'complete';
    setPhase('complete');
  }, []);

  useEffect(() => {
    if (!enabled) return;
    startedAt.current = Date.now();
    const deadline = startedAt.current + totalSeconds * 1000;
    let timer = 0;
    const updateTimer = () => {
      if (phaseRef.current !== 'running') {
        window.clearInterval(timer);
        return;
      }
      const nextRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining === 0) {
        window.clearInterval(timer);
        phaseRef.current = 'complete';
        setPhase('complete');
      }
    };
    timer = window.setInterval(updateTimer, 250);
    updateTimer();
    return () => window.clearInterval(timer);
  }, [enabled, totalSeconds]);

  useEffect(() => {
    if (!enabled || phase !== 'running') return;
    let cancelled = false;
    const delay = comments.length === 0 ? (retryCount === 0 ? 0 : 10_000) : randomCommentDelay();
    const timer = window.setTimeout(async () => {
      try {
        const result = await streamerApi.createComment(comments.map((comment) => comment.text));
        if (cancelled) return;
        setComments((current) => {
          const previousUsername = current[current.length - 1]?.username;
          return [...current, {
            id: `${Date.now()}-${Math.random()}`,
            username: randomUsername(previousUsername),
            text: result.text,
            receivedAtSeconds: Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000),
          }];
        });
      } catch {
        if (!cancelled) setRetryCount((current) => current + 1);
      }
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [comments, enabled, phase, retryCount, streamerApi.createComment]);

  return useMemo(() => ({
    phase,
    comments,
    remainingSeconds,
    elapsedSeconds: totalSeconds - remainingSeconds,
    totalSeconds,
    progress: Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100),
    completedNaturally: remainingSeconds === 0,
    latestCommentId: comments[comments.length - 1]?.id,
    commentLoading: streamerApi.loading,
    error: streamerApi.error,
    finish,
  }), [comments, finish, phase, remainingSeconds, streamerApi.error, streamerApi.loading, totalSeconds]);
}
