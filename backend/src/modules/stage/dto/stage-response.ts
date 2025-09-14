import { Format } from "src/entities/format.enum";
import { EventResponse } from "src/modules/event/dto/event-response";

export class StageResponse {
  id: number;
  name: string;
  format: Format;
  event: EventResponse;
  createdAt: Date;
  updatedAt: Date;
}