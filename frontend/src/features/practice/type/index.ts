import type { ContentLanguage, Topic } from '../../../domain/practice';

export type PracticePhase = 'idle' | 'preparing' | 'speaking' | 'finishing';
export type PracticeState = { phase: PracticePhase; topic: Topic | null; elapsedSeconds: number };
export type PracticeOptions = { categoryId?: string; language: ContentLanguage };
export type PracticeMode = 'speech' | 'streamer' | 'reflex';
export type ReflexTrainingType = 'comment' | 'analogy';
