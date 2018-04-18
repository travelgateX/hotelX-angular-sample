import gql from "graphql-tag";

export const booking = gql`
  query booking($criteriaBooking: HotelCriteriaBookingInput!, $client: String) {
    hotelX {
      booking(
        criteria: $criteriaBooking
        settings: { auditTransactions: true, client: $client }
      ) {
        auditData {
          transactions {
            request
            response
            timeStamp
          }
        }
        bookings {
          reference {
            client
            supplier
          }
          holder {
            name
            surname
          }
          status
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
              occupancyRefId
              code
              description
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
          cancelPolicy {
            refundable
            cancelPenalties {
              hoursBefore
              penaltyType
              currency
              value
            }
          }
          remarks
          payable
        }
        errors {
          code
          type
          description
        }
        warnings {
          code
          type
          description
        }
      }
    }
  }
`;
