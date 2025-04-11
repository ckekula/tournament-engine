import { gql } from 'apollo-angular';

export const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
      slug
    }
  }
`;

export const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      id
      name
      slug
    }
  }
`;

export const GET_TOURNAMENT_BY_SLUG = gql`
  query GetTournamentBySlug($slug: String!) {
    tournamentBySlug(slug: $slug) {
      id
      name
      slug
    }
  }
`;

export const GET_TOURNAMENTS_BY_ORG = gql`
  query GetTournamentsByOrg($orgId: ID!) {
    tournamentsByOrg(orgId: $orgId) {
      id
      name
      slug
    }
  }
`;