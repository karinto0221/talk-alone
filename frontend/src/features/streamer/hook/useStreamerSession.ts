import { useEffect, useMemo, useRef, useState } from 'react';
import { createCommentDelayMs, type StreamerCommentFrequency } from '../config/comment-frequency';
import { STREAMER_USERNAMES } from '../data/streamer-user.data';
import { createRandomComment } from '../service/streamer-content.service';
import { ENGLISH_STREAMER_USERNAMES } from '../data/english-streamer.data';
import type { ContentLanguage } from '../../../domain/practice';

export type StreamerCommentItem = { id: string; username: string; text: string; receivedAtSeconds: number };
export type StreamerPhase = 'running' | 'complete';

function randomUsername(language: ContentLanguage, previousUsername?: string) {
  const usernames = language === 'en' ? ENGLISH_STREAMER_USERNAMES : STREAMER_USERNAMES;
  const candidates = usernames.filter((username) => username !== previousUsername);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? usernames[0];
}

export function useStreamerSession(durationMinutes: number, commentFrequency: StreamerCommentFrequency, language: ContentLanguage) {
  const totalSeconds = durationMinutes * 60;
  const [phase, setPhase] = useState<StreamerPhase>('running');
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const startedAt = useRef(Date.now());
  const [comments, setComments] = useState<StreamerCommentItem[]>(() => [{
    id: `${Date.now()}-${Math.random()}`,
    username: randomUsername(language),
    text: createRandomComment([], language),
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
          username: randomUsername(language, previousUsername),
          text: createRandomComment(current.slice(-10).map((comment) => comment.text), language),
          receivedAtSeconds: Math.floor((Date.now() - startedAt.current) / 1000),
        }];
      });
    }, createCommentDelayMs(commentFrequency));
    return () => window.clearTimeout(timer);
  }, [commentFrequency, comments.length, language, phase]);

  return useMemo(() => ({
    phase,
    comments,
    remainingSeconds,
    elapsedSeconds: totalSeconds - remainingSeconds,
    progress: Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100),
  }), [comments, phase, remainingSeconds, totalSeconds]);
}
