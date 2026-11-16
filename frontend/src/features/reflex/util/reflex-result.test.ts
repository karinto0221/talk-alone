import { describe, expect, it } from 'vitest';
import { summarizeReflexAttempts } from './reflex-result';

describe('summarizeReflexAttempts', () => {
  it('summarizes response time across prompts', () => {
    const summary = summarizeReflexAttempts([
      { prompt: 'one', responseSeconds: 2 },
      { prompt: 'two', responseSeconds: 4 },
      { prompt: 'three', responseSeconds: 9 },
    ]);

    expect(summary).toEqual({ averageSeconds: 5, fastestSeconds: 2, slowestSeconds: 9, totalSeconds: 15 });
  });
});
