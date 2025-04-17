import { gql } from 'apollo-angular';

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(createEventInput: $input) {
      success
      message
      event {
        id
        name
      }
    }
  }
`;

export const REMOVE_EVENT = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      success
      message
    }
  }
`;
