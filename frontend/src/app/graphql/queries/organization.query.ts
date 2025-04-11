import { gql } from 'apollo-angular';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      id
      name
      slug
    }
  }
`;

export const GET_ORGANIZATION_BY_SLUG = gql`
  query GetOrganizationBySlug($slug: String!) {
    organizationBySlug(slug: $slug) {
      id
      name
      slug
    }
  }
`;

export const GET_ORGANIZATIONS_BY_USER = gql`
  query GetOrganizationsByUser($userId: ID!) {
    organizationsByUser(userId: $userId) {
      id
      name
      slug
    }
  }
`;