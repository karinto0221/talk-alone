import type { Category, ContentLanguage, Topic, TopicMode } from '../../../domain/practice';
import { CATEGORIES } from '../data/category.data';
import { ENGLISH_CATEGORIES, ENGLISH_TOPICS, ENGLISH_WORD_TOPICS, getEnglishHintCandidates } from '../data/english-practice.data';
import { getHintCandidates } from '../data/hint.data';
import { TOPICS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';

const sample = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export function listCategories(language: ContentLanguage = 'ja'): readonly Category[] {
  return language === 'en' ? ENGLISH_CATEGORIES : CATEGORIES;
}

export function createRandomTopic(options: { categoryId?: string; mode: TopicMode; language: ContentLanguage }): Topic {
  const categories = listCategories(options.language);
  const category = options.categoryId
    ? categories.find((item) => item.id === options.categoryId)
    : sample(categories);
  if (!category) throw new Error(options.language === 'en' ? 'The selected category was not found.' : '選択したジャンルが見つかりません。');

  const topics = options.language === 'en' ? ENGLISH_TOPICS : TOPICS;
  const wordTopics = options.language === 'en' ? ENGLISH_WORD_TOPICS : WORD_TOPICS;
  const candidates = options.mode === 'word' ? wordTopics[category.id] : topics[category.id];
  if (!candidates?.length) throw new Error(options.language === 'en' ? 'No prompts are available.' : '利用できるお題がありません。');

  return {
    text: sample(candidates),
    categoryId: category.id,
    categoryName: category.name,
    mode: options.mode,
    language: options.language,
  };
}

export function createRandomHint(topic: string, categoryId: string, language: ContentLanguage, previousHint?: string): string {
  const hints = language === 'en' ? getEnglishHintCandidates(categoryId, topic) : getHintCandidates(categoryId, topic);
  const candidates = hints.filter((hint) => hint !== previousHint);
  return sample(candidates.length > 0 ? candidates : hints);
}
