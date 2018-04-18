import gql from 'graphql-tag';

export const destinationSearcher = gql`
query Query ($text: String!, $access: ID!) {
  hotelX {
    destinationSearcher(criteria: {access: $access, text: $text, maxSize: 15}) {
      ... on HotelData {
        hotelCode
        hotelName
      }
      ... on DestinationData {
        code
        texts(languages: "en") {
          text
        }
        closestDestinations
      }
    }
  }
}
`;
