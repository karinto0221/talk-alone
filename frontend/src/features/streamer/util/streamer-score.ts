export type StreamerRank = 'S' | 'A' | 'B' | 'C' | 'D' | '--';

export function getStreamerRank(score: number, elapsedSeconds: number, scored: boolean): StreamerRank {
  if (!scored || elapsedSeconds <= 0) return '--';
  const scorePerMinute = score / (elapsedSeconds / 60);
  if (scorePerMinute >= 1_050) return 'S';
  if (scorePerMinute >= 800) return 'A';
  if (scorePerMinute >= 600) return 'B';
  if (scorePerMinute >= 400) return 'C';
  return 'D';
}

export function formatDecimalSeconds(seconds: number | null) {
  return seconds === null ? '--' : `${seconds.toFixed(1)}s`;
}
