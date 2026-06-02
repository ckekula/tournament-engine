import { Activity } from "src/entities/enums";
import { SoccerStatsDto } from "./dto/soccer.stats.dto";
import { BasketballStatsDto } from "./dto/basketball.stats.dto";

export const statDtoRegistry = {
  [Activity.BASKETBALL]: BasketballStatsDto,
  [Activity.SOCCER]: SoccerStatsDto,
} as const;