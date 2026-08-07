import { STREAMER_COMMENTS } from '../src/streamer/streamer-comment.data';
import { StreamerService } from '../src/streamer/streamer.service';

describe('StreamerService', () => {
  it('provides 1,000 unique built-in comments within the response limit', () => {
    expect(STREAMER_COMMENTS).toHaveLength(1_000);
    expect(new Set(STREAMER_COMMENTS).size).toBe(1_000);
    expect(STREAMER_COMMENTS.every((comment) => comment.length <= 60)).toBe(true);
  });

  it('returns an AI-generated comment when it is new', async () => {
    const aiClient = { generateStreamerComment: jest.fn().mockResolvedValue('最近ハマっている食べ物は？') };
    const service = new StreamerService(aiClient as never);

    await expect(service.createComment(['朝型と夜型ならどっち？'])).resolves.toEqual({ text: '最近ハマっている食べ物は？' });
  });

  it('uses an unused built-in comment when AI generation fails', async () => {
    const aiClient = { generateStreamerComment: jest.fn().mockResolvedValue(null) };
    const service = new StreamerService(aiClient as never);
    const recent = STREAMER_COMMENTS.slice(0, 10);

    const result = await service.createComment(recent);

    expect(STREAMER_COMMENTS).toContain(result.text);
    expect(recent).not.toContain(result.text);
  });
});
