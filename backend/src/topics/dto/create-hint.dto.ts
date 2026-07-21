import { IsString, Length } from 'class-validator';

export class CreateHintDto {
  @IsString()
  @Length(1, 200)
  topic: string;

  @IsString()
  @Length(1, 32)
  categoryId: string;
}
