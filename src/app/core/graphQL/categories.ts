import gql from 'graphql-tag';

export const categories = gql`
query Query ($access: ID!, $language: [Language!]) {
  hotelX {
    categories(criteria: {access: $access}, relay: {}) {
      edges {
        node {
          categoryData {
            categoryCode
            texts (languages: $language) {
              text
              language
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
