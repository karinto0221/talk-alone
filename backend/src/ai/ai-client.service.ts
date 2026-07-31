import { Injectable } from '@nestjs/common';
import type { CategoryEntity } from '../categories/category.entity';

type AiResult = { topic?: string; question?: string };
export type SpeechFeedback = {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextChallenge: string;
};

export type AudioInput = {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
};

@Injectable()
export class AiClientService {
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly baseUrl = (process.env.AI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  private readonly model = process.env.AI_MODEL ?? 'gpt-4.1-mini';
  private readonly transcriptionModel = process.env.AI_TRANSCRIPTION_MODEL ?? 'gpt-4o-mini-transcribe';

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

  async transcribeAudio(audio: AudioInput): Promise<string | null> {
    if (!this.apiKey) return null;
    try {
      const form = new FormData();
      form.append('file', new Blob([new Uint8Array(audio.buffer)], { type: audio.mimeType }), audio.fileName);
      form.append('model', this.transcriptionModel);
      form.append('language', 'ja');
      form.append('response_format', 'json');
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}` },
        body: form,
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) return null;
      const body = (await response.json()) as { text?: string };
      return body.text?.trim() || null;
    } catch {
      return null;
    }
  }

  async analyzeSpeech(input: {
    transcript: string;
    topic: string;
    categoryName: string;
    durationSeconds: number;
  }): Promise<SpeechFeedback | null> {
    if (!this.apiKey) return null;
    const result = await this.requestJson<Partial<SpeechFeedback>>(
      `以下はスピーチの文字起こしです。\nお題: ${input.topic}\nジャンル: ${input.categoryName}\nスピーチ時間: ${input.durationSeconds}秒\n\n文字起こし:\n${input.transcript}\n\n内容と構成だけを分析してください。音量、声質、発音、話す速さなど、文字起こしから判断できない要素は評価しないでください。要約、良かった点、改善点、次回試す具体的な課題を、簡潔で実行しやすい日本語で返してください。`,
      'summary（文字列）、strengths（文字列配列）、improvements（文字列配列）、nextChallenge（文字列）キー',
      0.4,
    );
    if (
      typeof result.summary !== 'string' ||
      !Array.isArray(result.strengths) ||
      !result.strengths.every((item) => typeof item === 'string') ||
      !Array.isArray(result.improvements) ||
      !result.improvements.every((item) => typeof item === 'string') ||
      typeof result.nextChallenge !== 'string'
    ) return null;
    return {
      summary: result.summary.trim(),
      strengths: result.strengths.map((item) => item.trim()).filter(Boolean),
      improvements: result.improvements.map((item) => item.trim()).filter(Boolean),
      nextChallenge: result.nextChallenge.trim(),
    };
  }

  private async request(prompt: string, key: keyof AiResult): Promise<string | null> {
    if (!this.apiKey) return null;
    const result = await this.requestJson(prompt, `${key}キーだけ`);
    return result[key]?.trim() || null;
  }

  private async requestJson<T extends object = AiResult>(prompt: string, responseKeys: string, temperature = 1): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          temperature,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: `日本語のスピーチコーチとして、${responseKeys}を持つJSONだけを返してください。` },
            { role: 'user', content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return {} as T;
      const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = body.choices?.[0]?.message?.content;
      if (!content) return {} as T;
      return JSON.parse(content) as T;
    } catch {
      return {} as T;
    }
  }

  private isSingleWord(value: string) {
    return value.length <= 24 && !/[\s、。,.!?！？「」『』（）()]/u.test(value);
  }
}
