import { gql } from 'apollo-angular';

export const GET_ACTIVITY = gql`
  query GetActivity($id: ID!) {
    activity(id: $id) {
      id
      name
      tournament {
        id,
        name
      }
    }
  }
`;

export const GET_ACTIVITIES_BY_TOURN = gql`
  query GetActivitiesByTourn($tournaId: ID!) {
    activitiesByTournament(tournaId: $tournaId) {
      id
      name
    }
  }
`;