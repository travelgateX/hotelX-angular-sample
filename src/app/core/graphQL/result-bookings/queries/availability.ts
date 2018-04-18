import gql from 'graphql-tag';

export const avail = gql`
query Query($criteria: HotelCriteriaSearchInput, $access: [ID!], $context: String, $client: String) {
  hotelX {
    search(criteria: $criteria
      settings: {
        context: $context, client: $client
      }
      filter: { access: {includes: $access} }) {
        options {
          supplierCode
          accessCode
          hotelCode
          hotelName
          boardCode
          paymentType
          status
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
            refundable
            units
            roomPrice {
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
              breakdown {
                effectiveDate
                expireDate
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
            beds {
              type
              description
              count
              shared
            }
            ratePlans {
              code
              name
              effectiveDate
              expireDate
            }
            promotions {
              code
              name
              effectiveDate
              expireDate
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
          supplements {
            code
            name
            description
            supplementType
            chargeType
            mandatory
            durationType
            quantity
            unit
            effectiveDate
            expireDate
            resort {
              code
              name
              description
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
          rateRules
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
          id
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
