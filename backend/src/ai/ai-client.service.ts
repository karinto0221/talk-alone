import { Injectable } from '@nestjs/common';
import type { CategoryEntity } from '../categories/category.entity';

type AiResult = { topic?: string; question?: string };

@Injectable()
export class AiClientService {
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly baseUrl = (process.env.AI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  private readonly model = process.env.AI_MODEL ?? 'gpt-4.1-mini';

  generateTopic(category: CategoryEntity) {
    return this.request(
      `日本語の3分間スピーチ用のお題を1つ作成してください。ジャンルは「${category.name}」、説明は「${category.description}」です。単語だけのお題、または考えを深める問いのどちらでも構いません。話しやすく、センシティブすぎない内容にしてください。`,
      'topic',
    );
  }

  generateHint(topic: string, category: CategoryEntity) {
    return this.request(
      `3分間スピーチのお題は「${topic}」、ジャンルは「${category.name}」です。話を続けるための具体的で短い質問を1つ作成してください。`,
      'question',
    );
  }

  private async request(prompt: string, key: keyof AiResult): Promise<string | null> {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          temperature: 1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: `日本語のスピーチコーチとして、${key}キーだけを持つJSONを返してください。` },
            { role: 'user', content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return null;
      const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = body.choices?.[0]?.message?.content;
      if (!content) return null;
      return (JSON.parse(content) as AiResult)[key]?.trim() || null;
    } catch {
      return null;
    }
  }
}
