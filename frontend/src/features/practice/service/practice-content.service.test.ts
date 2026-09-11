import { describe, expect, it } from 'vitest';
import { ANALOGY_PROMPT_VARIATION_COUNT } from '../../reflex/data/analogy-prompt.data';
import { STREAMER_COMMENTS } from '../../streamer/data/streamer-comment.data';
import { STREAMER_USERNAMES } from '../../streamer/data/streamer-user.data';
import { createRandomComment } from '../../streamer/service/streamer-content.service';
import { CATEGORIES } from '../data/category.data';
import { getHintCandidates } from '../data/hint.data';
import { TOPICS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';
import { createRandomHint, createRandomTopic, listCategories } from './practice-content.service';

describe('offline practice content', () => {
  it('bundles every category and its expected topic data', () => {
    expect(listCategories()).toHaveLength(10);
    for (const category of CATEGORIES) {
      expect(TOPICS[category.id]).toHaveLength(500);
      expect(new Set(TOPICS[category.id]).size).toBe(500);
      expect(WORD_TOPICS[category.id]).toHaveLength(500);
      expect(new Set(WORD_TOPICS[category.id]).size).toBe(500);
      expect(getHintCandidates(category.id, 'テスト')).toHaveLength(200);
      expect(new Set(getHintCandidates(category.id, 'テスト')).size).toBe(200);
    }
  });

  it('creates topics locally for the selected category and mode', () => {
    const standard = createRandomTopic({ categoryId: 'daily', mode: 'standard' });
    const word = createRandomTopic({ categoryId: 'favorites', mode: 'word' });

    expect(standard.categoryId).toBe('daily');
    expect(standard.mode).toBe('standard');
    expect(TOPICS.daily).toContain(standard.text);
    expect(word.categoryId).toBe('favorites');
    expect(word.mode).toBe('word');
    expect(WORD_TOPICS.favorites).toContain(word.text);
  });

  it('uses curated word entries instead of mechanically prefixed words', () => {
    expect(WORD_TOPICS.values).not.toContain('絶対希望');
    expect(WORD_TOPICS.daily).not.toContain('透明椅子');
    expect(WORD_TOPICS.favorites).not.toContain('巨大珈琲');
  });

  it('creates hints without network access and avoids the previous hint', () => {
    const first = createRandomHint('朝の過ごし方', 'daily');
    const second = createRandomHint('朝の過ごし方', 'daily', first);

    expect(first.length).toBeGreaterThan(0);
    expect(second).not.toBe(first);
  });

  it('bundles 5,000 unique comments and avoids recent comments', () => {
    expect(STREAMER_COMMENTS).toHaveLength(5_000);
    expect(new Set(STREAMER_COMMENTS).size).toBe(5_000);

    const recent = STREAMER_COMMENTS.slice(0, 10);
    expect(recent).not.toContain(createRandomComment(recent));
  });

  it('bundles expanded streamer names and analogy variations', () => {
    expect(STREAMER_USERNAMES).toHaveLength(5_000);
    expect(new Set(STREAMER_USERNAMES).size).toBe(5_000);
    expect(STREAMER_USERNAMES.every((username) => username.length <= 20)).toBe(true);
    expect(ANALOGY_PROMPT_VARIATION_COUNT).toBe(2_380);
  });
});
