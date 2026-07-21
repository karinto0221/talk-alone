import { SpeechesRepository } from '../src/speeches/speeches.repository';

describe('SpeechesRepository', () => {
  it('orders recent entity results by the entity property path', async () => {
    const query = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    const typeormRepository = { createQueryBuilder: jest.fn().mockReturnValue(query) };
    const repository = new SpeechesRepository(typeormRepository as never);

    await repository.findRecent(20, 'word');

    expect(query.orderBy).toHaveBeenCalledWith('speech.completedAt', 'DESC');
    expect(query.andWhere).toHaveBeenCalledWith('speech.mode = :mode', { mode: 'word' });
  });
});
