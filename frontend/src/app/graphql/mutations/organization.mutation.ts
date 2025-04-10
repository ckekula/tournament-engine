import { gql } from 'apollo-angular';

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(createOrganizationInput: $input) {
      success
      message
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, updateOrganizationInput: $input) {
      success
      message
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const REMOVE_ORGANIZATION = gql`
  mutation RemoveOrganization($id: ID!) {
    removeOrganization(id: $id) {
      success
      message
    }
  }
`;
