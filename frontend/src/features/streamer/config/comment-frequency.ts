export type StreamerCommentFrequency = 'high' | 'normal' | 'low';

export const STREAMER_COMMENT_FREQUENCIES = {
  high: { label: '高頻度', rangeLabel: '10〜30秒', minSeconds: 10, maxSeconds: 30 },
  normal: { label: '通常', rangeLabel: '60〜180秒', minSeconds: 60, maxSeconds: 180 },
  low: { label: '低頻度', rangeLabel: '180〜300秒', minSeconds: 180, maxSeconds: 300 },
} as const satisfies Record<StreamerCommentFrequency, {
  label: string;
  rangeLabel: string;
  minSeconds: number;
  maxSeconds: number;
}>;

export function createCommentDelayMs(
  frequency: StreamerCommentFrequency,
  random: () => number = Math.random,
) {
  const { minSeconds, maxSeconds } = STREAMER_COMMENT_FREQUENCIES[frequency];
  const seconds = Math.floor(random() * (maxSeconds - minSeconds + 1)) + minSeconds;
  return seconds * 1_000;
}
