import { timestamp } from "rxjs/operator/timestamp";
import { CurrencyPipe } from "@angular/common/src/pipes/number_pipe";
import gql from "graphql-tag";

export const book = gql`
  mutation Mutation($input: HotelBookInput!, $context: String, $client: String) {
    hotelX {
      book(input: $input, settings: { context: $context, client: $client }) {
        auditData {
          transactions {
            request
            response
            timeStamp
          }
          timeStamp
          processTime
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
                markups {
                  channel
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
          price {
            currency
            binding
            net
            gross
            exchange {
              currency
              rate
            }
            markups {
              channel
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
          status
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
