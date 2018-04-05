import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { Response } from "@angular/http";
import {
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbTypeaheadConfig,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import { Criteria } from "app/core/interfaces/criteria";
import { Distribution } from "app/core/interfaces/distribution";
import { Pax } from "app/core/interfaces/pax";
import { BookingService } from "app/core/services/booking.service";
import { NotificationService } from "app/core/services/notification.service";
import { SearchService } from "app/core/services/search.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { MARKETS } from "./../../../core/interfaces/markets";
import {
  getArrayUses,
  getDisabled
} from "./../../../shared/utilities/functions";
import { NgbDateMomentParserFormatter } from "app/shared/utilities/ngbParserFormatter";
import { HubService } from "app/core/services/hub.service";
import { Supplier } from "app/core/interfaces/supplier";
import { Access } from "../../../core/interfaces/access";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { LANGUAGES } from "app/core/interfaces/languages";
import { Country } from "app/core/interfaces/country";
import { CURRENCIES } from "app/core/interfaces/currencies";

@Component({
  selector: "b2b-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.css"],
  providers: [
    NgbTypeaheadConfig,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateMomentParserFormatter
    }
  ]
})
export class AvailabilityComponent implements OnInit, OnDestroy {
  @Output() output = new EventEmitter();
  @Input() bordered: boolean;
  @Input() isEdit: boolean;
  dropdownOffset = "44 6";
  private maNumRooms = 6;
  accessesToSearch: Access[];
  adultAge = 33;
  autocompleteSearch;
  criteria: Criteria;
  criteria_copy: Criteria;
  context: string;
  getDisabled = getDisabled;
  markets = MARKETS;
  languages = LANGUAGES;
  currencies = CURRENCIES;
  maxItems = 5;
  maxNumPaxes = getArrayUses(12, false);
  minDateTo;
  now: NgbDateStruct;
  subscriptions$: Subscription[];
  subscriptionsSearch$: Subscription;
  countryResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.country_name}`;
  countryInputFormatter = (result: any) => result.country_name;
  languageResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.language_name}`;
  languageInputFormatter = (result: any) => result.language_name;
  currencyResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.currency_name}`;
  currencyInputFormatter = (result: any) => result.currency_name;

  constructor(
    private searchService: SearchService,
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private calendar: NgbCalendar,
    private config: NgbTypeaheadConfig,
    private hubService: HubService
  ) {
    this.config.focusFirst = false;
  }

  /**
   * When someone makes a change and reloads the component again,
   * it will appear unchanged
   */
  ngOnInit() {
    this.subscriptions$ = [];
    this.subscriptions$[0] = this.searchService.criteria$.subscribe(res => {
      this.criteria_copy = res;
      this.criteria = JSON.parse(JSON.stringify(res));
      if (this.criteria) {
        this.criteria.items = [];
      }
      this.minDateTo = this.criteria.checkIn;
    });
    this.now = this.calendar.getToday();
    this.minDateTo = this.calendar.getToday();

    // this.criteria = JSON.parse(JSON.stringify(this.criteria_copy));
    // if (this.criteria.items.length > 0) {
    //   this.onAdd(this.criteria.items[0], true);
    // } else {
    //   this.criteria.city = true;
    // }

    this.context = "";
  }

  getDropdownOffset(position) {
    // let XoffsetModifier = 0;
    // let YoffsetModifier = 0;
    // if (this.isEdit) {
    //   XoffsetModifier = 7;
    //   YoffsetModifier = 15;
    // } else {
    //   return '56 6';
    // }
    return "59 6";
    // const lateralOffset = (Number(position.x) - XoffsetModifier) * -1;
    // console.log(YoffsetModifier + ' ' + lateralOffset);
    // return YoffsetModifier + ' ' + lateralOffset;
  }

  marketsFilter = (text$: Observable<string>) =>
    text$
      .debounceTime(250)
      .distinctUntilChanged()
      .map(
        term =>
          term === ""
            ? []
            : this.markets.filter((item: Country) => {
                const name =
                  item.country_name.toLowerCase().indexOf(term) !== -1;

                return item.iso_code.toLowerCase().indexOf(term) !== -1 || name;
              })
      );

  languageFilter = (text$: Observable<string>) =>
    text$
      .debounceTime(250)
      .distinctUntilChanged()
      .map(
        term =>
          term === ""
            ? []
            : this.languages.filter(item => {
                const name =
                  item.language_name.toLowerCase().indexOf(term) !== -1;

                return item.iso_code.toLowerCase().indexOf(term) !== -1 || name;
              })
      );

  currencyFilter = (text$: Observable<string>) =>
    text$
      .debounceTime(250)
      .distinctUntilChanged()
      .map(
        term =>
          term === ""
            ? []
            : this.currencies.filter(item => {
                const name =
                  item.currency_name.toLowerCase().indexOf(term) !== -1;

                return item.iso_code.toLowerCase().indexOf(term) !== -1 || name;
              })
      );

  /**
   * Toggle dates to make a range input
   * Cannot do it in the view because it seems that min date does not update
   * @param eToggle ngbDatepicker
   * @param sToggle ngbDatepicker
   */
  onChange(eToggle: NgbInputDatepicker, sToggle: NgbInputDatepicker) {
    eToggle.close();
    const date = new Date(
      `${this.criteria.checkIn.year}/${this.criteria.checkIn.month}/${
        this.criteria.checkIn.day
      }`
    );
    date.setDate(date.getDate() + 1);
    this.minDateTo.year = date.getFullYear();
    this.minDateTo.month = date.getMonth() + 1;
    this.minDateTo.day = date.getDate();
    sToggle.open();
  }

  /**
   * Makes a request to get a list of hotels and destinations
   * Fills the search component
   */
  public requestAutocompleteItems = (text: string) => {
    return this.hubService
      .destinationSearcher(this.accessesToSearch[0], text)
      .valueChanges.map(res => {
        const searchResponse = [];
        res.data.hotelX.destinationSearcher.map(res => {
          if (res.code) {
            searchResponse.push({
              destination: true,
              value: res.code,
              display: res.texts[0].text,
              key: res.closestDestinations
            });
          } else if (res.hotelCode) {
            searchResponse.push({
              destination: false,
              value: res.hotelCode,
              display: res.hotelName,
              key: res.hotelCode
            });
          }
        });
        return searchResponse;
      });
  };

  /**
   * Sets max items to 5 in case we are selecting hotels and 1 in case it's a city
   */
  onAdd = item => {
    if (item.destination) {
      this.maxItems = 1;
      this.criteria.city = true;
    } else {
      this.maxItems = 5;
      this.criteria.city = false;
    }

    this.criteria.items.push(item);

    return Observable.of(item).filter(() => true);
  };

  /**
   * Removes the item from the selected items and checks if there are more,
   * in case there are none, it sets max items to five and lets insert cities
   * @param item removed item
   * @param index index from the removed item
   */
  onRemoveItem(item, index) {
    if (this.criteria.items.length - 1 === 0) {
      this.maxItems = 5;
      this.criteria.city = true;
    }
    this.criteria.items.splice(index, 1);
  }

  /**
   * Adds a new room with a default configuration
   */
  addRoom() {
    if (this.criteria.rooms.length < 6) {
      this.criteria.rooms.push({ paxes: [{ age: 30 }, { age: 31 }] });
    } else {
      this.notificationService.warning("Cannot add more rooms.");
    }
  }

  /**
   * Remove last room
   */
  removeRoom() {
    this.criteria.rooms.pop();
  }

  /**
   * Emits a search with the criteria object
   */
  onSearch() {
    this.bookingService.setSearchValue(this.criteria);
    this.output.emit({
      criteria: this.criteria
    });
  }

  /**
   * Transforms num children to an object with age
   * @param room
   */
  setPaxes(room: Distribution) {
    for (let i = 0; i < room.paxes.length; i++) {
      if (!room.paxes[i]) {
        room.paxes[i] = <Pax>{ age: 30 };
      }
    }
  }

  saveAccessesToSearch(accessesToSearch) {
    this.accessesToSearch = [...accessesToSearch];
  }

  /**
   * Unsubscribe from all events
   */
  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }
}
