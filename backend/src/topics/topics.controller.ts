import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateHintDto } from './dto/create-hint.dto';
import { GetRandomTopicDto } from './dto/get-random-topic.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('random')
  getRandomTopic(@Query() query: GetRandomTopicDto) {
    return this.topicsService.getRandomTopic(query.categoryId, query.mode);
  }

  @Post('help')
  createHint(@Body() dto: CreateHintDto) {
    return this.topicsService.createHint(dto.topic, dto.categoryId);
  }
}
