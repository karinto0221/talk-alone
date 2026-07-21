import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export const TOPIC_MODES = ['standard', 'word'] as const;
export type TopicMode = (typeof TOPIC_MODES)[number];

export class GetRandomTopicDto {
  @IsOptional()
  @IsString()
  @Length(1, 32)
  categoryId?: string;

  @IsOptional()
  @IsIn(TOPIC_MODES)
  mode: TopicMode = 'standard';
}
