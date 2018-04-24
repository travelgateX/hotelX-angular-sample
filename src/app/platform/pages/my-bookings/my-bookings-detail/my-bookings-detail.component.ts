import { Component, OnInit, Input } from '@angular/core';
import { HotelBookingDetail } from '../../../../core/interfaces/hotel-booking-detail';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HubService } from '../../../../core/services/hub.service';

@Component({
  selector: 'b2b-my-bookings-detail',
  templateUrl: './my-bookings-detail.component.html',
  styleUrls: ['./my-bookings-detail.component.css']
})
export class MyBookingsDetailComponent implements OnInit {
  @Input() booking: HotelBookingDetail;

  constructor(
    public activeModal: NgbActiveModal,
    private hubService: HubService
  ) {}

  ngOnInit() {

    // this.hubService.getMyBookings()
  }
}
