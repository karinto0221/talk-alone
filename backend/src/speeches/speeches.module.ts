import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { AiModule } from '../ai/ai.module';
import { SpeechEntity } from './speech.entity';
import { SpeechesController } from './speeches.controller';
import { SpeechesRepository } from './speeches.repository';
import { SpeechesService } from './speeches.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpeechEntity]), CategoriesModule, AiModule],
  controllers: [SpeechesController],
  providers: [SpeechesRepository, SpeechesService],
})
export class SpeechesModule {}
