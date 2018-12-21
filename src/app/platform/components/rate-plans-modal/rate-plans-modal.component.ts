import { Component, OnInit, Input } from '@angular/core';
import { RatePlan } from '../../../core/interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-rate-plans-modal',
  templateUrl: './rate-plans-modal.component.html',
  styleUrls: ['./rate-plans-modal.component.css']
})
export class RatePlansModalComponent {

  @Input() ratePlans: RatePlan[];
  constructor(public activeModal: NgbActiveModal) {}

}
