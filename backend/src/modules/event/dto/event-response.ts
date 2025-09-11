import { ActivityResponse } from "src/modules/activity/dto/activity-response";

export class EventResponse {
  id: number;
  name: string;
  activity: ActivityResponse;
  createdAt: Date;
  updatedAt: Date;
}