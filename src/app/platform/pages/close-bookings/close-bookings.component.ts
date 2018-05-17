import { LangService } from './../../../core/services/lang.service';
import { HotelBookPayload } from 'app/core/interfaces/hotel-book-payload';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HubService } from 'app/core/services/hub.service';
import { BookingService } from 'app/core/services/booking.service';
import { BookingDetail } from 'app/core/interfaces/booking-detail';
import { Router } from '@angular/router';
import { SearchService } from 'app/core/services/search.service';
import { WebConfigService } from '../../../core/services/web-config.service';
import { Subscription } from 'apollo-client/util/Observable';
import { AlertService } from '../../../shared/services/alert.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RequestStorageService } from '../../../shared/services/request-storage.service';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'b2b-close-bookings',
  templateUrl: './close-bookings.component.html',
  styleUrls: ['./close-bookings.component.css']
})
export class CloseBookingsComponent implements OnInit, OnDestroy {
  book: HotelBookPayload;
  bookingDetail: BookingDetail;
  bookingSubscription: Subscription;

  errorSubscription: Subscription;
  warningSubscription: Subscription;
  loading$;
  errors: any[];
  warnings: any[];

  constructor(
    private spinnerService: SpinnerService,
    private hubService: HubService,
    private notificationService: NotificationService,
    private bookingService: BookingService,
    private router: Router,
    private searchService: SearchService,
    private langService: LangService,
    private webConfigService: WebConfigService,
    private requestStorageService: RequestStorageService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.spinnerService.start();
    this.loading$ = this.spinnerService.loading$;
    this.bookingSubscription = this.bookingService.booking$.subscribe(
      res => {
        this.bookingDetail = res;
        this.getBook();
      },
      err => {
        this.notificationService.error(err);
        this.spinnerService.stop();
      }
    );
    this.errorSubscription = this.alertService.error$.subscribe(err => {
        this.errors = err.filter( e => e.name === 'Book');
    });

    this.warningSubscription = this.alertService.warning$.subscribe(warning => {
      this.warnings = warning.filter( w => w.name === 'Book');
    });
  }

  /**
   * Gets an hotel book
   */
  getBook() {
    this.requestStorageService.setCurrentType('book');
    if (this.bookingDetail && this.bookingDetail.input) {
      const lang = this.langService.getLang();
      this.bookingDetail.input.language = lang;
      this.hubService
        .getBook(this.bookingDetail.input, this.webConfigService.getContext(), this.webConfigService.getClient())
        .subscribe(
          res => {
            this.requestStorageService.storeRequestResponse(false, res);
            if (res.errors) {
              this.notificationService.handleIError(res.errors);
              this.alertService.setAlert(
                'Book',
                `Error ({${res.errors.type}) ${res.errors.code}`,
                'error',
                res.error.description
              );
            }

            if (res.warnings) {
              this.notificationService.handlIWarning(res.warnings);
              this.alertService.setAlert(
                'Book',
                `Warning ({${res.warnings.type}) ${res.warnings.code}`,
                'warning',
                res.warning.description
              );
            }
            this.book = res.data.hotelX.book;
            if (this.book && this.book.errors) {
              this.alertService.setAlertMultiple(
                'Book',
                'error',
                this.book.errors
              );
            }
            if (this.book && this.book.warnings) {
              this.alertService.setAlertMultiple(
                'Book',
                'warning',
                this.book.warnings
              );
            }
            this.spinnerService.stop();
          },
          err => {
            console.log(err);
            this.spinnerService.stop();
            this.notificationService.error(err);
            this.alertService.setAlert('Book', `Unhandled error`, 'error', err);
          }
        );
    } else {
      this.spinnerService.stop();
    }
  }

  /**
   * Executes a new search availability
   * @param criteria
   */
  onSearch(event) {
    if (event.criteria) {
      this.searchService.setCriteria(event.criteria);
    }
    this.router.navigate(['/platform/results-bookings']);
  }

  ngOnDestroy() {
    this.bookingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.warningSubscription.unsubscribe();
  }
}
