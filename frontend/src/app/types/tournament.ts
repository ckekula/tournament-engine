export interface Tournament {
    id: number;
    name: string;
    year: number;
    abbreviation: string;
}

export interface CreateTournamentResponse {
    createOrganization: {
      success: boolean;
      message: string;
      organization: Tournament;
    };
}