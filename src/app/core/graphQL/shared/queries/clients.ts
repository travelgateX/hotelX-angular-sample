import gql from 'graphql-tag';

export const clients = gql`
{
  admin {
    clients (filter: {isActive: true}) {
      edges {
        node {
          clientData {
            code
            name
            isActive
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
