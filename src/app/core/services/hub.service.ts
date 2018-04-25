import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

import { CriteriaSearch } from 'app/core/interfaces/criteria-search';
import { HotelInfo } from 'app/core/interfaces/hotel-info';
import { hotelInfo } from '../graphQL/result-bookings/queries/hotel-info';
import { HotelAvail } from 'app/core/interfaces/hotel-avail';
import { avail } from '../graphQL/result-bookings/queries/availability'
import { HotelBookInput } from 'app/core/interfaces/hotel-book-input';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { ApolloQueryResult } from 'apollo-client';
import { Access } from 'app/core/interfaces/access';
import { CriteriaBooking } from '../interfaces/criteria-booking';
import { CancelBooking } from '../interfaces/cancel-booking';
import { cancelBooking } from '../graphQL/my-bookings/mutations/cancel-booking';
import { quote } from '../graphQL/result-bookings/queries/quote';
import { booking } from '../graphQL/my-bookings/queries/booking';
import { book } from '../graphQL/close-bookings/mutations/book';
import { suppliersAccesses } from '../graphQL/shared/queries/suppliers-accesses';
import { destinationSearcher } from '../graphQL/shared/queries/destination-searcher';
import { boards } from '../graphQL/shared/queries/boards';
import { categories } from '../graphQL/shared/queries/categories';
import { hotelCodesFromDestination } from '../graphQL/shared/queries/hotel-codes-from-destination';
import { clients } from '../graphQL/shared/queries/clients';
import { Client } from '../interfaces/client';

/**
 * Handles availability, quote and book requests to the Gateway
 */
@Injectable()
export class HubService {
  private criteria: CriteriaSearch;
  private city;

  constructor(private apollo: Apollo) {}

  /**
   * Sort the response by hotel due to the fact that in the response options are mixed
   * @param response Response
   * @param hotels HotelInfo[]
   */
  transformAvailability(response, hotels: any[]): HotelAvail[] {
    const hotelsMap = new Map<string, HotelAvail>();
    response.options.forEach(option => {
      if (!hotelsMap.has(option.hotelCode)) {
        hotelsMap.set(option.hotelCode, <HotelAvail>{
          info: hotels.filter(h => h.code === option.hotelCode)[0],
          options: [option]
        });
      } else {
        hotelsMap.get(option.hotelCode).options.push(option);
      }
    });
    return this.filterOptionsByPrice(Array.from(hotelsMap.values()));
  }

  /**
   * Loops over each hotel and sorts by ascendent total price
   * @param hotels HotelAvail array
   */
  filterOptionsByPrice(hotels: HotelAvail[]) {
    hotels.forEach(hotel =>
      hotel.options.sort((prev, curr) => {
        try {
          return prev.price.net - curr.price.net;
        } catch (e) {
          return 1;
        }
      })
    );
    return hotels;
  }

  /**
   * Executes an availability request
   * @param criteria criteria to search
   * @param access access
   * @param context context
   */
  getAvailability(
    criteria: CriteriaSearch,
    access: Access[],
    context: string,
    client: string
  ): QueryRef<any> {
    const accessCodes = access.map(res => res.code);
    return this.apollo.watchQuery<any>({
      query: avail,
      variables: { criteria: criteria, access: accessCodes, context: context, client: client },
      fetchPolicy: 'network-only'
    });
  }

  /**
   * Get quote from an operation id
   * @param optionRefId
   * @param language
   */
  getQuote(
    optionRefId: string,
    language: string,
    context: string,
    client: Client
  ): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: quote,
      variables: {
        optionRefId: optionRefId,
        language: language,
        context: context,
        client: client.name
      }
    });
  }

  /**
   * makes a book and gets the result
   * @param input
   * @param context
   */
  getBook(input: HotelBookInput, context: string, client: Client): Observable<any> {
    return this.apollo.mutate({
      mutation: book,
      variables: { input: input, context: context , client: client.name}
    });
  }

  /**
   * get the current bookings of an user
   * @param criteriaBooking
   */
  getMyBookings(criteriaBooking: CriteriaBooking, client: Client) {
    return this.apollo.watchQuery<any>({
      query: booking,
      variables: { criteriaBooking: criteriaBooking, client: client.name },
      fetchPolicy: 'network-only'
    });
  }

  /**
   * cancels a book and gets the result
   * @param input
   * @param context
   */
  cancelBook(cancelBookingInput: CancelBooking, client: Client) {
    return this.apollo.mutate({
      mutation: cancelBooking,
      variables: { input: cancelBookingInput, client: client.name }
    });
  }

  /**
   * Get the information of each hotel
   * @param hotels list of hotel codes
   * @param access access
   * @param language language
   */
  getHotelInfo(
    hotels: string[],
    access: Access[],
    language: string
  ): QueryRef<any> {
    const accessCodes = access.map(res => res.code);
    return this.apollo.watchQuery<any>({
      query: hotelInfo,
      variables: { codes: hotels, access: accessCodes[0], language: [language] }
    });
  }

  /**
   * Get the information of suppliers/accesses
   */
  getSuppliersAccesses(): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: suppliersAccesses
    });

  }
  /**
   * Get the information of suppliers/accesses
   */
  getClients(): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: clients
    });
  }

  /**
   * Get the information of suppliers/accesses
   * @param access access
   * @param text text to search
   */
  destinationSearcher(access: Access, text: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: destinationSearcher,
      variables: { access: access.code, text: text },
      fetchPolicy: 'network-only'
    });
  }

  /**
   * Get the hotelCodes for a destinations
   * @param access access
   * @param destinationCodes destinationCodes
   */
  getHotelCodesDestination(
    access: Access[],
    destinationCodes: string
  ): Promise<any> {
    const accessCodes = access.map(res => res.code);
    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery<any>({
          query: hotelCodesFromDestination,
          variables: {
            access: accessCodes[0],
            destinationCodes: destinationCodes
          }
        })
        .valueChanges.subscribe(res => resolve(res), err => reject(err));
    });
  }

  /**
   * Get the boards of an access
   * @param access access
   * @param language language
   */
  getBoards(access: Access[], language: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: boards,
      variables: { access: access[0].code, language: language }
    });
  }

  /**
   * Get the categories of an access
   * @param access access
   * @param language language
   */
  getCategories(access: Access[], language: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: categories,
      variables: { access: access[0].code, language: language }
    });
  }
}
