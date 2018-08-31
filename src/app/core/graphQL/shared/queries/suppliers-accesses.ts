import gql from 'graphql-tag';

export const suppliersAccesses = gql`
{
  admin {
    suppliers {
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
