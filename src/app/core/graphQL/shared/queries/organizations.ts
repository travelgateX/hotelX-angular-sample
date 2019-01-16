import gql from 'graphql-tag';

export const organizations = gql`
{
  admin {
    organizations {
      edges {
        node {
          organizationData {
            code
          }
          error {
            code
            type
            description
          }
        }
      }
    }
  }
}
`;