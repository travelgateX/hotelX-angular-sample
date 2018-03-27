import { Component, Input } from '@angular/core';
import { HotelBookPayload } from 'app/core/interfaces/hotel-book-payload';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-rs-modal',
  templateUrl: './rs-modal.component.html',
  styleUrls: ['./rs-modal.component.css'],
})
export class RsModalComponent {
  @Input() book: HotelBookPayload;

  constructor(public activeModal: NgbActiveModal) {}
}
