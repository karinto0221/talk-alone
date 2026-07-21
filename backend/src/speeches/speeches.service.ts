import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { CreateSpeechDto } from './dto/create-speech.dto';
import { SpeechesRepository } from './speeches.repository';
import type { AnalyticsMode, SpeechMode } from './speech.constants';

@Injectable()
export class SpeechesService {
  constructor(private readonly speechesRepository: SpeechesRepository, private readonly categoriesService: CategoriesService) {}

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
