import gql from 'graphql-tag';

export const suppliersAccesses = gql`
  query suppliers($groupID: [ID]) {
    admin {
      suppliers(filter: { groupID: $groupID }) {
        edges {
          node {
            supplierData {
              name
              code
              context
              accesses {
                edges {
                  node {
                    accessData {
                      code
                      name
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
