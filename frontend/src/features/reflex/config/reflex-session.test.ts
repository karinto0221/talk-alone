import { describe, expect, it } from 'vitest';
import {
  isReflexChallenge,
  REFLEX_CHALLENGE_ROUNDS,
  REFLEX_CHALLENGE_SECONDS,
  resolveReflexRoundCount,
} from './reflex-session';

describe('reflex session settings', () => {
  it('keeps free-practice round counts unchanged', () => {
    expect(resolveReflexRoundCount(5)).toBe(5);
    expect(resolveReflexRoundCount(10)).toBe(10);
  });

  it('uses five ten-second prompts for challenge mode', () => {
    expect(isReflexChallenge('challenge')).toBe(true);
    expect(resolveReflexRoundCount('challenge')).toBe(REFLEX_CHALLENGE_ROUNDS);
    expect(REFLEX_CHALLENGE_SECONDS).toBe(10);
  });
});
