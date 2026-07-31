import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type ObjectLiteral, type SelectQueryBuilder } from 'typeorm';
import { SpeechEntity } from './speech.entity';
import type { SpeechMode } from './speech.constants';

@Injectable()
export class SpeechesRepository {
  constructor(@InjectRepository(SpeechEntity) private readonly repository: Repository<SpeechEntity>) {}

  createAndSave(input: Pick<SpeechEntity, 'topic' | 'categoryId' | 'mode' | 'durationSeconds' | 'helpCount'>) {
    return this.repository.save(this.repository.create(input));
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id }, relations: { category: true } });
  }

  findRecent(limit = 20, mode?: SpeechMode) {
    const query = this.repository.createQueryBuilder('speech')
      .innerJoinAndSelect('speech.category', 'category')
      .orderBy('speech.completedAt', 'DESC')
      .take(limit);
    return this.withMode(query, mode).getMany();
  }

  getOverview(mode?: SpeechMode) {
    const query = this.repository
      .createQueryBuilder('speech')
      .select('COUNT(*)', 'totalSessions')
      .addSelect('COALESCE(AVG(speech.duration_seconds), 0)', 'averageSeconds')
      .addSelect('COALESCE(MAX(speech.duration_seconds), 0)', 'bestSeconds');
    return this.withMode(query, mode).getRawOne<{ totalSessions: string; averageSeconds: string; bestSeconds: string }>();
  }

  getCategoryStats(mode: SpeechMode) {
    const query = this.repository
      .createQueryBuilder('speech')
      .innerJoin('speech.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('category.color', 'color')
      .addSelect('AVG(speech.duration_seconds)', 'averageSeconds')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.id')
      .orderBy('AVG(speech.duration_seconds)', 'DESC');
    return this.withMode(query, mode).getRawMany<{ categoryName: string; color: string; averageSeconds: string; count: string }>();
  }

  getMonthlyStats(mode?: SpeechMode) {
    const query = this.repository
      .createQueryBuilder('speech')
      .select("TO_CHAR(DATE_TRUNC('month', speech.completed_at), 'YYYY-MM')", 'month')
      .addSelect('AVG(speech.duration_seconds)', 'averageSeconds')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE_TRUNC('month', speech.completed_at)")
      .orderBy("DATE_TRUNC('month', speech.completed_at)", 'DESC')
      .limit(6);
    return this.withMode(query, mode).getRawMany<{ month: string; averageSeconds: string; count: string }>();
  }

  private withMode<T extends ObjectLiteral>(query: SelectQueryBuilder<T>, mode?: SpeechMode) {
    return mode ? query.andWhere('speech.mode = :mode', { mode }) : query;
  }
}
