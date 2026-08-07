import { Injectable } from "@nestjs/common";
import type { CategoryEntity } from "../categories/category.entity";

type AiResult = { topic?: string; question?: string };

const STREAMER_COMMENT_STYLES = [
  "素朴な質問: 身近なことを短く尋ねる",
  "二択: 定番すぎない2つを比べて好みを尋ねる",
  "今日の報告: 視聴者自身に起きた小さな出来事を、質問せずに話す",
  "どうでもいい発見: 日常で気づいた些細なことを、質問せずに報告する",
  "軽い相談: 視聴者が迷っていることについて意見を求める",
  "奇妙な仮定: 現実にはまず起きない状況を想像して尋ねる",
  "思い出: ふと思い出した昔の出来事を、質問せずに話す",
  "短い主張: 好き嫌いや持論を一方的に書き、質問は付けない",
] as const;

const STREAMER_COMMENT_SEEDS = [
  "コンビニ", "信号待ち", "冷蔵庫", "傘", "靴下", "給食", "深夜",
  "自動販売機", "電車", "目玉焼き", "写真", "公園", "眠気", "レシート",
  "動物", "文房具", "天気", "知らない街", "お風呂", "ゲーム", "夢",
  "エレベーター", "冷凍食品", "髪型", "子どもの頃", "イヤホン", "旅行",
  "曜日", "匂い", "家具", "季節", "名前", "行列", "音", "お菓子",
] as const;

const sample = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];
export type SpeechScoreBreakdown = {
  relevance: number;
  structure: number;
  specificity: number;
  coherence: number;
  expression: number;
};

