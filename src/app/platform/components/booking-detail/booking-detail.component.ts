import { HotelBookPayload, BookingDetail, Criteria } from 'app/core/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from 'app/core/services/search.service';
import { environment } from 'environments/environment';
import { NotificationService } from '../../../shared/services/notification.service';
import { RqModalComponent } from '../../../shared/components/rq-modal/rq-modal.component';
import { RsModalComponent } from '../../../shared/components/rs-modal/rs-modal.component';

@Component({
  selector: 'b2b-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  @Input() bookingDetail: BookingDetail;
  @Input() book: HotelBookPayload;
  criteria: Criteria;
  environment: any;

  constructor(
    private modalService: NgbModal,
    private searchService: SearchService,
    private notificationService: NotificationService,
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
   * Opens modal to show last request made of booking type
   */
  showRequest() {
    const modalRef = this.modalService.open(RqModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });

    modalRef.componentInstance.input = 'book';
    modalRef.result
      .then(res => {
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/643#issuecomment-306256651
        document.body.classList.add('modal-open');
      })
      .catch(err => {
        document.body.classList.add('modal-open');
      });
  }

  /**
   * Opens modal to show last response got form booking request
   */
  showResponse() {
    const modalRef = this.modalService.open(RsModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });

    modalRef.componentInstance.book = 'book';
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
