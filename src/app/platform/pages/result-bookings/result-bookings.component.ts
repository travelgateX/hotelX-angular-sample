import { HotelAvail } from './../../../core/interfaces/hotel-avail';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Criteria } from 'app/core/interfaces/criteria';
import { CriteriaSearch } from 'app/core/interfaces/criteria-search';
import { HotelInfo } from 'app/core/interfaces/hotel-info';
import { Option } from 'app/core/interfaces/option';
import { Search } from 'app/core/interfaces/search';
import { BookingService } from 'app/core/services/booking.service';
import { HubService } from 'app/core/services/hub.service';
import { NotificationService } from 'app/core/services/notification.service';
import { SearchService } from 'app/core/services/search.service';
import { SpinnerService } from 'app/core/services/spinner.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';
import { LangService } from './../../../core/services/lang.service';
import { EditCriteriaModalComponent } from './../../components/edit-criteria-modal/edit-criteria-modal.component';
import { HotelInfoDetail } from 'app/core/interfaces/hotel-info/hotel-info-detail';
import { Access } from '../../../core/interfaces/access';
import { Board } from 'app/core/interfaces/board';
import { Category } from 'app/core/interfaces/category';
import { WebConfigService } from '../../../core/services/web-config.service';
import { RsModalComponent } from 'app/platform/components/rs-modal/rs-modal.component';
import { RqModalComponent } from 'app/platform/components/rq-modal/rq-modal.component';
import { loadRequest, storeResponse, loadResponse } from 'app/shared/utilities/functions';

