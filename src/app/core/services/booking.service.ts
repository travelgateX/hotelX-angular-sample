import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BookingDetail } from 'app/core/interfaces/booking-detail';
import { HotelInfo } from 'app/core/interfaces/hotel-info';
import { Option } from 'app/core/interfaces/option';
import { Search } from 'app/core/interfaces/search';
import { HotelBookInput } from 'app/core/interfaces/hotel-book-input';
import { Criteria } from 'app/core/interfaces/criteria';

/**
 * Handles book information
 */
@Injectable()
export class BookingService {
  private booking = new BehaviorSubject<BookingDetail>(null);
  booking$ = this.booking.asObservable();
  search: Search;

  constructor() {}

  /**
   * Sets a new value for booking observable
   * @param bookingDetail current booking detail
   */
  set(bookingDetail: BookingDetail) {
    this.booking.next(bookingDetail);
  }

  /**
   * Returns current booking value
   */
  get(): BookingDetail {
    return this.booking.getValue();
  }

  /**
   * Updates the hotel info from the current booking
   * @param hotelInfo new hotel information
   */
  setHotelInfo(hotelInfo) {
    const booking: BookingDetail = {
      hotelInfo: hotelInfo,
      option: this.booking.getValue() ? this.booking.getValue().option : null,
      search: this.booking.getValue() ? this.booking.getValue().search : null,
      input: this.booking.getValue() ? this.booking.getValue().input : null,
    };

    this.booking.next(booking);
  }

  /**
   * Updates the option from the current booking
   * @param option new option
   */
  setOption(option: Option) {
    const booking: BookingDetail = {
      option: option,
      hotelInfo: this.booking.getValue()
        ? this.booking.getValue().hotelInfo
        : null,
      search: this.booking.getValue() ? this.booking.getValue().search : null,
      input: this.booking.getValue() ? this.booking.getValue().input : null,
    };

    this.booking.next(booking);
  }

  /**
   * Returns only option from current booking
   */
  getOption(): Option {
    return this.booking.getValue().option;
  }

  /**
   * Updates the search from the current booking
   * @param search new search criteria
   */
  setSearch(search: Search) {
    const booking: BookingDetail = {
      option: this.booking.getValue() ? this.booking.getValue().option : null,
      hotelInfo: this.booking.getValue()
        ? this.booking.getValue().hotelInfo
        : null,
      search: search,
      input: this.booking.getValue() ? this.booking.getValue().input : null,
    };

    this.booking.next(booking);
  }

  /**
   * Returns only search from current bookin
   */
  getSearch(): Search {
    return this.booking.getValue().search;
  }

  /**
   * Default value for search
   */
  initSearch() {
    this.search = {
      roomsNum: 0,
      adultsNum: 0,
      childsNum: 0,
    };
  }

  /**
   * Sets search from default values
   */
  setSearchValue(criteria: Criteria) {
    this.initSearch();
    criteria.rooms.map(r => {
      this.search.roomsNum++;
      r.paxes.map(pax => {
        if (pax.age >= 18) {
          this.search.adultsNum++;
        } else {
          this.search.childsNum++;
        }
      })
    });

    this.setSearch(this.search);
  }

  /**
 * Updates the hotel book input from the current booking
 * @param input new hotel book input
 */
  setInput(input: HotelBookInput) {
    const booking: BookingDetail = {
      option: this.booking.getValue() ? this.booking.getValue().option : null,
      hotelInfo: this.booking.getValue()
        ? this.booking.getValue().hotelInfo
        : null,
      search: this.booking.getValue() ? this.booking.getValue().search : null,
      input: input,
    };
    this.booking.next(booking);
  }

  /**
   * Returns only hotel book input from current bookin
   */
  getInput(): HotelBookInput {
    return this.booking.getValue().input;
  }
}
