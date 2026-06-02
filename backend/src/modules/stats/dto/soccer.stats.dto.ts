import {
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class SoccerStatsDto {
  @IsInt()
  @Min(0)
  goals: number;

  @IsInt()
  @Min(0)
  assists: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yellowCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  redCards?: number;
}