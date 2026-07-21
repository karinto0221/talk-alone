import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateHintDto } from './dto/create-hint.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('random')
  getRandomTopic() {
    return this.topicsService.getRandomTopic();
  }

  @Post('help')
  createHint(@Body() dto: CreateHintDto) {
    return this.topicsService.createHint(dto.topic, dto.categoryId);
  }
}
