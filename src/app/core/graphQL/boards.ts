import gql from 'graphql-tag';

export const boards = gql`
query Query ($access: ID!, $language: [Language!]) {
  hotelX {
    boards(criteria: {access: $access}, relay: {}) {
      edges {
        node {
          boardData {
            boardCode
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
