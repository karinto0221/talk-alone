import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeechEntity } from './speech.entity';

@Injectable()
export class SpeechesRepository {
  constructor(@InjectRepository(SpeechEntity) private readonly repository: Repository<SpeechEntity>) {}

  createAndSave(input: Pick<SpeechEntity, 'topic' | 'categoryId' | 'durationSeconds' | 'helpCount'>) {
    return this.repository.save(this.repository.create(input));
  }

  findRecent(limit = 20) {
    return this.repository.find({ relations: { category: true }, order: { completedAt: 'DESC' }, take: limit });
  }

  getOverview() {
    return this.repository
      .createQueryBuilder('speech')
      .select('COUNT(*)', 'totalSessions')
      .addSelect('COALESCE(AVG(speech.duration_seconds), 0)', 'averageSeconds')
      .addSelect('COALESCE(MAX(speech.duration_seconds), 0)', 'bestSeconds')
      .getRawOne<{ totalSessions: string; averageSeconds: string; bestSeconds: string }>();
  }

  getCategoryStats() {
    return this.repository
      .createQueryBuilder('speech')
      .innerJoin('speech.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('category.color', 'color')
      .addSelect('AVG(speech.duration_seconds)', 'averageSeconds')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.id')
      .orderBy('AVG(speech.duration_seconds)', 'DESC')
      .getRawMany<{ categoryName: string; color: string; averageSeconds: string; count: string }>();
  }

  getMonthlyStats() {
    return this.repository
      .createQueryBuilder('speech')
      .select("TO_CHAR(DATE_TRUNC('month', speech.completed_at), 'YYYY-MM')", 'month')
      .addSelect('AVG(speech.duration_seconds)', 'averageSeconds')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE_TRUNC('month', speech.completed_at)")
      .orderBy("DATE_TRUNC('month', speech.completed_at)", 'DESC')
      .limit(6)
      .getRawMany<{ month: string; averageSeconds: string; count: string }>();
  }
}
