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
              isActive
              accesses {
                edges {
                  node {
                    accessData {
                      code
                      name
                      isTest
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
