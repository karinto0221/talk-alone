import { Injectable } from '@nestjs/common';
import { AiClientService } from '../ai/ai-client.service';
import { CategoriesService } from '../categories/categories.service';
import { HINTS, TOPICS } from './topic.data';

const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

@Injectable()
export class TopicsService {
  constructor(private readonly categoriesService: CategoriesService, private readonly aiClient: AiClientService) {}

  async getRandomTopic() {
    const category = await this.categoriesService.findRandom();
    const generated = await this.aiClient.generateTopic(category);
    return { text: generated ?? sample(TOPICS[category.id]), categoryId: category.id, categoryName: category.name };
  }

  async createHint(topic: string, categoryId: string) {
    const category = await this.categoriesService.findById(categoryId);
    const generated = await this.aiClient.generateHint(topic, category);
    return { question: generated ?? sample(HINTS[category.id]) };
  }
}
