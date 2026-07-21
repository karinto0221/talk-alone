export const SPEECH_MODES = ['standard', 'word'] as const;
export type SpeechMode = (typeof SPEECH_MODES)[number];

export const ANALYTICS_MODES = ['all', ...SPEECH_MODES] as const;
export type AnalyticsMode = (typeof ANALYTICS_MODES)[number];
