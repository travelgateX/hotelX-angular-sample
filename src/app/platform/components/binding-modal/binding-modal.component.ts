import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { Price } from 'app/core/interfaces/price';

@Component({
  selector: 'b2b-binding-modal',
  templateUrl: './binding-modal.component.html',
  styleUrls: ['./binding-modal.component.css']
})
export class BindingModalComponent {
  @Input() price: Price;

  constructor(public activeModal: NgbActiveModal) {}
}
