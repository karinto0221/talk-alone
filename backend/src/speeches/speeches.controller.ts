import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSpeechDto } from './dto/create-speech.dto';
import { SpeechesService } from './speeches.service';

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly speechesService: SpeechesService) {}

  @Post()
  create(@Body() dto: CreateSpeechDto) {
    return this.speechesService.create(dto);
  }

  @Get('analytics')
  getAnalytics() {
    return this.speechesService.getAnalytics();
  }
}
