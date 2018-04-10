import { Component, OnInit, OnDestroy } from '@angular/core';
import { HubService } from 'app/core/services/hub.service';
import { CriteriaBooking } from 'app/core/interfaces/criteria-booking';
import { LangService } from '../../../core/services/lang.service';
import { BookingCriteriaType } from '../../../core/enumerates/booking-criteria-type';
import { CriteriaBookingReference } from 'app/core/interfaces/criteria-booking-reference';
import { CriteriaBookingDates } from 'app/core/interfaces/criteria-booking-dates';
import { Access } from 'app/core/interfaces/access';
import {
  getDisabled,
  enumToArray,
  storeResponse,
  decideClosure
} from '../../../shared/utilities/functions';
import { CancelBooking } from '../../../core/interfaces/cancel-booking';
import { NotificationService } from 'app/core/services/notification.service';
import { BookingCriteriaDateType } from 'app/core/enumerates/booking-criteria-date-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbInputDatepicker,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { Board } from 'app/core/interfaces/board';
import { Subscription } from 'rxjs/Subscription';
import { CurrencySelectorService } from 'app/shared/components/selectors/currency-selector/currency-selector.service';
import { RqModalComponent } from 'app/platform/components/rq-modal/rq-modal.component';
import { RsModalComponent } from 'app/platform/components/rs-modal/rs-modal.component';
import { LanguageSelectorService } from '../../../shared/components/selectors/language-selector/language-selector.service';

@Component({
  selector: 'b2b-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  accessesToSearch: Access[];
  myBookingForm: FormGroup;
  getDisabled = getDisabled;
  boards: Board[];
  bookingCriteriaType = BookingCriteriaType;
  bookingCriteriaTypeArray = enumToArray(BookingCriteriaType);
  bookingCriteriaDateType = BookingCriteriaDateType;
  bookingCriteriaDateTypeArray = enumToArray(BookingCriteriaDateType);
  bookings: any[];
  loading: boolean;
  subscriptions$: Subscription[];

  constructor(
    private hubService: HubService,
    private langService: LangService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public calendar: NgbCalendar,
    private dateFormatter: NgbDateParserFormatter,
    private currencySelectorService: CurrencySelectorService,
    private languageSelectorService: LanguageSelectorService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.boards = [];
    this.subscriptions$ = [];
    this.myBookingForm = this.fb.group({
      accessCode: ['', Validators.required],
      language: ['', Validators.required],
      typeSearch: BookingCriteriaType.REFERENCES,
      dates: this.fb.group({
        dateType: BookingCriteriaDateType.ARRIVAL,
        start: this.calendar.getToday(),
        end: this.calendar.getNext(this.calendar.getToday(), 'd', 1)
      }),
      references: this.fb.group({
        hotelCode: '',
        currency: '',
        references: this.fb.group({ client: '', supplier: '' })
      })
    });
    this.myBookingForm.disable();

    this.subscriptions$[
      'currency'
    ] = this.currencySelectorService.currency$.subscribe(res => {
      if (res && res.iso_code) {
        this.myBookingForm.controls['references'].patchValue(
          'currency',
          res.iso_code
        );
      } else {
        this.myBookingForm.controls['references'].patchValue('currency', '');
      }
    });

    this.subscriptions$[
      'language'
    ] = this.languageSelectorService.language$.subscribe(res => {
      if (res && res.iso_code) {
        this.myBookingForm.controls['language'].setValue(res.iso_code);
      } else {
        this.myBookingForm.controls['language'].setValue(null);
      }
    });
  }

  getMyBookings(criteriaBooking: CriteriaBooking) {
    this.loading = true;
    this.bookings = null;
    this.hubService.getMyBookings(criteriaBooking).valueChanges.subscribe(
      res => {
        this.loading = false;
        this.bookings = [];
        storeResponse('myBookingsRS', res);
        if (
          res.data &&
          res.data.hotelX &&
          res.data.hotelX.booking &&
          res.data.hotelX.booking.bookings
        ) {
          this.bookings = JSON.parse(
            JSON.stringify(res.data.hotelX.booking.bookings)
          );
        }
      },
      err => {
        this.notificationService.error(err);
        this.loading = false;
      }
    );
  }

  searchByDate(value) {
    const criteriaBooking: CriteriaBooking = JSON.parse(JSON.stringify(value));
    delete criteriaBooking.references;
    criteriaBooking.dates.start = this.dateFormatter.format(<any>criteriaBooking
      .dates.start);
    criteriaBooking.dates.end = this.dateFormatter.format(<any>criteriaBooking
      .dates.end);
    this.getMyBookings(criteriaBooking);
  }

  searchByReference(value) {
    const criteriaBooking: CriteriaBooking = JSON.parse(JSON.stringify(value));
    delete criteriaBooking.dates;
    this.getMyBookings(criteriaBooking);
  }

  saveAccessesToSearch(accessesToSearch) {
    this.accessesToSearch = [...accessesToSearch];
    this.myBookingForm.patchValue({
      accessCode:
        this.accessesToSearch.length !== 0 ? this.accessesToSearch[0].code : ''
    });
    this.accessesToSearch.length !== 0
      ? this.myBookingForm.enable()
      : this.myBookingForm.disable();
  }

  /**
   * Unsubscribe from all events
   */
  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }

  /**
   * Opens modal to show last request made of myBookings type
   */
  showRequest(booking = false) {
    if (sessionStorage.getItem('interceptedRequest')) {
      const modalRef = this.modalService.open(RqModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.input = 'myBookingsRQ';
    }
  }

  /**
   * Opens modal to show last response got form myBookings request
   */
  showResponse(booking = false) {
    if (sessionStorage.getItem('storedResponses')) {
      const modalRef = this.modalService.open(RsModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.book = 'myBookingsRS';
    }
  }

  decideIfClose(event, datepicker) {
    decideClosure(event, datepicker);
  }
}
