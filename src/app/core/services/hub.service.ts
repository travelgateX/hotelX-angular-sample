import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { hotelInfo, avail, quote } from '../graphQL/result-bookings/queries';
import { Observable } from 'rxjs';
import { cancelBooking } from '../graphQL/my-bookings/mutations/cancel-booking';
import { booking } from '../graphQL/my-bookings/queries/booking';
import { book } from '../graphQL/close-bookings/mutations/book';
import {
  suppliersAccesses,
  destinationSearcher,
  boards,
  categories,
  hotelCodesFromDestination,
  clients
} from '../graphQL/shared/queries';
import {
  Access,
  Client,
  CriteriaBooking,
  CancelBooking,
  HotelBookInput,
  HotelAvail,
  CriteriaSearch
} from '../interfaces';
import { hotelSettingsInput } from '../interfaces/hotel-settings-input';

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
    settings: hotelSettingsInput
  ): QueryRef<any> {
    const accessCodes = access.map(res => res.code);
    return this.apollo.watchQuery<any>({
      query: avail,
      variables: {
        criteria: criteria,
        settings: settings,
        access: accessCodes
      },
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
    settings: hotelSettingsInput
  ): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: quote,
      variables: {
        optionRefId: optionRefId,
        language: language,
        settings: settings
      }
    });
  }

  /**
   * makes a book and gets the result
   * @param input
   * @param context
   */
  getBook(
    input: HotelBookInput,
    settings: hotelSettingsInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: book,
      variables: { input: input, settings: settings }
    });
  }

  /**
   * get the current bookings of an user
   * @param criteriaBooking
   */
  getMyBookings(criteriaBooking: CriteriaBooking, settings: hotelSettingsInput) {
    return this.apollo.watchQuery<any>({
      query: booking,
      variables: { criteriaBooking: criteriaBooking, settings: settings },
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
