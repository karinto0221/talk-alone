import { AiClientService } from '../src/ai/ai-client.service';

describe('AiClientService', () => {
  const originalApiKey = process.env.AI_API_KEY;
  const originalFetch = global.fetch;

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
  });

  it('requests five 20-point scores and calculates the 100-point total', async () => {
    process.env.AI_API_KEY = 'test-key';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          scoreBreakdown: { relevance: 18, structure: 17, specificity: 16, coherence: 15, expression: 16 },
          summary: '要点が明確です。',
          strengths: ['具体例がある'],
          improvements: ['結論を強める'],
          nextChallenge: '冒頭で結論を述べる',
        }) } }],
      }),
    });
    global.fetch = fetchMock as never;
    const service = new AiClientService();

    const result = await service.analyzeSpeech({
      transcript: '具体例を交えて話しました。',
      topic: '最近うれしかったこと',
      categoryName: '日常',
      durationSeconds: 90,
    });

    const request = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      response_format: { type: string; json_schema: { schema: { properties: { scoreBreakdown: { properties: { expression: object } } } } } };
    };
    expect(request.response_format.type).toBe('json_schema');
    expect(request.response_format.json_schema.schema.properties.scoreBreakdown.properties.expression).toEqual({ type: 'integer', minimum: 0, maximum: 20 });
    expect(result?.score).toBe(82);
    expect(result?.scoreBreakdown.structure).toBe(17);
  });

  it('requests a structured streamer comment', async () => {
    process.env.AI_API_KEY = 'test-key';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({ comment: '最近よく聴いている曲は？' }) } }] }),
    });
    global.fetch = fetchMock as never;
    const service = new AiClientService();

    const result = await service.generateStreamerComment(['最近のマイブームは？']);

    const request = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      response_format: { type: string; json_schema: { name: string } };
      messages: Array<{ role: string; content: string }>;
    };
    expect(request.response_format).toMatchObject({ type: 'json_schema', json_schema: { name: 'streamer_comment' } });
    expect(request.messages[0].content).toContain('多数の視聴者');
    expect(request.messages[1].content).toContain('今回のコメント種別');
    expect(request.messages[1].content).toContain('今回の発想のきっかけ');
    expect(request.messages[1].content).toContain('質問以外の種別では疑問形や問いかけを付けない');
    expect(result).toBe('最近よく聴いている曲は？');
  });
});
