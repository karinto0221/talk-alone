export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type ContentLanguage = 'ja' | 'en';

export type Topic = {
  text: string;
  categoryId: string;
  categoryName: string;
  language: ContentLanguage;
};

export type PracticeResult = {
  topic: string;
  categoryName: string;
  durationSeconds: number;
  completedAt: string;
  language: ContentLanguage;
};
