import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { AiClientService } from '../ai/ai-client.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateSpeechDto } from './dto/create-speech.dto';
import { SpeechesRepository } from './speeches.repository';
import type { AnalyticsMode, SpeechMode } from './speech.constants';

@Injectable()
export class SpeechesService {
  constructor(
    private readonly speechesRepository: SpeechesRepository,
    private readonly categoriesService: CategoriesService,
    private readonly aiClient: AiClientService,
  ) {}

  async create(dto: CreateSpeechDto) {
    const category = await this.categoriesService.findById(dto.categoryId);
    const speech = await this.speechesRepository.createAndSave(dto);
    return this.toResponse({ ...speech, category });
  }

  async getAnalytics(mode: AnalyticsMode = 'all') {
    const speechMode: SpeechMode | undefined = mode === 'all' ? undefined : mode;
    const [overview, categoryStats, monthlyStats, recentSpeeches] = await Promise.all([
      this.speechesRepository.getOverview(speechMode),
      speechMode ? this.speechesRepository.getCategoryStats(speechMode) : Promise.resolve([]),
      this.speechesRepository.getMonthlyStats(speechMode),
      speechMode ? this.speechesRepository.findRecent(20, speechMode) : Promise.resolve([]),
    ]);
    return {
      totalSessions: Number(overview?.totalSessions ?? 0),
      averageSeconds: Number(overview?.averageSeconds ?? 0),
      bestSeconds: Number(overview?.bestSeconds ?? 0),
      mode,
      categoryStats: categoryStats.map((item) => ({ ...item, averageSeconds: Number(item.averageSeconds), count: Number(item.count) })),
      monthlyStats: monthlyStats.reverse().map((item) => ({ ...item, averageSeconds: Number(item.averageSeconds), count: Number(item.count) })),
      recentSpeeches: recentSpeeches.map((speech) => this.toResponse(speech)),
    };
  }

  async analyze(id: string, audio?: { buffer: Buffer; mimetype: string; originalname: string; size: number }) {
    if (!audio) throw new BadRequestException('録音ファイルが必要です。');
    if (!this.isSupportedAudio(audio)) throw new BadRequestException('対応していない音声形式です。');
    const speech = await this.speechesRepository.findById(id);
    if (!speech) throw new NotFoundException('スピーチ記録が見つかりません。');

    const transcript = await this.aiClient.transcribeAudio({
      buffer: audio.buffer,
      mimeType: audio.mimetype,
      fileName: audio.originalname,
    });
    if (!transcript) throw new ServiceUnavailableException('音声を文字起こしできませんでした。時間をおいて再度お試しください。');
    const feedback = await this.aiClient.analyzeSpeech({
      transcript,
      topic: speech.topic,
      categoryName: speech.category.name,
      durationSeconds: speech.durationSeconds,
    });
    if (!feedback) throw new ServiceUnavailableException('AI分析を完了できませんでした。時間をおいて再度お試しください。');
    return { transcript, ...feedback };
  }

  private isSupportedAudio(audio: { mimetype: string; originalname: string; size: number }) {
    const supportedMimeTypes = new Set(['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'video/webm']);
    const supportedExtension = /\.(webm|ogg|mp4|m4a|mp3|mpeg|wav)$/i.test(audio.originalname);
    return audio.size > 0 && audio.size <= 10 * 1024 * 1024 && (supportedMimeTypes.has(audio.mimetype) || supportedExtension);
  }

  private toResponse(speech: { id: string; topic: string; categoryId: string; category: { name: string }; mode: SpeechMode; durationSeconds: number; helpCount: number; completedAt: Date }) {
    return {
      id: speech.id,
      topic: speech.topic,
      categoryId: speech.categoryId,
      categoryName: speech.category.name,
      mode: speech.mode,
      durationSeconds: speech.durationSeconds,
      helpCount: speech.helpCount,
      completedAt: speech.completedAt,
    };
  }
}
