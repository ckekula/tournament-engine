export interface Stage {
    id: number;
    name: string;
    format: string;
}

export interface Group {
    id: number,
    name: string
}

export interface Team {
    id: number,
    name: string
}

export interface Round {
    team1Id: number;
    team1Score: number;
    team2Id: number;
    team2Score: number;
}

export interface TeamStats {
    teamId: number;
    teamName: string;
    played: number;
    wins: number;
    losses: number;
    ties: number;
    points: number;
    scoreDiff: number;
    goalsFor: number;
    goalsAgainst: number;
}