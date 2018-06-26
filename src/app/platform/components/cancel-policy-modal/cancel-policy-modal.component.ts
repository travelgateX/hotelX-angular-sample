import { CancelPenalty } from './../../../core/interfaces/cancel-penalty';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'b2b-cancel-policy-modal',
  templateUrl: './cancel-policy-modal.component.html',
  styleUrls: ['./cancel-policy-modal.component.css'],
})
export class CancelPolicyModalComponent{
  @Input() cancelPenalties: CancelPenalty[];
  constructor(public activeModal: NgbActiveModal) {}


}
