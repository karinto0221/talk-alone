import { STREAMER_COMMENTS } from '../data/streamer-comment.data';
import type { ContentLanguage } from '../../../domain/practice';
import { ENGLISH_STREAMER_COMMENTS } from '../data/english-streamer.data';

export function createRandomComment(recentComments: readonly string[] = [], language: ContentLanguage = 'ja'): string {
  const comments = language === 'en' ? ENGLISH_STREAMER_COMMENTS : STREAMER_COMMENTS;
  const recent = new Set(recentComments.map((comment) => comment.trim()));
  const unused = comments.filter((comment) => !recent.has(comment));
  const candidates = unused.length > 0 ? unused : comments;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
