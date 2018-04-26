import { Component, OnInit, Input } from '@angular/core';
import { CancelPenalty } from '../../../core/interfaces/cancel-penalty';
import { formatHoursToDaysHours } from 'app/shared/utilities/functions';

@Component({
  selector: 'b2b-cancel-policies-table',
  templateUrl: './cancel-policies-table.component.html',
  styleUrls: ['./cancel-policies-table.component.css']
})
export class CancelPoliciesTableComponent implements OnInit {
  @Input() cancelPenalties: CancelPenalty[];
  constructor() { }

  ngOnInit() {
    console.log("eu");
    this.cancelPenalties.sort(function(a, b) {
      return b.hoursBefore - a.hoursBefore || a.value - b.value
    })
  }

  formatHoursToDaysHours(hoursBefore: number): string {
    return formatHoursToDaysHours(hoursBefore);
  }

}
