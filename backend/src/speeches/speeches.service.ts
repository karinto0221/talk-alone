import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { CreateSpeechDto } from './dto/create-speech.dto';
import { SpeechesRepository } from './speeches.repository';

@Injectable()
export class SpeechesService {
  constructor(private readonly speechesRepository: SpeechesRepository, private readonly categoriesService: CategoriesService) {}

  async create(dto: CreateSpeechDto) {
    const category = await this.categoriesService.findById(dto.categoryId);
    const speech = await this.speechesRepository.createAndSave(dto);
    return this.toResponse({ ...speech, category });
  }

  async getAnalytics() {
    const [overview, categoryStats, monthlyStats, recentSpeeches] = await Promise.all([
      this.speechesRepository.getOverview(),
      this.speechesRepository.getCategoryStats(),
      this.speechesRepository.getMonthlyStats(),
      this.speechesRepository.findRecent(),
    ]);
    return {
      totalSessions: Number(overview?.totalSessions ?? 0),
      averageSeconds: Number(overview?.averageSeconds ?? 0),
      bestSeconds: Number(overview?.bestSeconds ?? 0),
      categoryStats: categoryStats.map((item) => ({ ...item, averageSeconds: Number(item.averageSeconds), count: Number(item.count) })),
      monthlyStats: monthlyStats.reverse().map((item) => ({ ...item, averageSeconds: Number(item.averageSeconds), count: Number(item.count) })),
      recentSpeeches: recentSpeeches.map((speech) => this.toResponse(speech)),
    };
  }

  private toResponse(speech: { id: string; topic: string; categoryId: string; category: { name: string }; durationSeconds: number; helpCount: number; completedAt: Date }) {
    return {
      id: speech.id,
      topic: speech.topic,
      categoryId: speech.categoryId,
      categoryName: speech.category.name,
      durationSeconds: speech.durationSeconds,
      helpCount: speech.helpCount,
      completedAt: speech.completedAt,
    };
  }
}
