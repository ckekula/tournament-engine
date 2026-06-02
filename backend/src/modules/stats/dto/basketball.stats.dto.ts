import {
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class BasketballStatsDto {
  @IsInt()
  @Min(0)
  points: number;

  @IsInt()
  @Min(0)
  rebounds: number;

  @IsInt()
  @Min(0)
  assists: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  steals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  blocks?: number;
}