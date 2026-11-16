import type { ReflexAttempt } from '../hook/useReflexSession';

export type ReflexResultSummary = {
  averageSeconds: number;
  fastestSeconds: number;
  slowestSeconds: number;
  totalSeconds: number;
};

export function summarizeReflexAttempts(attempts: readonly ReflexAttempt[]): ReflexResultSummary {
  if (attempts.length === 0) return { averageSeconds: 0, fastestSeconds: 0, slowestSeconds: 0, totalSeconds: 0 };
  const durations = attempts.map((attempt) => attempt.responseSeconds);
  const totalSeconds = durations.reduce((total, duration) => total + duration, 0);
  return {
    averageSeconds: totalSeconds / durations.length,
    fastestSeconds: Math.min(...durations),
    slowestSeconds: Math.max(...durations),
    totalSeconds,
  };
}
