import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'b2b-alert-dropdown',
  templateUrl: './alert-dropdown.component.html',
  styleUrls: ['./alert-dropdown.component.css'],
  animations: [
    trigger('seeItems', [
      state(
        'no',
        style({
          display: 'none',
          opacity: 0
        })
      ),
      transition('no => yes', [
        animate(
          300,
          keyframes([
            style({
              display: 'block',
              opacity: 0,
              offset: 0
            }),
            style({
              opacity: 0.5,
              offset: 0.3
            }),
            style({
              opacity: 1,
              offset: 0.8
            }),
            style({
              opacity: 1,
              offset: 1
            })
          ])
        )
      ]),
      transition('yes => no', [
        animate(
          300,
          style({
            display: 'none',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class AlertDropdownComponent implements OnInit {
  @Input() errors: any[];
  @Input() warnings: any[];

  shownItems: string;
  items: any[];

  seeItems = 'no';

  constructor() {}

  ngOnInit() {}

  toggleItems(type) {
    if (this.shownItems === type || this.shownItems === undefined) {
      this.seeItems = this.seeItems === 'no' ? 'yes' : 'no';
    } else if (this.shownItems !== type && this.seeItems === 'no') {
      this.seeItems = 'yes';
    }

    this.items = type === 'e' ? this.errors : this.warnings;
    this.shownItems = type;
  }
}
