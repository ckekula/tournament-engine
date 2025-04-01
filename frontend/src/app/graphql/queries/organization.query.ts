import { gql } from 'apollo-angular';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      description
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      id
      name
      slug
      description
    }
  }
`;

export const GET_ORGANIZATION_BY_SLUG = gql`
  query GetOrganizationBySlug($slug: String!) {
    organizationBySlug(slug: $slug) {
      id
      name
      slug
      description
    }
  }
`;

export const GET_ORGANIZATION_BY_USER = gql`
  query GetOrganizationByUser($userId: ID!) {
    organizationByUser(userId: $userId) {
      id
      name
      slug
      description
    }
  }
`;