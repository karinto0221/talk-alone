import { IsIn, IsString, Length } from 'class-validator';

const CATEGORY_IDS = ['daily', 'favorites', 'memories', 'imagination', 'values', 'society'] as const;

export class CreateHintDto {
  @IsString()
  @Length(1, 200)
  topic: string;

  @IsIn(CATEGORY_IDS)
  categoryId: string;
}
