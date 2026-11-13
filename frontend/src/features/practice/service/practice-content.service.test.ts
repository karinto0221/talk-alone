import { describe, expect, it } from 'vitest';
import { ANALOGY_PROMPT_VARIATION_COUNT } from '../../reflex/data/analogy-prompt.data';
import { STREAMER_COMMENTS } from '../../streamer/data/streamer-comment.data';
import { STREAMER_USERNAMES } from '../../streamer/data/streamer-user.data';
import { createRandomComment } from '../../streamer/service/streamer-content.service';
import { CATEGORIES } from '../data/category.data';
import { TOPIC_SEEDS } from '../data/standard-topic.data';
import { WORD_TOPICS } from '../data/word-topic.data';
import { ENGLISH_CATEGORIES, ENGLISH_TOPIC_SEEDS, ENGLISH_WORD_TOPICS } from '../data/english-practice.data';
import { ENGLISH_STREAMER_COMMENTS, ENGLISH_STREAMER_USERNAMES } from '../../streamer/data/english-streamer.data';
import { createRandomTopic, listCategories } from './practice-content.service';

describe('offline practice content', () => {
  it('bundles every category and its expected topic data', () => {
    expect(listCategories()).toHaveLength(10);
    for (const category of CATEGORIES) {
      expect(TOPIC_SEEDS[category.id]).toHaveLength(40);
      expect(new Set(TOPIC_SEEDS[category.id]).size).toBe(40);
      expect(WORD_TOPICS[category.id]).toHaveLength(500);
      expect(new Set(WORD_TOPICS[category.id]).size).toBe(500);
    }
  });

  it('keeps topic seeds unformatted', () => {
    expect(TOPIC_SEEDS.daily).toContain('朝の過ごし方');
    expect(TOPIC_SEEDS.daily).not.toContain('朝の過ごし方で大切にしていることは？');
    expect(TOPIC_SEEDS.favorites).toContain('嫌いな食べ物');
  });

  it('chooses uniformly from the merged seed and word pool', () => {
    const topic = createRandomTopic({ categoryId: 'daily', language: 'ja' });
    const candidates = [...new Set([...TOPIC_SEEDS.daily, ...WORD_TOPICS.daily])];

    expect(topic.categoryId).toBe('daily');
    expect(candidates).toContain(topic.text);
  });

  it('uses curated word entries instead of mechanically prefixed words', () => {
    expect(WORD_TOPICS.values).not.toContain('絶対希望');
    expect(WORD_TOPICS.daily).not.toContain('透明椅子');
    expect(WORD_TOPICS.favorites).not.toContain('巨大珈琲');
  });

  it('bundles natural English practice content for every category', () => {
    expect(listCategories('en')).toEqual(ENGLISH_CATEGORIES);
    for (const category of ENGLISH_CATEGORIES) {
      expect(ENGLISH_TOPIC_SEEDS[category.id]).toHaveLength(40);
      expect(new Set(ENGLISH_TOPIC_SEEDS[category.id]).size).toBe(40);
      expect(ENGLISH_WORD_TOPICS[category.id]).toHaveLength(60);
      expect(new Set(ENGLISH_WORD_TOPICS[category.id]).size).toBe(60);
    }

    const topic = createRandomTopic({ categoryId: 'daily', language: 'en' });
    const candidates = [...new Set([...ENGLISH_TOPIC_SEEDS.daily, ...ENGLISH_WORD_TOPICS.daily])];
    expect(topic.language).toBe('en');
    expect(candidates).toContain(topic.text);
  });

  it('bundles varied English chat comments and usernames', () => {
    expect(ENGLISH_STREAMER_COMMENTS).toHaveLength(1_000);
    expect(new Set(ENGLISH_STREAMER_COMMENTS).size).toBe(1_000);
    expect(ENGLISH_STREAMER_USERNAMES.length).toBeGreaterThan(600);
    expect(new Set(ENGLISH_STREAMER_USERNAMES).size).toBe(ENGLISH_STREAMER_USERNAMES.length);
    const recent = ENGLISH_STREAMER_COMMENTS.slice(0, 10);
    expect(recent).not.toContain(createRandomComment(recent, 'en'));
  });

  it('bundles 1,000 unique comments without generic prefix variants and avoids recent comments', () => {
    expect(STREAMER_COMMENTS).toHaveLength(1_000);
    expect(new Set(STREAMER_COMMENTS).size).toBe(1_000);
    expect(STREAMER_COMMENTS.some((comment) => comment.startsWith('そういえば、'))).toBe(false);
    expect(STREAMER_COMMENTS.some((comment) => comment.startsWith('全然関係ないけど、'))).toBe(false);
    expect(STREAMER_COMMENTS.some((comment) => comment.startsWith('急に思い出した。'))).toBe(false);
    expect(STREAMER_COMMENTS.some((comment) => comment.startsWith('今これだけ言いたかった。'))).toBe(false);

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
