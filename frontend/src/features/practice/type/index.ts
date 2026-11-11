import type { ContentLanguage, Topic, TopicMode } from '../../../domain/practice';

export type PracticePhase = 'idle' | 'preparing' | 'speaking' | 'finishing';
export type PracticeState = { phase: PracticePhase; topic: Topic | null; elapsedSeconds: number; hint: string };
export type PracticeOptions = { categoryId?: string; mode: TopicMode; language: ContentLanguage };
export type PracticeMode = TopicMode | 'streamer' | 'reflex';
export type ReflexTrainingType = 'comment' | 'analogy';
