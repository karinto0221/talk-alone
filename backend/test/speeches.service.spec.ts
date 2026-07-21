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
    const result = await service.getAnalytics();
    expect(result.totalSessions).toBe(2);
    expect(result.averageSeconds).toBe(95.5);
    expect(result.categoryStats[0].count).toBe(2);
  });
});
