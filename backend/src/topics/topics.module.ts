import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { CategoriesModule } from '../categories/categories.module';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({ imports: [CategoriesModule, AiModule], controllers: [TopicsController], providers: [TopicsService] })
export class TopicsModule {}
