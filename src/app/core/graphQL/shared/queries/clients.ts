import gql from 'graphql-tag';

export const clients = gql`
{
  admin {
    clients {
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
