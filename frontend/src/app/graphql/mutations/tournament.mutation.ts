import { gql } from 'apollo-angular';

export const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(createTournamentInput: $input) {
      success
      message
      Tournament {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_TOURNAMENT = gql`
  mutation UpdateTournament($id: ID!, $input: UpdateTournamentInput!) {
    updateTournament(id: $id, updateTournamentInput: $input) {
      success
      message
      Tournament {
        id
        name
        slug
      }
    }
  }
`;

export const REMOVE_TOURNAMENT = gql`
  mutation RemoveTournament($id: ID!) {
    removeTournament(id: $id) {
      success
      message
    }
  }
`;
