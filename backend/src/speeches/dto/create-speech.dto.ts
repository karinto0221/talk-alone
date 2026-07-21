import { Type } from 'class-transformer';
import { IsIn, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { SPEECH_MODES, type SpeechMode } from '../speech.constants';

export class CreateSpeechDto {
  @IsString()
  @Length(1, 200)
  topic: string;

  @IsString()
  @Length(1, 32)
  categoryId: string;

  @IsIn(SPEECH_MODES)
  mode: SpeechMode;

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
