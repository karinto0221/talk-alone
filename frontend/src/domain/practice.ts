export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type TopicMode = 'standard' | 'word';

export type Topic = {
  text: string;
  categoryId: string;
  categoryName: string;
  mode: TopicMode;
};

export type PracticeResult = {
  topic: string;
  categoryName: string;
  mode: TopicMode;
  durationSeconds: number;
  completedAt: string;
};
