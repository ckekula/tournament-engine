export interface Organization {
    id: number;
    name: string;
    slug: string;
}

export interface Tournament {
    id: number;
    organizerId: number;
    name: string;
    season?: string;
    slug: string;
}

export interface Activity {
    id: number;
    name: string;
}

export interface _Event {
    id: number;
    name: string;
    categories: number[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Stage {
    id: number;
    name: string;
    format: string;
    isGroupStage: boolean;
}

export interface Group {
    id: number,
    name: string,
    teams: Team[],
    groupStage: Stage,
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