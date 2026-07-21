import { TopicsService } from '../src/topics/topics.service';

const category = {
  id: 'daily',
  name: '日常・暮らし',
  description: '身近な話題',
};

describe('TopicsService', () => {
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
});
