import { gql } from 'apollo-angular';

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      activity {
        id
        name
      }
    }
  }
`;

export const GET_EVENTS_BY_ACTIVITY = gql`
  query GetEventsByActivity($activityName: String!, $tournamentId: ID!) {
    eventsByActivity(activityName: $activityName, tournamentId: $tournamentId) {
      id
      name
      gender
      weightClass
      ageGroup
    }
  }
`;