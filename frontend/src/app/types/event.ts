import { Activity } from "./activity";

export interface _Event {
    id: number;
    name: string | null;
    gender: string | null;
    weightClass: string | null;
    ageGroup: string | null;
    activity: Activity;
}

export interface createEventResponse {
  createEvent: {
    success: boolean;
    message: string;
    event: _Event;
  };
}