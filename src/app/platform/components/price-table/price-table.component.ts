import { Component, OnInit, Input } from '@angular/core';
import { Price } from '../../../core/interfaces/price';

@Component({
  selector: 'b2b-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.css']
})
export class PriceTableComponent implements OnInit {
  @Input() price: Price;
  gross: number;
  net: number;

  constructor() {}

  ngOnInit() {
    this.gross = Math.round(this.price.gross * 100) / 100;
    this.net = Math.round(this.price.net * 100) / 100;
  }

  calcWidth() {
    return document.getElementsByTagName('th').length;
  }
}
