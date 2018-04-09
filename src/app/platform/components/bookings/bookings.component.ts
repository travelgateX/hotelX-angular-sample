import { Component, Input } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { decideClosure } from 'app/shared/utilities/functions';

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

  decideIfClose(event, datepicker) {
    decideClosure(event, datepicker);
  }
}
