import type { Category, ContentLanguage, Topic } from '../../../domain/practice';
import { CATEGORIES } from '../data/category.data';
import { ENGLISH_CATEGORIES, ENGLISH_TOPIC_SEEDS, ENGLISH_WORD_TOPICS } from '../data/english-practice.data';
import { TOPIC_SEEDS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';

const sample = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export function listCategories(language: ContentLanguage = 'ja'): readonly Category[] {
  return language === 'en' ? ENGLISH_CATEGORIES : CATEGORIES;
}

export function createRandomTopic(options: { categoryId?: string; language: ContentLanguage }): Topic {
  const categories = listCategories(options.language);
  const category = options.categoryId
    ? categories.find((item) => item.id === options.categoryId)
    : sample(categories);
  if (!category) throw new Error(options.language === 'en' ? 'The selected category was not found.' : '選択したジャンルが見つかりません。');

  const topicSeeds = options.language === 'en' ? ENGLISH_TOPIC_SEEDS : TOPIC_SEEDS;
  const wordTopics = options.language === 'en' ? ENGLISH_WORD_TOPICS : WORD_TOPICS;
  const candidates = [...new Set([
    ...(topicSeeds[category.id] ?? []),
    ...(wordTopics[category.id] ?? []),
  ])];
  if (!candidates?.length) throw new Error(options.language === 'en' ? 'No prompts are available.' : '利用できるお題がありません。');

  return {
    text: sample(candidates),
    categoryId: category.id,
    categoryName: category.name,
    language: options.language,
  };
}
