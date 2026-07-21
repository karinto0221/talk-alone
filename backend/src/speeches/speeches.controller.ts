import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateSpeechDto } from './dto/create-speech.dto';
import { GetAnalyticsDto } from './dto/get-analytics.dto';
import { SpeechesService } from './speeches.service';

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly speechesService: SpeechesService) {}

  @Post()
  create(@Body() dto: CreateSpeechDto) {
    return this.speechesService.create(dto);
  }

  @Get('analytics')
  getAnalytics(@Query() query: GetAnalyticsDto) {
    return this.speechesService.getAnalytics(query.mode);
  }
}
