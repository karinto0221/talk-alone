import { Injectable } from '@nestjs/common';
import { AiClientService } from '../ai/ai-client.service';
import { STREAMER_COMMENTS } from './streamer-comment.data';

const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

@Injectable()
export class StreamerService {
  constructor(private readonly aiClient: AiClientService) {}

  async createComment(recentComments: string[]) {
    const recent = new Set(recentComments.map((comment) => comment.trim()));
    const generated = await this.aiClient.generateStreamerComment([...recent]);
    if (generated && generated.length <= 60 && !recent.has(generated)) return { text: generated };

    const unusedComments = STREAMER_COMMENTS.filter((comment) => !recent.has(comment));
    return { text: sample(unusedComments.length > 0 ? unusedComments : STREAMER_COMMENTS) };
  }
}
