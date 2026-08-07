import { ArrayMaxSize, IsArray, IsOptional, IsString, Length } from 'class-validator';

export class CreateStreamerCommentDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Length(1, 120, { each: true })
  recentComments: string[] = [];
}
