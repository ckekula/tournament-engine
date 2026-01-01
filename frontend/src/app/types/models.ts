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
    registeredOrganizations: Organization[];
}

export interface Activity {
    id: number;
    name: string;
    events: _Event[];
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
    participants?: Participant[];
    groupStage: Stage,
}

export interface Participant {
    id: number,
    events: _Event[]
}

export interface Team extends Participant {
    name: string,
    organization: Organization,
    members?: TeamMember[]
}

export interface TeamMember {
    id: number,
    person: Person,
    team: Team
}

export interface Individual extends Participant {
    person: Person,
}

export interface Person {
    id: number,
    name: string,
    individualParticipations: Individual[],
    teamMemberships: TeamMember[],
}

export interface StageParticipant {
    id: number,
    stage: Stage,
    participant: Participant
}

export interface GroupStageParticipant extends StageParticipant{
    group: Group
}

export interface Round {
  participant1Id: number;
  participant1Score: number;
  participant2Id: number;
  participant2Score: number;
}

// Update ParticipantStats (formerly TeamStats)
export interface ParticipantStats {
  participantId: number;
  participantName: string;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  scoreDiff: number;
  goalsFor: number;
  goalsAgainst: number;
  played: number;
}