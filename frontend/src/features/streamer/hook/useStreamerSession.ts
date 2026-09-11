import { useEffect, useMemo, useRef, useState } from 'react';
import { createCommentDelayMs, type StreamerCommentFrequency } from '../config/comment-frequency';
import { STREAMER_USERNAMES } from '../data/streamer-user.data';
import { createRandomComment } from '../service/streamer-content.service';

export type StreamerCommentItem = { id: string; username: string; text: string; receivedAtSeconds: number };
export type StreamerPhase = 'running' | 'complete';

function randomUsername(previousUsername?: string) {
  const candidates = STREAMER_USERNAMES.filter((username) => username !== previousUsername);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? STREAMER_USERNAMES[0];
}

export function useStreamerSession(durationMinutes: number, commentFrequency: StreamerCommentFrequency) {
  const totalSeconds = durationMinutes * 60;
  const [phase, setPhase] = useState<StreamerPhase>('running');
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const startedAt = useRef(Date.now());
  const [comments, setComments] = useState<StreamerCommentItem[]>(() => [{
    id: `${Date.now()}-${Math.random()}`,
    username: randomUsername(),
    text: createRandomComment(),
    receivedAtSeconds: 0,
  }]);

  useEffect(() => {
    const deadline = startedAt.current + totalSeconds * 1000;
    let timer = 0;
    const updateTimer = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining === 0) {
        window.clearInterval(timer);
        setPhase('complete');
      }
    };
    timer = window.setInterval(updateTimer, 250);
    updateTimer();
    return () => window.clearInterval(timer);
  }, [totalSeconds]);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setTimeout(() => {
      setComments((current) => {
        const previousUsername = current[current.length - 1]?.username;
        return [...current, {
          id: `${Date.now()}-${Math.random()}`,
          username: randomUsername(previousUsername),
          text: createRandomComment(current.slice(-10).map((comment) => comment.text)),
          receivedAtSeconds: Math.floor((Date.now() - startedAt.current) / 1000),
        }];
      });
    }, createCommentDelayMs(commentFrequency));
    return () => window.clearTimeout(timer);
  }, [commentFrequency, comments.length, phase]);

  return useMemo(() => ({
    phase,
    comments,
    remainingSeconds,
    elapsedSeconds: totalSeconds - remainingSeconds,
    progress: Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100),
  }), [comments, phase, remainingSeconds, totalSeconds]);
}
