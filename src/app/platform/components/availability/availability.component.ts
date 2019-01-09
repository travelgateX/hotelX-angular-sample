import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbTypeaheadConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import {
  Criteria,
  Distribution,
  Pax,
  Access,
  Country,
  Client
} from 'app/core/interfaces';
import { BookingService } from 'app/core/services/booking.service';
import { SearchService } from 'app/core/services/search.service';
import { Observable, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MARKETS } from './../../../core/interfaces/markets';
import { getArrayUses } from './../../../shared/utilities/functions';
import { NgbDateMomentParserFormatter } from 'app/shared/utilities/ngbParserFormatter';
import { HubService } from 'app/core/services/hub.service';
import { decideClosure } from 'app/shared/utilities/functions';
import { CurrencySelectorService } from '../../../shared/components/selectors/currency-selector/currency-selector.service';
import { LanguageSelectorService } from '../../../shared/components/selectors/language-selector/language-selector.service';
import { MarketSelectorService } from '../../../shared/components/selectors/market-selector/market-selector.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ClientSelectorService } from '../../../shared/components/selectors/client-selector/client-selector.service';
import { SupplierAccessesService } from '../supplier-accesses/supplier-accesses.service';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'b2b-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  providers: [
    NgbTypeaheadConfig,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateMomentParserFormatter
    }
  ]
})
export class AvailabilityComponent implements OnInit, OnDestroy {
  @Output()
  output = new EventEmitter();
  @Input()
  bordered: boolean;
  @Input()
  isEdit: boolean;
  dropdownOffset = '44 6';
  private maNumRooms = 6;
  accessesToSearch: Access[];
  adultAge = 33;
  autocompleteSearch;
  client: Client;
  criteria: Criteria;
  criteria_copy: Criteria;
  context: string;
  markets = MARKETS;
  maxItems = 5;
  maxNumPaxes = getArrayUses(12, false);
  minDateTo;
  clientSP: any;
  supplierSP: any;
  now: NgbDateStruct;
  subscriptions$: Subscription[];
  subscriptionsSearch$: Subscription;
  configInputsHidden: boolean = true;
  countryResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.country_name}`;
  countryInputFormatter = (result: any) => result.country_name;
  languageResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.language_name}`;
  languageInputFormatter = (result: any) => result.language_name;
  availabilities = [];
  groupConfig = new Map([
    [
      false,
      {
        title: 'Hotels',
        display: function(item) {
          return `${item.display} - [hotel in ${item.location.city} - (${
            item.location.country
          }) - (${item.value})]`;
        }
      }
    ],
    [
      true,
      {
        title: 'Destinations',
        display: function(item) {
          return `${item.display} - (${item.value})`;
        }
      }
    ]
  ]);

  constructor(
    private searchService: SearchService,
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private calendar: NgbCalendar,
    private config: NgbTypeaheadConfig,
    private hubService: HubService,
    private currencySelectorService: CurrencySelectorService,
    private languageSelectorService: LanguageSelectorService,
    private marketSelectorService: MarketSelectorService,
    private clientSelectorService: ClientSelectorService,
    private supplierAccessesService: SupplierAccessesService,
    private spinnerService: SpinnerService
  ) {
    this.config.focusFirst = false;
  }

  /**
   * When someone makes a change and reloads the component again,
   * it will appear unchanged
   */
  ngOnInit() {
    this.spinnerService.start();
    this.subscriptions$ = [];
    this.subscriptions$['criteria'] = this.searchService.criteria$.subscribe(
      res => {
        this.criteria_copy = res;
        this.criteria = JSON.parse(JSON.stringify(res));
        if (this.criteria) {
          this.criteria.items = [];
        }
        this.minDateTo = this.criteria.checkIn;
      }
    );
    this.now = this.calendar.getToday();
    this.minDateTo = this.calendar.getToday();

    this.subscriptions$[
      'currency'
    ] = this.currencySelectorService.currency$.subscribe(res => {
      this.criteria.currency = res;
    });

    this.subscriptions$[
      'language'
    ] = this.languageSelectorService.language$.subscribe(res => {
      this.criteria.language = res;
    });

    this.subscriptions$[
      'market'
    ] = this.marketSelectorService.market$.subscribe(res => {
      this.criteria.market = res;
      this.criteria.nationality = res;
    });

    this.subscriptions$[
      'client'
    ] = this.clientSelectorService.clientSelected$.subscribe(res => {
      this.client = res;
    });
    this.subscriptions$[
      'clientSpinner'
    ] = this.clientSelectorService.clientSpinner.subscribe(res => {
      this.clientSP = res;
      this.checkLength();
    });
    this.subscriptions$[
      'supplierSpinner'
    ] = this.supplierAccessesService.supplierSpinner.subscribe(res => {
      this.supplierSP = res;
      this.checkLength();
    });

    // this.criteria = JSON.parse(JSON.stringify(this.criteria_copy));
    // if (this.criteria.items.length > 0) {
    //   this.onAdd(this.criteria.items[0], true);
    // } else {
    //   this.criteria.city = true;
    // }

    this.context = '';
  }

  checkLength() {
    if (
      this.clientSP &&
      this.supplierSP &&
      (this.clientSP > 1 ||
        this.supplierSP > 1 ||
        this.clientSP < 1 ||
        this.supplierSP < 1)
    ) {
      this.configInputsHidden = false;
    }

    if (
      this.clientSP !== null &&
      this.clientSP !== undefined &&
      (this.supplierSP !== null && this.supplierSP !== undefined)
    ) {
      this.spinnerService.stop();
    }
  }

  decideIfClose(event, datepicker) {
    decideClosure(event, datepicker);
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
    return '59 6';
    // const lateralOffset = (Number(position.x) - XoffsetModifier) * -1;
    // console.log(YoffsetModifier + ' ' + lateralOffset);
    // return YoffsetModifier + ' ' + lateralOffset;
  }

  marketsFilter = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .pipe(
        map(
          term =>
            term === ''
              ? []
              : this.markets.filter((item: Country) => {
                  const name =
                    item.country_name.toLowerCase().indexOf(term) !== -1;

                  return (
                    item.iso_code.toLowerCase().indexOf(term) !== -1 || name
                  );
                })
        )
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
    setTimeout( _=> sToggle.open(), 50);
  }

  /**
   * Makes a request to get a list of hotels and destinations
   * Fills the search component
   */
  public requestAutocompleteItems = (text: string) => {
    return this.hubService
      .destinationSearcher(this.accessesToSearch[0], text)
      .valueChanges.pipe(
        map(res => {
          const searchResponse = [];
          res.data.hotelX.destinationSearcher.map(ds => {
            if (ds.code) {
              searchResponse.push({
                destination: true,
                value: ds.code,
                display: ds.texts[0].text,
                key: ds.closestDestinations
              });
            } else if (ds.hotelCode) {
              searchResponse.push({
                destination: false,
                value: ds.hotelCode,
                display: ds.hotelName,
                key: ds.hotelCode,
                location: ds.location
              });
            }
          });
          return searchResponse;
        })
      );
  };

  /**
   * Makes a request to get a list of hotels and destinations
   * Fills the search component
   */
  public autocompleteObservable = (text: string) => {
    if (this.accessesToSearch && this.accessesToSearch.length) {
      const availabilitiesSubscription = this.hubService
        .destinationSearcher(this.accessesToSearch[0], text)
        .valueChanges.subscribe(res => {
          const searchResponse = [];
          res.data.hotelX.destinationSearcher.map(ds => {
            if (ds.code) {
              searchResponse.push({
                destination: true,
                value: ds.code,
                display: ds.texts[0].text,
                key: ds.closestDestinations
              });
            } else if (ds.hotelCode) {
              searchResponse.push({
                destination: false,
                value: ds.hotelCode,
                display: ds.hotelName,
                key: ds.hotelCode,
                location: ds.location
              });
            }
          });
          availabilitiesSubscription.unsubscribe();
          this.availabilities = searchResponse;
        });
    }
  };

  /**
   * Sets max items to 5 in case we are selecting hotels and 1 in case it's a city
   */
  // onAdd = item => {
  //   console.log(item)
  //   if (item.destination) {
  //     this.maxItems = 1;
  //     this.criteria.city = true;
  //   } else {
  //     this.maxItems = 5;
  //     this.criteria.city = false;
  //   }
  // };

  setCriteriaItems(items) {
    this.criteria.items = items;
  }

  /**
   * Removes the item from the selected items and checks if there are more,
   * in case there are none, it sets max items to five and lets insert cities
   * @param item removed item
   * @param index index from the removed item
   */
  // onRemoveItem(item, index) {
  //   if (this.criteria.items.length - 1 === 0) {
  //     this.maxItems = 5;
  //     this.criteria.city = true;
  //   }
  //   this.criteria.items.splice(index, 1);
  // }

  /**
   * Adds a new room with a default configuration
   */
  addRoom() {
    if (this.criteria.rooms.length < 6) {
      this.criteria.rooms.push({ paxes: [{ age: 30 }, { age: 31 }] });
    } else {
      this.notificationService.warning('Cannot add more rooms.');
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
    const checkIn = this.criteria.checkIn;
    const checkOut = this.criteria.checkOut;
 
    if(new Date(`${checkIn.year}-${checkIn.month}-${checkIn.day}`) > new Date(`${checkOut.year}-${checkOut.month}-${checkOut.day}`)){
      this.criteria.checkIn = checkOut;
      this.criteria.checkOut = checkIn;
    }
    
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
