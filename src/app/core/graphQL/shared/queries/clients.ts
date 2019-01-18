import gql from 'graphql-tag';

export const clients = gql`
query clients($org: [ID!]) {
  admin{
    organizations(codes: $org){
      edges{
        node{
          code
          organizationData{
            clients{
              edges{
                node{
                  code
                  clientData{
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
      }
    }
  }
}
`;