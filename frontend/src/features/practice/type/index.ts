import type { Topic } from '../../../api';

export type PracticePhase = 'idle' | 'preparing' | 'speaking' | 'saving' | 'complete';
export type PracticeState = { phase: PracticePhase; topic: Topic | null; elapsedSeconds: number; hint: string; helpCount: number };
