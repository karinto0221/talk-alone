import { Type } from 'class-transformer';
import { IsIn, IsInt, IsString, Length, Max, Min } from 'class-validator';

const CATEGORY_IDS = ['daily', 'favorites', 'memories', 'imagination', 'values', 'society'] as const;

export class CreateSpeechDto {
  @IsString()
  @Length(1, 200)
  topic: string;

  @IsIn(CATEGORY_IDS)
  categoryId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(180)
  durationSeconds: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(50)
  helpCount: number;
}
