import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-rq-modal',
  templateUrl: './rq-modal.component.html',
  styleUrls: ['./rq-modal.component.css'],
})
export class RqModalComponent {
  @Input() input: any;

  constructor(public activeModal: NgbActiveModal) {}
}
