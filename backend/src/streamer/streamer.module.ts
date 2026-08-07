import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';

@Module({ imports: [AiModule], controllers: [StreamerController], providers: [StreamerService] })
export class StreamerModule {}
