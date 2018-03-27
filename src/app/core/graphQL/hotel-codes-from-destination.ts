import gql from 'graphql-tag';

export const hotelCodesFromDestination = gql`
query Query ($destinationCodes: [String!], $access: ID!){
  hotelX {
    hotels (criteria: {destinationCodes: $destinationCodes, access: $access}, relay: {}) {
      edges {
        node {
          hotelData {
            hotelCode
          }
        }
      }
    }
  }
}
`;
