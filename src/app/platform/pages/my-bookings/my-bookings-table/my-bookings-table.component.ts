import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import {
  CancelBooking,
  Board,
  HotelBookingDetail,
  Price,
  Client,
  CriteriaBooking
} from 'app/core/interfaces';
import { HubService } from '../../../../core/services/hub.service';
import { WebConfigService } from 'app/core/services/web-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RqModalComponent } from '../../../../shared/components/rq-modal/rq-modal.component';
import { RsModalComponent } from '../../../../shared/components/rs-modal/rs-modal.component';
import { CancelPolicyModalComponent } from 'app/platform/components/cancel-policy-modal/cancel-policy-modal.component';
import { environment } from 'environments/environment';
import { NgbDateMomentParserFormatter } from 'app/shared/utilities/ngbParserFormatter';
import { BindingModalComponent } from 'app/platform/components/binding-modal/binding-modal.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { RequestStorageService } from '../../../../shared/services/request-storage.service';
import { MyBookingsDetailModalComponent } from '../my-bookings-detail/my-bookings-detail-modal.component';
import { BookingCriteriaType } from '../../../../core/enumerates/booking-criteria-type';
import { SpinnerService } from '../../../../shared/services/spinner.service';

@Component({
  selector: 'b2b-my-bookings-table',
  templateUrl: './my-bookings-table.component.html',
  styleUrls: ['./my-bookings-table.component.css']
})
export class MyBookingsTableComponent implements OnChanges {
  @Input()
  bookings: HotelBookingDetail[];
  @Input()
  boards: Board[];
  @Input()
  client: Client;
  @Input()
  criteriaBooking: CriteriaBooking;
  @Output()
  spinnerStart: EventEmitter<boolean> = new EventEmitter();
  environment = environment;
  ngbDateMomentParserFormatter: NgbDateMomentParserFormatter;
  bookingCriteriaType = BookingCriteriaType;

  constructor(
    private hubService: HubService,
    private notificationService: NotificationService,
    private webConfigService: WebConfigService,
    private modalService: NgbModal,
    private requestStorageService: RequestStorageService,
    private spinnerService: SpinnerService
  ) {
    this.ngbDateMomentParserFormatter = new NgbDateMomentParserFormatter();
  }

  ngOnChanges(changes) {
    if (this.bookings) {
      this.getBoards();
    }
  }

  getBoards() {
    this.hubService
      .getBoards(
        [this.webConfigService.getAccess()],
        this.webConfigService.getLanguage()['iso_code']
      )
      .valueChanges.subscribe(res => {
        this.boards = [];
        res.data.hotelX.boards.edges.map(board => {
          if (board.node && board.node.boardData) {
            this.boards.push(board.node.boardData);
          }
        });
      });
  }

  /**
   * Method triggered when a cancel button has been press
   * @param booking
   */
  onCancel(booking) {
    const cancelBooking: CancelBooking = {
      accessCode: this.webConfigService.getAccess().code,
      hotelCode: booking.hotel.hotelCode,
      reference: {}
    };
    if (booking && booking.reference && booking.reference.supplier) {
      this.requestStorageService.setCurrentType(
        'cancelBooking_' + booking.reference.supplier
      );
      cancelBooking.reference.supplier = booking.reference.supplier;
    }
    if (booking && booking.reference && booking.reference.client) {
      cancelBooking.reference.client = booking.reference.client;
    }

    this.hubService.cancelBook(cancelBooking, this.client).subscribe(
      res => {
        this.requestStorageService.storeRequestResponse(false, res);
        const cancel = res.data.hotelX.cancel;
        booking.errors = cancel.errors || [];
        booking.warnings = cancel.warnings || [];

        booking.showMoreOptions = true;
        if (
          (((((res.data || {}).hotelX || {}).cancel || {}).cancellation || {})
            .status || '') === 'CANCELLED'
        ) {
          if (
            res.data.hotelX.cancel.cancellation.price &&
            res.data.hotelX.cancel.cancellation.price.net
          ) {
            booking.cancelImport =
              res.data.hotelX.cancel.cancellation.price.net;
          }
          if (
            res.data.hotelX.cancel.cancellation.price &&
            res.data.hotelX.cancel.cancellation.price.currency
          ) {
            booking.currencyImport =
              res.data.hotelX.cancel.cancellation.price.currency;
          }
          booking.status = 'CANCELLED';
          this.notificationService.success('Booking Cancelled');
        }
      },
      err => {
        booking.showMoreOptions = true;
        this.notificationService.error(err);
      }
    );
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

    if (booking) {
      modalRef.componentInstance.input =
        'cancelBooking_' + booking['reference'].supplier;
    } else {
      modalRef.componentInstance.input = 'cancelBooking_';
    }
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

    if (booking) {
      modalRef.componentInstance.book =
        'cancelBooking_' + booking['reference'].supplier;
    } else {
      modalRef.componentInstance.book = 'cancelBooking_';
    }
  }

  openCancelPolicyModal(cancelPenalties) {
    const modalRef = this.modalService.open(CancelPolicyModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.cancelPenalties = cancelPenalties;
  }

  openBindingModal(price: Price) {
    const modalRef = this.modalService.open(BindingModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.price = price;
  }

  openDetailModal(booking: HotelBookingDetail) {
    const criteriaBooking: CriteriaBooking = { ...this.criteriaBooking };
    delete criteriaBooking.dates;
    criteriaBooking.typeSearch = this.bookingCriteriaType.REFERENCES;
    criteriaBooking.references = {
      references: [
        {
          client: booking.reference.client,
          supplier: booking.reference.supplier
        }
      ],
      hotelCode: '',
      currency: this.webConfigService.getCurrency().iso_code
      // hotelCode: booking.hotel.hotelCode
    };

    this.spinnerStart.emit(true);
    const subscription = this.hubService
      .getMyBookings(criteriaBooking, {
        client: this.webConfigService.getClient().name,
        auditTransactions: true,
        testMode: this.webConfigService.getAccess().isTest
      })
      .valueChanges.subscribe(
        res => {
          this.spinnerService.stop();
          if (res.data.hotelX.booking.bookings) {
            const modalRef = this.modalService.open(
              MyBookingsDetailModalComponent,
              {
                size: 'lg',
                keyboard: false,
                backdrop: 'static'
              }
            );
            modalRef.componentInstance.booking =
              res.data.hotelX.booking.bookings[0];
            modalRef.componentInstance.boards = this.boards;
            modalRef.result.then(_ => {
              subscription.unsubscribe();
            });
          }
        },
        err => {
          this.spinnerService.stop();
          this.notificationService.error(err);
        }
      );
  }

  calcWidth() {
    return document.getElementsByTagName('th').length;
  }
}
