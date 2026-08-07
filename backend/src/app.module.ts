import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { SpeechesModule } from './speeches/speeches.module';
import { StreamerModule } from './streamer/streamer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../.env', '.env'] }), DatabaseModule, HealthModule, CategoriesModule, TopicsModule, SpeechesModule, StreamerModule],
})
export class AppModule {}
