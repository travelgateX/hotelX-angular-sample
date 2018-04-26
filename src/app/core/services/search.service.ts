import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Criteria } from 'app/core/interfaces/criteria';
import { Room } from 'app/core/interfaces/room';
import { Occupancy } from 'app/core/interfaces/occupancy';
import { HotelInfo } from 'app/core/interfaces/hotel-info';
import { Distribution } from 'app/core/interfaces/distribution';
import { CriteriaSearch } from 'app/core/interfaces/criteria-search';
import { environment } from 'environments/environment';
import { Access } from '../interfaces/access';
import { HubService } from './hub.service';
import { WebConfigService } from './web-config.service';
import { Country } from 'app/core/interfaces/country';
import { LangService } from 'app/core/services/lang.service';
import { LANGUAGES } from 'app/core/interfaces/languages';

/**
 * Handles search criteria for availability request
 */
@Injectable()
export class SearchService {
  private criteria = new BehaviorSubject<Criteria>(null);
  criteria$ = this.criteria.asObservable();
  languages = LANGUAGES;

  /**
   * Inits a default criteria
   * @param dateFormatter NgbDateParserFormatter
   * @param calendar NgbCalendar
   */
  constructor(
    private dateFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private hubService: HubService,
    private webConfigService: WebConfigService,
    private langService: LangService
  ) {
    if (!this.criteria.value) {
      this.getCriteria();
    }
  }

  /**
   * Init default criteria
   */
  setDefault() {
    const today = this.calendar.getToday();
    const tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    const language = {};
    language['iso_code'] = this.langService.getLang();
    language['language_name'] = this.languages.find(
      item => (item.iso_code = language['iso_code'])
    ).language_name;
    const defaultCriteria: Criteria = {
      rooms: [{ paxes: [{ age: 30 }, { age: 30 }] }],
      checkIn: today,
      checkOut: tomorrow,
      city: false,
      items: [],
      market: {
        iso_code: 'es',
        country_name: 'Spain'
      },
      language: {
        iso_code: language['iso_code'] ? language['iso_code'] : 'es',
        language_name: language['language_name']
          ? language['language_name']
          : 'Spanish'
      },
      nationality: {
        iso_code: 'es',
        country_name: 'Spain'
      }
    };

    this.setCriteria(defaultCriteria);
  }

  /**
   * Saves criteria inside localstorage and puts a new value into the observable
   * @param criteria
   */
  setCriteria(criteria: Criteria) {
    this.criteria.next(criteria);
    localStorage.setItem('criteria', JSON.stringify(criteria));
  }

  /**
   * Gets a criteria from the localstorage and puts a new value into the observable in case is not empty
   */
  getCriteria() {
    const criteria = JSON.parse(localStorage.getItem('criteria'));

    if (criteria) {
      criteria.checkIn = this.dateFormatter.parse(
        criteria.checkIn.year +
          '-' +
          criteria.checkIn.month +
          '-' +
          criteria.checkIn.day
      );
      criteria.checkOut = this.dateFormatter.parse(
        criteria.checkOut.year +
          '-' +
          criteria.checkOut.month +
          '-' +
          criteria.checkOut.day
      );
      this.criteria.next(criteria);
    } else {
      this.setDefault();
    }
  }

  /**
   * Transforms criteria search to criteria type
   * @param criteria
   */
  async transform(criteria): Promise<CriteriaSearch> {
    const criteriaSearch: CriteriaSearch = {
      checkIn: this.dateFormatter.format(criteria.checkIn),
      checkOut: this.dateFormatter.format(criteria.checkOut),
      hotels: await this.transformItemsToHotels(criteria.items),
      occupancies: this.transformRoomsToOcupancies(criteria.rooms),
      market: criteria.market ? criteria.market.iso_code : null,
      language: criteria.language ? criteria.language.iso_code : null,
      nationality: criteria.nationality
        ? criteria.nationality.iso_code.toUpperCase()
        : null,
      currency: criteria.currency ? criteria.currency.iso_code : null
    };
    return criteriaSearch;
  }

  /**
   * Transforms items to an array of hotel codes
   * @param items array of hotels
   */
  async transformItemsToHotels(items): Promise<string[]> {
    const hotelCodes = [];
    if (items.length === 1 && items[0].destination) {
      const res = await this.hubService.getHotelCodesDestination(
        [this.webConfigService.getAccess()],
        items[0].key
      );
      res.data.hotelX.hotels.edges.forEach(element => {
        if (
          element.node &&
          element.node.hotelData &&
          element.node.hotelData.hotelCode
        ) {
          hotelCodes.push(element.node.hotelData.hotelCode);
        }
      });
    } else {
      items.forEach(item => {
        hotelCodes.push(item.value);
      });
    }
    return hotelCodes;
  }

  /**
   * Transforms a hotel to a simmple object
   * @param hotels HotelInfo
   */
  transformHotelsToItem(hotels: HotelInfo[]) {
    return hotels.map(h => {
      return Object.assign(h, { display: h.name, value: h.code });
    });
  }

  /** TODO Discover intention of the function
   * Transforms an occupancy to a Room array object
   * @param occupancies Occupancy
   */
  transformOcupanciesToRooms(occupancies: Occupancy[]): Distribution[] {
    return occupancies.map(r => {
      let adults = 0;
      let children = 0;
      let childrens = [];
      r.paxes.forEach(p => {
        if (+p.age !== 30) {
          children += 1;
          childrens.push({ age: +p.age });
        } else {
          adults += 1;
        }
      });
      if (childrens.length === 0) {
        childrens = null;
      }
      return <Distribution>{
        paxes: childrens
      };
    });
  }

  /**
   * Transforms a room to an Occupancy array object
   * @param rooms Room
   */
  transformRoomsToOcupancies(rooms: Distribution[]): Occupancy[] {
    const occupancies: Occupancy[] = [];
    rooms.forEach(r => {
      const room = <Occupancy>{ paxes: [] };
      if (r.paxes) {
        room.paxes = room.paxes.concat(
          r.paxes.map(x => {
            return { age: +x.age };
          })
        );
      }
      occupancies.push(room);
    });
    return occupancies;
  }
}
