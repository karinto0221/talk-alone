import { Body, Controller, Post } from '@nestjs/common';
import { CreateStreamerCommentDto } from './dto/create-streamer-comment.dto';
import { StreamerService } from './streamer.service';

@Controller('streamer/comments')
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Post()
  createComment(@Body() dto: CreateStreamerCommentDto) {
    return this.streamerService.createComment(dto.recentComments);
  }
}
