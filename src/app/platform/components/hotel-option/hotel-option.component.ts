import { BindingModalComponent } from '../binding-modal/binding-modal.component';
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelAvail } from 'app/core/interfaces/hotel-avail';
import { HotelInfo } from 'app/core/interfaces/hotel-info';
import { Option } from 'app/core/interfaces/option';
import { Search } from 'app/core/interfaces/search';
import { BookingService } from 'app/core/services/booking.service';
import { HubService } from 'app/core/services/hub.service';
import { NotificationService } from 'app/core/services/notification.service';
import { SpinnerService } from 'app/core/services/spinner.service';
import { GoogleMapsModalComponent } from 'app/platform/components/google-maps-modal/google-maps-modal.component';
import { ValuationModalComponent } from 'app/platform/components/valuation-modal/valuation-modal.component';
import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';
import { Criteria } from './../../../core/interfaces/criteria';
import { LangService } from './../../../core/services/lang.service';
import { CancelPolicyModalComponent } from './../cancel-policy-modal/cancel-policy-modal.component';
import { HotelInfoDetail } from 'app/core/interfaces/hotel-info/hotel-info-detail';
import { EditCriteriaModalComponent } from 'app/platform/components/edit-criteria-modal/edit-criteria-modal.component';
import { CarouselModalComponent } from 'app/platform/components/carousel-modal/carousel-modal/carousel-modal.component';
import { HotelInfoGeocode } from 'app/core/interfaces/hotel-info/geocode';
import { Board } from 'app/core/interfaces/board';
import { RequestStorageService } from 'app/core/services/request-storage.service';
import { Price } from '../../../core/interfaces/price';

@Component({
  selector: 'b2b-hotel-option',
  templateUrl: './hotel-option.component.html',
  styleUrls: ['./hotel-option.component.css']
})
export class HotelOptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hotel: HotelAvail;
  @Input() hotelDetailInfo: HotelInfoDetail;
  @Input() search: Search;
  @Input() criteria: Criteria;
  @Input() mealplansAvailable: Board[];
  @Input() context: string;
  private subscriptions$: Subscription[];
  imageErrors: Object[];
  const = 5;
  total = 0;
  counter = 0;
  mediaMainImageIndex: number;
  images: string[] = [];
  defaultImage: string;
  useDefaultImage: boolean;
  environment = environment;

  constructor(
    private hubService: HubService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private bookingService: BookingService,
    private langService: LangService,
    private requestStorageService: RequestStorageService
  ) {}

  ngOnInit() {
    this.subscriptions$ = [];
    this.imageErrors = [];
    this.mediaMainImageIndex = 0;
    if (this.hotel) {
      this.total = this.hotel.options ? this.hotel.options.length : 0;
    } else {
      this.total = 0;
    }
    this.counter = this.total < 2 ? this.total : 2;
    this.useDefaultImage = true;
    this.defaultImage =
      'http://cdn.roomdi.com/contenidosShared/fotos/agregadorHotelero/fotos_hotelv4/1/355/7.jpg?f=1612252115';
  }

  ngOnChanges() {
    if (this.hotelDetailInfo) {
      this.addImagesAvailable();
    }
  }

  /**
   * Shows more hotel options
   */
  showMore() {
    this.counter + this.const > this.total
      ? (this.counter = this.total)
      : (this.counter += this.const);
  }

  /**
   * Shows all the hotel options
   */
  showAll() {
    this.counter = this.total;
  }

  /**
   * Shows less hotel options
   */
  showLess() {
    this.counter = 2;
  }

  openGoogleMaps(hotelInfoGeocode: HotelInfoGeocode) {
    const modalRef = this.modalService.open(GoogleMapsModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.latitude = +hotelInfoGeocode.latitude;
    modalRef.componentInstance.longitude = +hotelInfoGeocode.longitude;
  }

  openBindingModal(price: Price) {
    const modalRef = this.modalService.open(BindingModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.price = price;
  }

  openModalValuation(option: Option, hotelInfo: HotelInfo) {
    this.spinnerService.start();
    const lang = this.langService.getLang();

    this.subscriptions$[0] = this.hubService
      .getQuote(option.id, lang, this.context)
      .valueChanges.subscribe(
        res => {
          const response = res.data.hotelX.quote;
          this.requestStorageService.storeResponse('quoteRS', response);

          if (response.warnings) {
            console.log(response.warnings);
          }

          if (response.errors) {
            this.notificationService.error(
              response.errors.map(x => x.description).join('\n')
            );
          }

          this.bookingService.setHotelInfo(hotelInfo);
          this.bookingService.setOption(option);
          const modalRef = this.modalService.open(ValuationModalComponent, {
            size: 'lg',
            keyboard: false,
            backdrop: 'static'
          });
          modalRef.componentInstance.option = option;
          modalRef.componentInstance.hotelInfo = hotelInfo;
          modalRef.componentInstance.quote = response.optionQuote;
          modalRef.componentInstance.roomsSearch = this.search;

          this.spinnerService.stop();
        },
        err => {
          this.spinnerService.stop();
          this.notificationService.error(err);
        }
      );
  }

  openCancelPolicyModal(cancelPenalties) {
    const modalRef = this.modalService.open(CancelPolicyModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.cancelPenalties = cancelPenalties;
  }

  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }

  mainImage(element) {
    if (this.images[this.mediaMainImageIndex + 1]) {
      this.mediaMainImageIndex++;
    }
  }

  registerBrokenURL(event, imgIndex) {
    this.imageErrors.push({ event: event, imgIndex: imgIndex });
  }

  openModalCarousel() {
    if (
      this.images.length > 1 &&
      this.images.length !== this.imageErrors.length
    ) {
      const modalRef = this.modalService.open(CarouselModalComponent, {
        size: 'lg'
      });
      modalRef.componentInstance.images = this.images;
    }
  }

  addImagesAvailable() {
    this.hotelDetailInfo.medias.forEach(media => {
      if (media.url) {
        this.images.push(media.url);
      }
    });
    if (!this.images || this.images.length === 0) {
      this.images.push(this.defaultImage);
    }
  }
}
