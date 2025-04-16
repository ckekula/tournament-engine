import { Tournament } from "./tournament";

export interface Activity {
    id: number;
    name: string;
    tournament: Tournament;
}

export interface CreateActivityResponse {
  createActivity: {
    success: boolean;
    message: string;
    activity: Activity;
  };
}