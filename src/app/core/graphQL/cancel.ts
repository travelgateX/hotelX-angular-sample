import gql from 'graphql-tag';

export const cancel = gql`
  mutation Mutation($hotel: String!, $reference: BookReferenceInput!) {
    hotelCancel(
      input: {
        access: "access_1"
        language: "es"
        hotel: $hotel
        reference: $reference
      }
      settings: { auditTransactions: true }
    ) {
      auditData {
        transactions {
          request
          response
          timeStamp
        }
      }
      cancellation {
        reference {
          client
          provider
        }
        cancelReference
        status
        price {
          currency
          binding
          commissionPercentage
          net
          gross
        }
        booking {
          reference {
            client
            provider
          }
          holder {
            name
            surname
          }
          price {
            currency
            binding
            commissionPercentage
            net
            gross
          }
          hotel {
            creationDate
            checkIn
            checkOut
            hotelCode
            hotelName
            boardCode
            occupancies {
              id
              paxes {
                age
              }
            }
            rooms {
              code
              description
              occupancyRefId
              price {
                currency
                binding
                commissionPercentage
                net
                gross
              }
            }
          }
        }
      }
    }
  }
`;
