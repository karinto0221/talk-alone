import { STREAMER_COMMENTS } from '../data/streamer-comment.data';

export function createRandomComment(recentComments: readonly string[] = []): string {
  const recent = new Set(recentComments.map((comment) => comment.trim()));
  const unused = STREAMER_COMMENTS.filter((comment) => !recent.has(comment));
  const candidates = unused.length > 0 ? unused : STREAMER_COMMENTS;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
