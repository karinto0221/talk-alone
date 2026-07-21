import { IsIn, IsOptional } from 'class-validator';
import { ANALYTICS_MODES, type AnalyticsMode } from '../speech.constants';

export class GetAnalyticsDto {
  @IsOptional()
  @IsIn(ANALYTICS_MODES)
  mode: AnalyticsMode = 'all';
}
