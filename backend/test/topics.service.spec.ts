import { TopicsService } from '../src/topics/topics.service';
import { getHintCandidates } from '../src/topics/data/hint.data';
import { TOPICS } from '../src/topics/data/standard-topic.data';
import { WORD_TOPICS } from '../src/topics/data/word-topic.data';

const category = {
  id: 'daily',
  name: '日常・暮らし',
  description: '身近な話題',
};

describe('TopicsService', () => {
  it('provides 100 unique standard and word fallbacks for every category', () => {
    expect(Object.keys(TOPICS)).toHaveLength(10);
    expect(Object.keys(WORD_TOPICS)).toEqual(Object.keys(TOPICS));

    for (const categoryId of Object.keys(TOPICS)) {
      expect(TOPICS[categoryId]).toHaveLength(100);
      expect(new Set(TOPICS[categoryId]).size).toBe(100);
      expect(WORD_TOPICS[categoryId]).toHaveLength(100);
      expect(new Set(WORD_TOPICS[categoryId]).size).toBe(100);
      expect(WORD_TOPICS[categoryId].every((word) => !/[\s、。,.!?！？「」『』（）()]/u.test(word))).toBe(true);
    }
  });

  it('provides 40 topic-aware hint fallbacks for every category', () => {
    for (const categoryId of Object.keys(TOPICS)) {
      const hints = getHintCandidates(categoryId, 'テストのお題');
      expect(hints).toHaveLength(40);
      expect(new Set(hints).size).toBe(40);
      expect(hints.every((hint) => hint.includes('テストのお題'))).toBe(true);
    }
  });

  it('uses the selected category and its fallback pool in word mode', async () => {
    const categories = {
      findById: jest.fn().mockResolvedValue(category),
      findRandom: jest.fn(),
    };
    const aiClient = { generateWord: jest.fn().mockResolvedValue(null) };
    const service = new TopicsService(categories as never, aiClient as never);

    const result = await service.getRandomTopic('daily', 'word');

    expect(categories.findById).toHaveBeenCalledWith('daily');
    expect(categories.findRandom).not.toHaveBeenCalled();
    expect(result.mode).toBe('word');
    expect(result.categoryId).toBe('daily');
    expect(result.text).not.toMatch(/[\s、。,.!?！？]/u);
  });

  it('chooses a category at random in word mode when categoryId is omitted', async () => {
    const categories = {
      findById: jest.fn(),
      findRandom: jest.fn().mockResolvedValue(category),
    };
    const aiClient = { generateWord: jest.fn().mockResolvedValue('椅子') };
    const service = new TopicsService(categories as never, aiClient as never);

    const result = await service.getRandomTopic(undefined, 'word');

    expect(categories.findRandom).toHaveBeenCalled();
    expect(aiClient.generateWord).toHaveBeenCalledWith(category);
    expect(result).toMatchObject({ text: '椅子', categoryId: 'daily', mode: 'word' });
  });

  it('chooses a category at random when categoryId is omitted', async () => {
    const categories = {
      findById: jest.fn(),
      findRandom: jest.fn().mockResolvedValue(category),
    };
    const aiClient = { generateTopic: jest.fn().mockResolvedValue('朝の時間') };
    const service = new TopicsService(categories as never, aiClient as never);

    const result = await service.getRandomTopic(undefined, 'standard');

    expect(categories.findRandom).toHaveBeenCalled();
    expect(result.text).toBe('朝の時間');
    expect(result.mode).toBe('standard');
  });

  it('uses a topic-aware fallback when hint generation fails', async () => {
    const categories = {
      findById: jest.fn().mockResolvedValue(category),
    };
    const aiClient = { generateHint: jest.fn().mockResolvedValue(null) };
    const service = new TopicsService(categories as never, aiClient as never);

    const result = await service.createHint('朝の時間', 'daily');

    expect(result.question).toContain('朝の時間');
  });
});
