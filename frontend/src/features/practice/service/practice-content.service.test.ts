import { describe, expect, it } from 'vitest';
import { ANALOGY_PROMPT_VARIATION_COUNT } from '../../reflex/data/analogy-prompt.data';
import { STREAMER_COMMENTS } from '../../streamer/data/streamer-comment.data';
import { STREAMER_USERNAMES } from '../../streamer/data/streamer-user.data';
import { createRandomComment } from '../../streamer/service/streamer-content.service';
import { CATEGORIES } from '../data/category.data';
import { getHintCandidates } from '../data/hint.data';
import { TOPICS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';
import { ENGLISH_CATEGORIES, ENGLISH_TOPICS, ENGLISH_WORD_TOPICS, getEnglishHintCandidates } from '../data/english-practice.data';
import { ENGLISH_STREAMER_COMMENTS, ENGLISH_STREAMER_USERNAMES } from '../../streamer/data/english-streamer.data';
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
    const standard = createRandomTopic({ categoryId: 'daily', mode: 'standard', language: 'ja' });
    const word = createRandomTopic({ categoryId: 'favorites', mode: 'word', language: 'ja' });

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
    const first = createRandomHint('朝の過ごし方', 'daily', 'ja');
    const second = createRandomHint('朝の過ごし方', 'daily', 'ja', first);

    expect(first.length).toBeGreaterThan(0);
    expect(second).not.toBe(first);
  });

  it('bundles natural English practice content for every category', () => {
    expect(listCategories('en')).toEqual(ENGLISH_CATEGORIES);
    for (const category of ENGLISH_CATEGORIES) {
      expect(ENGLISH_TOPICS[category.id]).toHaveLength(100);
      expect(new Set(ENGLISH_TOPICS[category.id]).size).toBe(100);
      expect(ENGLISH_WORD_TOPICS[category.id]).toHaveLength(60);
      expect(new Set(ENGLISH_WORD_TOPICS[category.id]).size).toBe(60);
      expect(getEnglishHintCandidates(category.id, 'a test topic')).toHaveLength(40);
    }

    const topic = createRandomTopic({ categoryId: 'daily', mode: 'standard', language: 'en' });
    const hint = createRandomHint(topic.text, topic.categoryId, 'en');
    expect(topic.language).toBe('en');
    expect(ENGLISH_TOPICS.daily).toContain(topic.text);
    expect(hint).toMatch(/[A-Za-z]/);
  });

  it('bundles varied English chat comments and usernames', () => {
    expect(ENGLISH_STREAMER_COMMENTS).toHaveLength(1_000);
    expect(new Set(ENGLISH_STREAMER_COMMENTS).size).toBe(1_000);
    expect(ENGLISH_STREAMER_USERNAMES.length).toBeGreaterThan(600);
    expect(new Set(ENGLISH_STREAMER_USERNAMES).size).toBe(ENGLISH_STREAMER_USERNAMES.length);
    const recent = ENGLISH_STREAMER_COMMENTS.slice(0, 10);
    expect(recent).not.toContain(createRandomComment(recent, 'en'));
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
