import gql from "graphql-tag";

export const quote = gql`
  query Query($optionRefId: String!, $language: Language, $settings: HotelSettingsInput) {
    hotelX {
      quote(
        criteria: { optionRefId: $optionRefId, language: $language }
        settings: $settings
      ) {
        optionQuote {
          optionRefId
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
          surcharges {
            chargeType
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
            description
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
          cardTypes
          remarks
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
        auditData {
          transactions {
            request
            response
            timeStamp
          }
        }
      }
    }
  }
`;
