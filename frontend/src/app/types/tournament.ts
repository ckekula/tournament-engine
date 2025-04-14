import { Organization } from "./organization";

export interface Tournament {
  id: number;
  name: string;
  organizer: Organization;
  year: number;
  slug: string;
}

export interface CreateTournamentResponse {
  createTournament: {
    success: boolean;
    message: string;
    tournament: Tournament;
  };
}