export type SpeechFeedback = {
  score: number;
  scoreBreakdown: SpeechScoreBreakdown;
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
  private readonly baseUrl = (
    process.env.AI_BASE_URL ?? "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  private readonly model = process.env.AI_MODEL ?? "gpt-4.1-mini";
  private readonly transcriptionModel =
    process.env.AI_TRANSCRIPTION_MODEL ?? "gpt-4o-mini-transcribe";

  generateTopic(category: CategoryEntity) {
    return this.request(
      `日本語の3分間スピーチ用のお題を1つ作成してください。ジャンルは「${category.name}」、説明は「${category.description}」です。身近な題材または考えを深める問いにし、話しやすく、センシティブすぎない内容にしてください。`,
      "topic",
    );
  }

  async generateWord(category: CategoryEntity): Promise<string | null> {
    const topic = await this.request(
      `日本語の3分間スピーチ用に、連想を広げられる名詞または概念をランダムに1単語だけ作成してください。ジャンルは「${category.name}」、説明は「${category.description}」です。説明、助詞、空白、句読点、括弧、疑問符は含めないでください。賛否を考えるジャンルの場合は、校則、制服、SNSのように意見を展開できる名詞を選んでください。幅広い語彙から選び、例をそのまま優先しないでください。`,
      "topic",
    );
    return topic && this.isSingleWord(topic) ? topic : null;
  }

  generateHint(topic: string, category: CategoryEntity) {
    return this.request(
      `3分間スピーチのお題は「${topic}」、ジャンルは「${category.name}」です。話を続けるための具体的で短い質問を1つ作成してください。`,
      "question",
    );
  }

  async generateStreamerComment(recentComments: string[]) {
    if (!this.apiKey) return null;
    const style = sample(STREAMER_COMMENT_STYLES);
    const seed = sample(STREAMER_COMMENT_SEEDS);
    const variationId = Math.random().toString(36).slice(2, 8);
    const recent =
      recentComments.length > 0
        ? `直近のコメントは「${recentComments.join("」「")}」です。語句だけでなく、話題や発想も重ならないようにしてください。`
        : "このセッションで直前のコメントはありません。";
    const result = await this.requestJson<{ comment?: string }>(
      `雑談配信のコメント欄に実際に流れてきそうな日本語コメントを1件作成してください。

今回のコメント種別: ${style}
今回の発想のきっかけ: ${seed}
ばらつき識別子: ${variationId}

コメント種別の指示を優先してください。「発想のきっかけ」は連想の出発点なので、その単語を必ず含める必要はありません。配信者が答えやすいか、話を広げやすいかは考慮しすぎず、一般のコメント欄に混ざる小さな報告、独り言、相談、突飛な発想も許可します。質問以外の種別では疑問形や問いかけを付けないでください。毎回「最近」「好き」「どっち」から始めるのを避けてください。挨拶、ユーザー名、説明文、政治・宗教・差別・性的内容、深刻な悩み、専門知識が必要な内容は含めず、自然な口語の60文字以内にしてください。${recent}`,
      "comment（60文字以内のコメント）キー",
      1,
      {
        name: "streamer_comment",
        schema: {
          type: "object",
          properties: { comment: { type: "string" } },
          required: ["comment"],
          additionalProperties: false,
        },
      },
      "あなたは雑談配信を見ている多数の視聴者を演じます。会話を進行する司会者やスピーチコーチではありません。指定された人物像とコメント種別に従い、JSONだけを返してください。",
    );
    return result.comment?.trim() || null;
  }

  async transcribeAudio(audio: AudioInput): Promise<string | null> {
    if (!this.apiKey) return null;
    try {
      const form = new FormData();
      form.append(
        "file",
        new Blob([new Uint8Array(audio.buffer)], { type: audio.mimeType }),
        audio.fileName,
      );
      form.append("model", this.transcriptionModel);
      form.append("language", "ja");
      form.append("response_format", "json");
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: "POST",
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
    const result = await this.requestJson<
      Partial<Omit<SpeechFeedback, "score">>
    >(
      `以下はスピーチの文字起こしです。\nお題: ${input.topic}\nジャンル: ${input.categoryName}\nスピーチ時間: ${input.durationSeconds}秒\n\n文字起こし:\n${input.transcript}\n\n内容と構成だけを分析してください。scoreBreakdownの各項目を0から20の整数で公平に採点してください。評価基準は、relevanceがお題との関連性、structureが導入・本論・結論など話の構成、specificityが具体例や根拠、coherenceが話の一貫性と展開、expressionが言葉選びと伝わりやすさです。音量、声質、発音、話す速さなど、文字起こしから判断できない要素は採点・評価しないでください。要約、良かった点、改善点、次回試す具体的な課題を、簡潔で実行しやすい日本語で返してください。`,
      "scoreBreakdown（relevance、structure、specificity、coherence、expressionがそれぞれ0から20の整数）、summary（文字列）、strengths（文字列配列）、improvements（文字列配列）、nextChallenge（文字列）キー",
      0.4,
      {
        name: "speech_feedback",
        schema: {
          type: "object",
          properties: {
            scoreBreakdown: {
              type: "object",
              properties: {
                relevance: { type: "integer", minimum: 0, maximum: 20 },
                structure: { type: "integer", minimum: 0, maximum: 20 },
                specificity: { type: "integer", minimum: 0, maximum: 20 },
                coherence: { type: "integer", minimum: 0, maximum: 20 },
                expression: { type: "integer", minimum: 0, maximum: 20 },
              },
              required: [
                "relevance",
                "structure",
                "specificity",
                "coherence",
                "expression",
              ],
              additionalProperties: false,
            },
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            nextChallenge: { type: "string" },
          },
          required: [
            "scoreBreakdown",
            "summary",
            "strengths",
            "improvements",
            "nextChallenge",
          ],
          additionalProperties: false,
        },
      },
    );
    if (
      !this.isScoreBreakdown(result.scoreBreakdown) ||
      typeof result.summary !== "string" ||
      !Array.isArray(result.strengths) ||
      !result.strengths.every((item) => typeof item === "string") ||
      !Array.isArray(result.improvements) ||
      !result.improvements.every((item) => typeof item === "string") ||
      typeof result.nextChallenge !== "string"
    )
      return null;
    return {
      score: Object.values(result.scoreBreakdown).reduce(
        (total, value) => total + value,
        0,
      ),
      scoreBreakdown: result.scoreBreakdown,
      summary: result.summary.trim(),
      strengths: result.strengths.map((item) => item.trim()).filter(Boolean),
      improvements: result.improvements
        .map((item) => item.trim())
        .filter(Boolean),
      nextChallenge: result.nextChallenge.trim(),
    };
  }

  private async request(
    prompt: string,
    key: keyof AiResult,
  ): Promise<string | null> {
    if (!this.apiKey) return null;
    const result = await this.requestJson(prompt, `${key}キーだけ`);
    return result[key]?.trim() || null;
  }

  private async requestJson<T extends object = AiResult>(
    prompt: string,
    responseKeys: string,
    temperature = 1,
    structuredOutput?: { name: string; schema: Record<string, unknown> },
    systemInstruction?: string,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          temperature,
          response_format: structuredOutput
            ? {
                type: "json_schema",
                json_schema: { ...structuredOutput, strict: true },
              }
            : { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                systemInstruction ??
                `日本語のスピーチコーチとして、${responseKeys}を持つJSONだけを返してください。`,
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return {} as T;
      const body = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
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

  private isScoreBreakdown(value: unknown): value is SpeechScoreBreakdown {
    if (!value || typeof value !== "object") return false;
    const scores = value as Record<keyof SpeechScoreBreakdown, unknown>;
    return [
      "relevance",
      "structure",
      "specificity",
      "coherence",
      "expression",
    ].every((key) => {
      const score = scores[key as keyof SpeechScoreBreakdown];
      return (
        typeof score === "number" &&
        Number.isInteger(score) &&
        score >= 0 &&
        score <= 20
      );
    });
  }
}
