import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-google-maps-modal',
  templateUrl: './google-maps-modal.component.html',
  styleUrls: ['./google-maps-modal.component.css'],
})
export class GoogleMapsModalComponent {
  @Input() latitude: number;
  @Input() longitude: number;

  constructor(public activeModal: NgbActiveModal) {}
}
