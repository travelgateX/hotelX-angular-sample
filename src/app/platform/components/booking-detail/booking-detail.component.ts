import { HotelBookPayload } from 'app/core/interfaces/hotel-book-payload';
import { HotelBookingDetail } from './../../../core/interfaces/hotel-booking-detail';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RsModalComponent } from 'app/platform/components/rs-modal/rs-modal.component';
import { RqModalComponent } from 'app/platform/components/rq-modal/rq-modal.component';
import { BookingDetail } from 'app/core/interfaces/booking-detail';
import { SearchService } from 'app/core/services/search.service';
import { NotificationService } from 'app/core/services/notification.service';
import { Criteria } from 'app/core/interfaces/criteria';
import { SpinnerService } from 'app/core/services/spinner.service';
import { environment } from 'environments/environment';
import {  } from 'app/shared/utilities/functions';

@Component({
  selector: 'b2b-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
})
export class BookingDetailComponent implements OnInit {
  @Input() bookingDetail: BookingDetail;
  @Input() book: HotelBookPayload;
  criteria: Criteria;
  environment: any

  constructor(
    private modalService: NgbModal,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.searchService.criteria$.subscribe(
      res => (this.criteria = JSON.parse(JSON.stringify(res))),
      err => this.notificationService.error(err)
    );
    this.environment = environment;
    // TODO check if somebody has done a refresh of the page
  }

  /**
   * Open response modal
   */
  // onOpenRS() {
  //   const modalRef = this.modalService.open(RsModalComponent);
  //   modalRef.componentInstance.book = this.book;
  // }

  // TODO show request
  // onOpenRQ() {
  //   const modalRef = this.modalService.open(RqModalComponent);
  //   // modalRef.componentInstance.input = this.input;
  // }

  /**
   * Opens modal to show last request made of booking type
   */
  showRequest() {
    if (sessionStorage.getItem('interceptedRequest')) {
      const modalRef = this.modalService.open(RqModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.input = 'bookRQ';
      modalRef.result
      .then(res => {
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/643#issuecomment-306256651
        document.body.classList.add('modal-open');
      })
      .catch(err => {
        document.body.classList.add('modal-open');
      });
    }
  }

  /**
   * Opens modal to show last response got form booking request
   */
  showResponse() {
    if (sessionStorage.getItem('storedResponses')) {
      const modalRef = this.modalService.open(RsModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.book = 'bookRS';
      modalRef.result
      .then(res => {
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/643#issuecomment-306256651
        document.body.classList.add('modal-open');
      })
      .catch(err => {
        document.body.classList.add('modal-open');
      });
    }
  }
}
