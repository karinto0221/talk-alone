import type { Category, Topic, TopicMode } from '../../../domain/practice';
import { CATEGORIES } from '../data/category.data';
import { getHintCandidates } from '../data/hint.data';
import { TOPICS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';

const sample = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export function listCategories(): readonly Category[] {
  return CATEGORIES;
}

export function createRandomTopic(options: { categoryId?: string; mode: TopicMode }): Topic {
  const category = options.categoryId
    ? CATEGORIES.find((item) => item.id === options.categoryId)
    : sample(CATEGORIES);
  if (!category) throw new Error('選択したジャンルが見つかりません。');

  const candidates = options.mode === 'word' ? WORD_TOPICS[category.id] : TOPICS[category.id];
  if (!candidates?.length) throw new Error('利用できるお題がありません。');

  return {
    text: sample(candidates),
    categoryId: category.id,
    categoryName: category.name,
    mode: options.mode,
  };
}

export function createRandomHint(topic: string, categoryId: string, previousHint?: string): string {
  const hints = getHintCandidates(categoryId, topic);
  const candidates = hints.filter((hint) => hint !== previousHint);
  return sample(candidates.length > 0 ? candidates : hints);
}
