import { gql } from 'apollo-angular';

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(createActivityInput: $input) {
      success
      message
      activity {
        id
        name
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($id: ID!, $input: UpdateActivityInput!) {
    updateActivity(id: $id, updateActivityInput: $input) {
      success
      message
      activity {
        id
        name
      }
    }
  }
`;

export const REMOVE_ACTIVITY = gql`
  mutation RemoveActivity($id: ID!) {
    removeActivity(id: $id) {
      success
      message
    }
  }
`;
