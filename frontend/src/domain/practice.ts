export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type TopicMode = 'standard' | 'word';
export type ContentLanguage = 'ja' | 'en';

export type Topic = {
  text: string;
  categoryId: string;
  categoryName: string;
  mode: TopicMode;
  language: ContentLanguage;
};

export type PracticeResult = {
  topic: string;
  categoryName: string;
  mode: TopicMode;
  durationSeconds: number;
  completedAt: string;
  language: ContentLanguage;
};
