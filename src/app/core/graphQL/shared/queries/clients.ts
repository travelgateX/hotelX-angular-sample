import gql from 'graphql-tag';

export const clients = gql`
query clients($groupID: [ID]) {
  admin {
    clients(filter: { groupID: $groupID }) {
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
