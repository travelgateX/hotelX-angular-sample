import gql from "graphql-tag";

export const cancelBooking = gql`
mutation cancelBooking ($input: HotelCancelInput!) {
  hotelX {
    cancel(input: $input, settings: { auditTransactions: true }) {
      auditData {
        transactions {
          request
          response
          timeStamp
        }
      }
      errors {
        type
        code
        description
      }
      warnings {
        type
        code
        description
      }
      cancellation {
        reference {
          client
          supplier
        }
        cancelReference
        status
        price {
          currency
          binding
          net
          gross
          exchange {
            currency
            rate
          }
        }
        booking {
          reference {
            client
            supplier
          }
          holder {
            name
            surname
          }
          price {
            currency
            binding
            net
            gross
            exchange {
              currency
              rate
            }
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
                net
                gross
                exchange {
                  currency
                  rate
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
