import { SpeechesService } from '../src/speeches/speeches.service';

describe('SpeechesService', () => {
  it('normalizes repository analytics values', async () => {
    const repository = {
      getOverview: jest.fn().mockResolvedValue({ totalSessions: '2', averageSeconds: '95.5', bestSeconds: '120' }),
      getCategoryStats: jest.fn().mockResolvedValue([{ categoryName: '好きなもの', color: '#818cf8', averageSeconds: '95.5', count: '2' }]),
      getMonthlyStats: jest.fn().mockResolvedValue([{ month: '2026-07', averageSeconds: '95.5', count: '2' }]),
      findRecent: jest.fn().mockResolvedValue([]),
    };
    const service = new SpeechesService(repository as never, {} as never);
    const result = await service.getAnalytics('standard');
    expect(result.totalSessions).toBe(2);
    expect(result.averageSeconds).toBe(95.5);
    expect(result.categoryStats[0].count).toBe(2);
  });

  it('omits category details from the all-mode summary', async () => {
    const repository = {
      getOverview: jest.fn().mockResolvedValue({ totalSessions: '3', averageSeconds: '80', bestSeconds: '140' }),
      getCategoryStats: jest.fn(),
      getMonthlyStats: jest.fn().mockResolvedValue([]),
      findRecent: jest.fn(),
    };
    const service = new SpeechesService(repository as never, {} as never);

    const result = await service.getAnalytics('all');

    expect(result.mode).toBe('all');
    expect(result.categoryStats).toEqual([]);
    expect(result.recentSpeeches).toEqual([]);
    expect(repository.getCategoryStats).not.toHaveBeenCalled();
    expect(repository.findRecent).not.toHaveBeenCalled();
  });
});
