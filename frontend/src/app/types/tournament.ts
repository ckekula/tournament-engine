export interface Tournament {
  id: number;
  name: string;
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