import type { Topic, TopicMode } from '../../../api';

export type PracticePhase = 'idle' | 'preparing' | 'speaking' | 'saving';
export type PracticeState = { phase: PracticePhase; topic: Topic | null; elapsedSeconds: number; hint: string; helpCount: number };
export type PracticeOptions = { categoryId?: string; mode: TopicMode };
export type PracticeMode = TopicMode | 'streamer';
