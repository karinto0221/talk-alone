export type Category = { id: string; name: string; description: string; color: string; displayOrder: number };
export type TopicMode = 'standard' | 'word';
export type Topic = { text: string; categoryId: string; categoryName: string; mode: TopicMode };
export type Speech = {
  id: string;
  topic: string;
  categoryId: string;
  categoryName: string;
  mode: TopicMode;
  durationSeconds: number;
  helpCount: number;
  completedAt: string;
};
export type AnalyticsMode = 'all' | TopicMode;
export type Analytics = {
  mode: AnalyticsMode;
  totalSessions: number;
  averageSeconds: number;
  bestSeconds: number;
  categoryStats: Array<{ categoryName: string; color: string; averageSeconds: number; count: number }>;
  monthlyStats: Array<{ month: string; averageSeconds: number; count: number }>;
  recentSpeeches: Speech[];
};
export type CreateSpeechRequest = Pick<Speech, 'topic' | 'categoryId' | 'mode' | 'durationSeconds' | 'helpCount'>;
export type SpeechAnalysis = {
  transcript: string;
  score: number;
  scoreBreakdown: {
    relevance: number;
    structure: number;
    specificity: number;
    coherence: number;
    expression: number;
  };
  summary: string;
  strengths: string[];
  improvements: string[];
  nextChallenge: string;
};
export type StreamerComment = { text: string };
