export type Category = { id: string; name: string; description: string; color: string; displayOrder: number };
export type Topic = { text: string; categoryId: string; categoryName: string };
export type Speech = {
  id: string;
  topic: string;
  categoryId: string;
  categoryName: string;
  durationSeconds: number;
  helpCount: number;
  completedAt: string;
};
export type Analytics = {
  totalSessions: number;
  averageSeconds: number;
  bestSeconds: number;
  categoryStats: Array<{ categoryName: string; color: string; averageSeconds: number; count: number }>;
  monthlyStats: Array<{ month: string; averageSeconds: number; count: number }>;
  recentSpeeches: Speech[];
};
export type CreateSpeechRequest = Pick<Speech, 'topic' | 'categoryId' | 'durationSeconds' | 'helpCount'>;