@Component({
  selector: "b2b-result-bookings",
  templateUrl: "./result-bookings.component.html",
  styleUrls: ["./result-bookings.component.css"]
})
export class ResultBookingsComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription[];
  allAvailability: HotelAvail[];
  copyAvailability: HotelAvail[];
  availability: HotelAvail[];
  hotels: HotelInfo[];
  hotelsDetailInfo: HotelInfoDetail[];
  criteriaSearch: CriteriaSearch;
  page: number;
  itemsPerPage: number;
  mealplans: Board[];
  categories: Category[];
  search: Search;
  criteria: Criteria;
  access: Access[];
  context: string;
  filter: {
    codeName: string | null;
    category: number | null;
    rate: string | null;
    boardCode: string | null;
    price: string | null;
  };
  environment: any;
  test = "-";

  constructor(
    private hubService: HubService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private searchService: SearchService,
    private spinnerService: SpinnerService,
    private bookingService: BookingService,
    private langService: LangService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.initVariables();
    this.subscriptions$[0] = this.searchService.criteria$.subscribe(res => {
      this.spinnerService.start();
      this.criteria = JSON.parse(JSON.stringify(res));
      this.access = [this.webConfigService.getAccess()];
      this.context = this.webConfigService.getContext();
      this.getAvailability();
      this.mealplans = [];
      this.getBoards();
      this.categories = [];
      this.getCategories();
    });
    this.bookingService.booking$.subscribe(
      res => {
        if (!res || !res.hasOwnProperty("search")) {
          this.bookingService.setSearchValue(this.criteria);
        } else {
          this.search = res.search;
        }
      },
      err => this.notificationService.error(err)
    );
    this.environment = environment;
  }

  /**
   * Init variables
   */
  initVariables() {
    this.subscriptions$ = [];
    this.itemsPerPage = 5;
    this.resetAvailability();
    this.hotels = [];
    this.page = 1;
    this.filter = {
      codeName: "",
      category: null,
      rate: null,
      boardCode: null,
      price: null
    };
    this.hotels = [];
  }

  /**
   * Check that criteria has hotels and in case it has, executes an availability request
   */
  getAvailability() {
    this.clearFilter();
    const lang = this.langService.getLang();
    this.searchService.transform(this.criteria).then(hotelCriteriaSearch => {
      if (this.criteria.items.length) {
        this.subscriptions$[1] = this.hubService
          .getAvailability(hotelCriteriaSearch, this.access, this.context)
          .valueChanges.subscribe(
            res => {
              const response = res.data.hotelX.search;
              storeResponse('hotelRS', response);

              if (response) {
                if (response.errors) {
                  this.notificationService.error(
                    res.data.hotelX.search.errors
                      .map(x => x.description)
                      .join("\n")
                  );
                }

                if (response.warnings) {
                  console.log(response.warnings);
                }

                if (!response.options || response.options.length === 0) {
                  this.resetAvailability();
                  this.spinnerService.stop();
                } else {
                  // this.getHotels(response);
                  this.getHotelsDetailInfo(response);
                }
              } else {
                this.resetAvailability();
                this.spinnerService.stop();
              }
            },
            err => {
              this.resetAvailability();
              this.notificationService.error(err);
              this.spinnerService.stop();
            }
          );
      }
    });
  }

  /**
   * Executes an hotel info request and merges the current availability response with hotels information
   * @param response code of the hotels availables
   */
  getHotelsDetailInfo(response) {
    const hotelsMap = new Map<string, string>();
    response.options.forEach(option => {
      if (!hotelsMap.has(option.hotelCode)) {
        hotelsMap.set(option.hotelCode, option.hotelCode);
      }
    });
    this.subscriptions$[2] = this.hubService
      .getHotelInfo(
        Array.from(hotelsMap.values()),
        this.access,
        this.langService.getLang()
      )
      .valueChanges.subscribe(
        hotelsDetailInfo => {
          this.hotelsDetailInfo = hotelsDetailInfo.data.hotelX.hotels.edges;
          if (this.hotelsDetailInfo) {
            this.allAvailability = this.hubService.transformAvailability(
              response,
              this.hotelsDetailInfo
            );
            this.copyAvailability = JSON.parse(
              JSON.stringify(this.allAvailability)
            );
            this.filterPrice();
            this.availability = JSON.parse(
              JSON.stringify(this.copyAvailability)
            );
          }
          this.spinnerService.stop();
        },
        err => {
          this.notificationService.error(err);
          this.spinnerService.stop();
        }
      );
  }

  /**
   * Recovers the detailInfo for a specified hotel
   * @param hotel Hotel required to obtain the detailInfo
   */
  getHotelDetailInfo(hotel) {
    if (hotel.options && hotel.options.length > 0) {
      hotel = hotel.options[0];
    }
    if (this.hotelsDetailInfo) {
      const result = this.hotelsDetailInfo.filter(item => {
        if (item && item["node"] && item["node"].hotelData) {
          return item["node"].hotelData.hotelCode === hotel.hotelCode;
        }
      });
      if (result[0] && result[0]["node"].hotelData) {
        return result[0]["node"].hotelData;
      }
    }
    return undefined;
  }

  /**
   * Executes a boards request to obtain the mealplans availables
   */
  getBoards() {
    this.subscriptions$[3] = this.hubService
      .getBoards(this.access, this.langService.getLang())
      .valueChanges.subscribe(res => {
        res.data.hotelX.boards.edges.map(board => {
          if (board.node && board.node.boardData) {
            this.mealplans.push(board.node.boardData);
          }
        });
      });
  }

  /**
   * Executes a categories request to obtain the categories availables
   */
  getCategories() {
    this.subscriptions$[4] = this.hubService
      .getCategories(this.access, this.langService.getLang())
      .valueChanges.subscribe(res => {
        res.data.hotelX.categories.edges.map(category => {
          if (category.node && category.node.categoryData) {
            this.categories.push(category.node.categoryData);
          }
        });
      });
  }

  /**
   * Edits criteria search
   */
  openModalEdit() {
    const modalRef = this.modalService.open(EditCriteriaModalComponent, {
      size: "lg",
      keyboard: false,
      backdrop: "static"
    });
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(event => {
      if (event.criteria) {
        this.searchService.setCriteria(event.criteria);
      }
    });
  }

  /**
   * Opens modal to show last request made of hotel type
   */
  showRequest() {
    if (sessionStorage.getItem('interceptedRequest')) {
      const modalRef = this.modalService.open(RqModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      const request = loadRequest('hotelRQ');
      modalRef.componentInstance.input = request;
    }
  }

  /**
   * Opens modal to show last response got form hotel request
   */
  showResponse() {
    if (sessionStorage.getItem('storedResponses')) {
      const modalRef = this.modalService.open(RsModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      const response = loadResponse('hotelRS');
      modalRef.componentInstance.book = response;
    }
  }

  /**
   * Clears filter
   */
  clearFilter() {
    this.filter = {
      codeName: "",
      category: null,
      rate: null,
      boardCode: null,
      price: null
    };
    this.page = 1;
    this.availability = JSON.parse(JSON.stringify(this.allAvailability));
  }

  /**
   * Filters by board code
   * Boardcode can be MP, PC, SA, HD, TI or null
   * @param option current option
   * @param passFilter the current option still passes the filter
   */
  private filterBoardCode(option: Option, passFilter: boolean): boolean {
    if (this.filter.boardCode && passFilter) {
      if (option.boardCode !== this.filter.boardCode) {
        return false;
      }
    }
    return true;
  }

  /**
   * Filters by rate
   * Rate can be NRF, PACKAGE, NRF & PACKAGE, EMPTY or null
   * @param option current option
   * @param passFilter the current option still passes the filter
   */
  private filterRate(option: Option, passFilter: boolean): boolean {
    let passed = true;
    if (this.filter.rate !== null && passFilter) {
      const rate = option.rateRules;
      switch (this.filter.rate) {
        case "empty":
          if (rate !== null) {
            passed = false;
          }
          break;
        case "both":
          if (
            rate === null ||
            rate.length !== 2 ||
            !rate.includes("NON_REFUNDABLE") ||
            !rate.includes("PACKAGE")
          ) {
            passed = false;
          }
          break;
        default:
          if (rate === null || !rate.includes(this.filter.rate)) {
            passed = false;
          }
          break;
      }
    }
    return passed;
  }

  /**
   * Filters by hotel code or hotel name
   * Codename could be the code or the hotel name.
   * It only verifies that it contains it, not that it totally matches.
   * @param option current option
   * @param passFilter the current option still passes the filter
   */
  filterHotelCodeName(hotel) {
    let pass = false;
    if (this.filter.codeName) {
      const val = this.filter.codeName.toUpperCase();
      if (hotel.hotelName && hotel.hotelName.toUpperCase().includes(val)) {
        pass = true;
      } else if (
        hotel.hotelCode &&
        hotel.hotelCode.toUpperCase().includes(val)
      ) {
        pass = true;
      }
    } else {
      pass = true;
    }
    return pass;
  }

  /**
   * Filters the hotels for a specified category
   * @param hotel
   */
  filterCategory(hotelDetail) {
    let pass = false;
    if (this.filter.category) {
      const val = this.filter.category;
      if (hotelDetail.categoryCode && hotelDetail.categoryCode === val) {
        pass = true;
      }
    } else {
      pass = true;
    }
    return pass;
  }

  /**
   * Filters the hotels for price
   * @param hotel
   */
  filterPrice() {
    switch (this.filter.price) {
      case "DESC":
        this.copyAvailability.sort((a, b) => {
          return b.options[0].price.net - a.options[0].price.net;
        });
        break;
      case "ASC":
        this.copyAvailability.sort((a, b) => {
          return a.options[0].price.net - b.options[0].price.net;
        });
        break;
      default:
        this.copyAvailability.sort((a, b) => {
          return a.options[0].price.net - b.options[0].price.net;
        });
        break;
    }
  }

  /**
   * Filters the hotels
   * @param hotel
   */
  filterAvailability() {
    let hotelDetailInfo;
    this.page = 1;
    this.copyAvailability = JSON.parse(JSON.stringify(this.allAvailability));

    this.copyAvailability = this.copyAvailability.filter(
      (hotel: HotelAvail) => {
        hotelDetailInfo = this.getHotelDetailInfo(hotel);
        if (
          this.filterHotelCodeName(hotelDetailInfo) &&
          this.filterCategory(hotelDetailInfo)
        ) {
          hotel.options = hotel.options.filter((option: Option) => {
            let passFilter = true;
            if (!this.filterBoardCode(option, passFilter)) {
              passFilter = false;
            }
            if (!this.filterRate(option, passFilter)) {
              passFilter = false;
            }

            if (passFilter) {
              return option;
            }
          });
          if (hotel.options.length !== 0) {
            return hotel;
          }
        }
      }
    );

    this.filterPrice();
    this.availability = JSON.parse(JSON.stringify(this.copyAvailability));
  }

  /**
   * Reset the availabity
   */
  resetAvailability() {
    this.allAvailability = [];
    this.copyAvailability = [];
    this.availability = [];
  }

  /**
   * Unsubscribe from all the subscriptions
   */
  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }
}
