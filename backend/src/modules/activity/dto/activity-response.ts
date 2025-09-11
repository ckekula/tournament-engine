import { TournamentResponse } from "src/modules/tournament/dto/tournament-response";

export class ActivityResponse {
  id: number;
  name: string;
  tournament: TournamentResponse;
  createdAt: Date;
  updatedAt: Date;
}