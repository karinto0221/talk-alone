import { SpeechesService } from '../src/speeches/speeches.service';

describe('SpeechesService', () => {
  it('normalizes repository analytics values', async () => {
    const repository = {
      getOverview: jest.fn().mockResolvedValue({ totalSessions: '2', averageSeconds: '95.5', bestSeconds: '120' }),
      getCategoryStats: jest.fn().mockResolvedValue([{ categoryName: '好きなもの', color: '#818cf8', averageSeconds: '95.5', count: '2' }]),
      getMonthlyStats: jest.fn().mockResolvedValue([{ month: '2026-07', averageSeconds: '95.5', count: '2' }]),
      findRecent: jest.fn().mockResolvedValue([]),
    };
    const service = new SpeechesService(repository as never, {} as never, {} as never);
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
    const service = new SpeechesService(repository as never, {} as never, {} as never);

    const result = await service.getAnalytics('all');

    expect(result.mode).toBe('all');
    expect(result.categoryStats).toEqual([]);
    expect(result.recentSpeeches).toEqual([]);
    expect(repository.getCategoryStats).not.toHaveBeenCalled();
    expect(repository.findRecent).not.toHaveBeenCalled();
  });

  it('transcribes a temporary recording and returns AI feedback without persisting audio', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue({
        id: '1c90055c-98db-4bf2-93c1-207257bad84b',
        topic: '最近うれしかったこと',
        category: { name: '日常' },
        durationSeconds: 90,
      }),
    };
    const aiClient = {
      transcribeAudio: jest.fn().mockResolvedValue('今日はうれしかった出来事について話します。'),
      analyzeSpeech: jest.fn().mockResolvedValue({
        summary: '出来事を順序立てて説明しています。',
        strengths: ['具体例がある'],
        improvements: ['結論を明確にする'],
        nextChallenge: '最初に結論を述べる',
      }),
    };
    const service = new SpeechesService(repository as never, {} as never, aiClient as never);

    const result = await service.analyze('1c90055c-98db-4bf2-93c1-207257bad84b', {
      buffer: Buffer.from('audio'),
      mimetype: 'audio/webm',
      originalname: 'speech.webm',
      size: 5,
    });

    expect(result.transcript).toContain('うれしかった');
    expect(result.strengths).toEqual(['具体例がある']);
    expect(aiClient.transcribeAudio).toHaveBeenCalledTimes(1);
  });
});
