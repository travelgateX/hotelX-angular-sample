import gql from 'graphql-tag';

export const getImpersonation = gql`
query ($memberCode: [ID!]){
  admin{
    members(codes: $memberCode){
      edges{
        node{
          memberData{
            impersonationJWT{
              token
              adviseMessage{
                code
                description
                level
              }
            }
          }
        }
      }
    }
  }
}
`;
