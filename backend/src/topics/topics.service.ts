import { Injectable, NotFoundException } from '@nestjs/common';
import { AiClientService } from '../ai/ai-client.service';
import { CategoriesService } from '../categories/categories.service';
import { getHintCandidates } from './data/hint.data';
import { TOPICS } from './data/standard-topic.data';
import { WORD_TOPICS } from './data/word-topic.data';
import type { TopicMode } from './dto/get-random-topic.dto';

const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
type TopicResponse = { text: string; categoryId: string; categoryName: string; mode: TopicMode };

@Injectable()
export class TopicsService {
  constructor(private readonly categoriesService: CategoriesService, private readonly aiClient: AiClientService) {}

  async getRandomTopic(categoryId?: string, mode: TopicMode = 'standard'): Promise<TopicResponse> {
    const category = categoryId
      ? await this.categoriesService.findById(categoryId)
      : await this.categoriesService.findRandom();
    const generated = mode === 'word'
      ? await this.aiClient.generateWord(category)
      : await this.aiClient.generateTopic(category);
    const fallback = mode === 'word' ? WORD_TOPICS[category.id] : TOPICS[category.id];
    const text = generated ?? sample(fallback ?? []);
    if (!text) throw new NotFoundException('利用できるお題がありません。');
    return {
      text,
      categoryId: category.id,
      categoryName: category.name,
      mode,
    };
  }

  async createHint(topic: string, categoryId: string) {
    const category = await this.categoriesService.findById(categoryId);
    const generated = await this.aiClient.generateHint(topic, category);
    return { question: generated ?? sample(getHintCandidates(category.id, topic)) };
  }
}
