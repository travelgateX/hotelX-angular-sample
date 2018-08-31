import { BindingModalComponent } from '../binding-modal/binding-modal.component';
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelAvail, HotelInfo, Option, Search, Criteria, Board, Price } from 'app/core/interfaces';
import { BookingService } from 'app/core/services/booking.service';
import { HubService } from 'app/core/services/hub.service';
import { GoogleMapsModalComponent } from 'app/platform/components/google-maps-modal/google-maps-modal.component';
import { ValuationModalComponent } from 'app/platform/components/valuation-modal/valuation-modal.component';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';
import { LangService } from './../../../core/services/lang.service';
import { CancelPolicyModalComponent } from './../cancel-policy-modal/cancel-policy-modal.component';
import { HotelInfoDetail, HotelInfoGeocode } from 'app/core/interfaces/hotel-info/';
import { CarouselModalComponent } from 'app/platform/components/carousel-modal/carousel-modal/carousel-modal.component';
import { AlertService } from 'app/shared/services/alert.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RequestStorageService } from '../../../shared/services/request-storage.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { WebConfigService } from '../../../core/services/web-config.service';

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
    private requestStorageService: RequestStorageService,
    private alertService: AlertService,
    private webConfigService: WebConfigService
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
    this.requestStorageService.setCurrentType('quote');
    this.spinnerService.start();
    const lang = this.langService.getLang();

    this.subscriptions$[0] = this.hubService
      .getQuote(
        option.id,
        lang,
        {
          context: this.context,
          client: this.webConfigService.getClient().name,
          testMode: this.webConfigService.getAccess().isTest,
          auditTransactions: true
        }
      )
      .valueChanges.subscribe(
        res => {
          this.requestStorageService.storeRequestResponse(false, res);
          const response = res.data.hotelX.quote;

          if (response.error) {
            this.alertService.setAlert(
              'Quote',
              `Error ({${response.error.type}) ${response.error.code}`,
              'error',
              response.error.description
            );
          }
          if (response.warning) {
            this.alertService.setAlert(
              'Quote',
              `Warning ({${response.warning.type}) ${response.warning.code}`,
              'warning',
              response.warning.description
            );
          }

          this.alertService.setAlertMultiple(
            'Quote',
            'warning',
            response.warnings
          );

          this.alertService.setAlertMultiple('Quote', 'error', response.errors);
          if (response.errors) {
            this.notificationService.error(
              response.errors.map(x => x.description).join('\n')
            );
            this.spinnerService.stop();
            return;
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
          this.alertService.setAlert('Quote', `Unhandled error`, 'error', err);
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
    if (this.hotelDetailInfo && this.hotelDetailInfo.medias) {
      this.hotelDetailInfo.medias.map(media => {
        if (media.url) {
          this.images.push(media.url);
        }
      });
      if (!this.images || this.images.length === 0) {
        this.images.push(this.defaultImage);
      }
    }
  }
}
