import { Component, Input } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent {
  @Input() bordered: boolean;
  public startDate: NgbDateStruct;
  public endDate: NgbDateStruct;

  constructor() {}
}
