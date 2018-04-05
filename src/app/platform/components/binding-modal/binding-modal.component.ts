import { Option } from '../../../core/interfaces/option';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'b2b-binding-modal',
  templateUrl: './binding-modal.component.html',
  styleUrls: ['./binding-modal.component.css']
})
export class BindingModalComponent implements OnInit {
  @Input() option: Option;
  gross: number;
  net: number;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.gross = Math.round(this.option.price.gross * 100) / 100;
    this.net = Math.round(this.option.price.net * 100) / 100;
  }
}
