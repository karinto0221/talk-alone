import { describe, expect, it } from 'vitest';
import { createCommentDelayMs } from './comment-frequency';

describe('streamer comment frequency', () => {
  it.each([
    ['high', 10_000, 30_000],
    ['normal', 60_000, 180_000],
    ['low', 180_000, 300_000],
  ] as const)('%s stays within its configured range', (frequency, minimum, maximum) => {
    expect(createCommentDelayMs(frequency, () => 0)).toBe(minimum);
    expect(createCommentDelayMs(frequency, () => 0.999_999)).toBe(maximum);
  });
});
