import gql from 'graphql-tag';

export const hotelInfo = gql`
query Query ($codes: [String!], $access: ID!, $language: [Language!]) {
  hotelX {
    hotels (criteria: { hotelCodes: $codes, access: $access}, relay: {} ){
      edges {
        node {
          hotelData {
            hotelCode
            hotelName
            categoryCode
            medias {
              type
              url
            }
            amenities {
              code
              type
              texts (languages: $language) {
                text
                language
              }
            }
            descriptions (languages: $language) {
              type
              texts {
                text
                language
              }
            }
            location {
              address
              city
              zipCode
              country
              coordinates {
                latitude
                longitude
              }
            }
            contact {
              email
              telephone
              fax
              web
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
