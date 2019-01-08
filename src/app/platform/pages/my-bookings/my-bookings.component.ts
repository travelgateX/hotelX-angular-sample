import { Component, OnInit, OnDestroy } from '@angular/core';
import { HubService } from 'app/core/services/hub.service';
import { CriteriaBooking, Access, Board, Client } from 'app/core/interfaces';
import { BookingCriteriaType } from '../../../core/enumerates/booking-criteria-type';
import {
  getDisabled,
  enumToArray,
  decideClosure
} from '../../../shared/utilities/functions';
import { BookingCriteriaDateType } from 'app/core/enumerates/booking-criteria-date-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CurrencySelectorService } from 'app/shared/components/selectors/currency-selector/currency-selector.service';
import { RqModalComponent } from '../../../shared/components/rq-modal/rq-modal.component';
import { RsModalComponent } from '../../../shared/components/rs-modal/rs-modal.component';
import { LanguageSelectorService } from '../../../shared/components/selectors/language-selector/language-selector.service';
import { AlertService } from 'app/shared/services/alert.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RequestStorageService } from '../../../shared/services/request-storage.service';
import { ClientSelectorService } from '../../../shared/components/selectors/client-selector/client-selector.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { SupplierAccessesService } from '../../components/supplier-accesses/supplier-accesses.service';
import { WebConfigService } from '../../../core/services/web-config.service';

@Component({
  selector: 'b2b-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  accessesToSearch: Access[];
  configInputsHidden = true;
  criteriaBooking: CriteriaBooking;
  myBookingForm: FormGroup;
  getDisabled = getDisabled;
  boards: Board[];
  bookingCriteriaType = BookingCriteriaType;
  bookingCriteriaTypeArray = enumToArray(BookingCriteriaType);
  bookingCriteriaDateType = BookingCriteriaDateType;
  bookingCriteriaDateTypeArray = enumToArray(BookingCriteriaDateType);
  bookings: any[];
  client: Client;
  loading: boolean;
  subscriptions$: Subscription[];
  errorSubscription: Subscription;
  warningSubscription: Subscription;
  errors: any[];
  warnings: any[];
  clientSP: number;
  supplierSP: number;

  constructor(
    private hubService: HubService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public calendar: NgbCalendar,
    private dateFormatter: NgbDateParserFormatter,
    private currencySelectorService: CurrencySelectorService,
    private languageSelectorService: LanguageSelectorService,
    private modalService: NgbModal,
    private requestStorageService: RequestStorageService,
    private alertService: AlertService,
    private clientSelectorService: ClientSelectorService,
    private supplierAccessesService: SupplierAccessesService,
    private spinnerService: SpinnerService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.spinnerService.start();
    this.boards = [];
    this.subscriptions$ = [];
    this.myBookingForm = this.fb.group({
      accessCode: ['', Validators.required],
      language: ['', Validators.required],
      typeSearch: BookingCriteriaType.DATES,
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
    this.errorSubscription = this.alertService.error$.subscribe(err => {
      this.errors = err.filter(e => e.name === 'MyBookings');
    });

    this.warningSubscription = this.alertService.warning$.subscribe(warning => {
      this.warnings = warning.filter(w => w.name === 'MyBookings');
    });
    this.myBookingForm.disable();

    this.subscriptions$[
      'currency'
    ] = this.currencySelectorService.currency$.subscribe(res => {
      if (res && res.iso_code) {
        this.myBookingForm.controls['references']['controls'][
          'currency'
        ].setValue(res.iso_code);
      } else {
        this.myBookingForm.controls['references']['controls'][
          'currency'
        ].setValue(null);
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

    this.subscriptions$[
      'client'
    ] = this.clientSelectorService.clientSelected$.subscribe(res => {
      this.client = res;
      this.enableForm();
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

  getMyBookings(criteriaBooking: CriteriaBooking) {
    this.requestStorageService.setCurrentType('myBookings');
    this.criteriaBooking = criteriaBooking;
    this.loading = true;
    this.bookings = null;
    this.hubService
      .getMyBookings(criteriaBooking, {
        context: this.webConfigService.getItemFromLocalStorage('context'),
        client: this.webConfigService.getItemFromLocalStorage('client')['name'],
        auditTransactions: true,
        testMode: this.webConfigService.getItemFromLocalStorage('access')['isTest']
      })
      .valueChanges.subscribe(
        res => {
          this.requestStorageService.storeRequestResponse(false, res);
          this.loading = false;
          this.bookings = [];
          if (res.data && res.data.hotelX && res.data.hotelX.booking) {
            const booking = res.data.hotelX.booking;

            this.alertService.setAlertMultiple(
              'MyBookings',
              'error',
              booking.errors
            );

            this.alertService.setAlertMultiple(
              'MyBookings',
              'warning',
              booking.warnings
            );

            if (res.data.hotelX.booking.bookings) {
              this.bookings = JSON.parse(
                JSON.stringify(res.data.hotelX.booking.bookings)
              );
            }
          }
        },
        err => {
          this.alertService.setAlert(
            'MyBookings',
            `Unhandled error`,
            'error',
            err
          );
          this.notificationService.error(err);
          this.loading = false;
        }
      );
  }

  searchByDate(value) {
    const criteriaBooking: CriteriaBooking = JSON.parse(JSON.stringify(value));
    delete criteriaBooking.references;
    criteriaBooking.dates.start = this.dateFormatter.format(<any>(
      criteriaBooking.dates.start
    ));
    criteriaBooking.dates.end = this.dateFormatter.format(<any>(
      criteriaBooking.dates.end
    ));
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
    this.enableForm();
  }

  enableForm() {
    this.accessesToSearch && this.accessesToSearch.length !== 0 && this.client
      ? this.myBookingForm.enable()
      : this.myBookingForm.disable();
  }

  /**
   * Unsubscribe from all events
   */
  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
    this.errorSubscription.unsubscribe();
    this.warningSubscription.unsubscribe();
  }

  /**
   * Opens modal to show last request made of myBookings type
   */
  showRequest(booking = false) {
    const modalRef = this.modalService.open(RqModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });

    modalRef.componentInstance.input = 'myBookings';
  }

  /**
   * Opens modal to show last response got form myBookings request
   */
  showResponse(booking = false) {
    const modalRef = this.modalService.open(RsModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });

    modalRef.componentInstance.book = 'myBookings';
  }

  decideIfClose(event, datepicker) {
    decideClosure(event, datepicker);
  }

  testHideSelectors = () => {
    return this.clientSelectorService;
  };
}
