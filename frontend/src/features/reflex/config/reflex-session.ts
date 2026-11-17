import type { ReflexRoundSetting } from '../../practice/type';

export const REFLEX_CHALLENGE_ROUNDS = 5;
export const REFLEX_CHALLENGE_SECONDS = 10;

export const isReflexChallenge = (setting: ReflexRoundSetting) => setting === 'challenge';

export const resolveReflexRoundCount = (setting: ReflexRoundSetting) => (
  isReflexChallenge(setting) ? REFLEX_CHALLENGE_ROUNDS : setting
);
