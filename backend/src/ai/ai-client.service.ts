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
      `日本語の3分間スピーチ用のお題を1つ作成してください。ジャンルは「${category.name}」、説明は「${category.description}」です。身近な題材または考えを深める問いにし、話しやすく、センシティブすぎない内容にしてください。`,
      'topic',
    );
  }

  async generateWord(category: CategoryEntity): Promise<string | null> {
    const topic = await this.request(
      `日本語の3分間スピーチ用に、連想を広げられる名詞または概念をランダムに1単語だけ作成してください。ジャンルは「${category.name}」、説明は「${category.description}」です。説明、助詞、空白、句読点、括弧、疑問符は含めないでください。賛否を考えるジャンルの場合は、校則、制服、SNSのように意見を展開できる名詞を選んでください。幅広い語彙から選び、例をそのまま優先しないでください。`,
      'topic',
    );
    return topic && this.isSingleWord(topic) ? topic : null;
  }

  generateHint(topic: string, category: CategoryEntity) {
    return this.request(
      `3分間スピーチのお題は「${topic}」、ジャンルは「${category.name}」です。話を続けるための具体的で短い質問を1つ作成してください。`,
      'question',
    );
  }

  private async request(prompt: string, key: keyof AiResult): Promise<string | null> {
    if (!this.apiKey) return null;
    const result = await this.requestJson(prompt, `${key}キーだけ`);
    return result[key]?.trim() || null;
  }

  private async requestJson(prompt: string, responseKeys: string): Promise<AiResult> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          temperature: 1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: `日本語のスピーチコーチとして、${responseKeys}を持つJSONだけを返してください。` },
            { role: 'user', content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return {};
      const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = body.choices?.[0]?.message?.content;
      if (!content) return {};
      return JSON.parse(content) as AiResult;
    } catch {
      return {};
    }
  }

  private isSingleWord(value: string) {
    return value.length <= 24 && !/[\s、。,.!?！？「」『』（）()]/u.test(value);
  }
}
