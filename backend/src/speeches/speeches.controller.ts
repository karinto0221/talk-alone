import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post(':id/analysis')
  @UseInterceptors(FileInterceptor('audio', { limits: { files: 1, fileSize: 10 * 1024 * 1024 } }))
  analyze(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() audio?: { buffer: Buffer; mimetype: string; originalname: string; size: number },
  ) {
    return this.speechesService.analyze(id, audio);
  }
}
