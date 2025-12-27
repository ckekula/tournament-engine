import { EventResponse } from "src/modules/event/dto/event-response";
import { TournamentResponse } from "src/modules/tournament/dto/tournament-response";

export class ActivityResponse {
  id: number;
  name: string;
  tournament: TournamentResponse;
  events: EventResponse[];
  createdAt: Date;
  updatedAt: Date;
}