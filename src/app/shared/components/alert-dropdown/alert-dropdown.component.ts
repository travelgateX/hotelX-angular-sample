import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
export class AlertDropdownComponent implements OnInit, OnChanges {
  @Input()
  errors: any[];
  @Input()
  warnings: any[];

  shownItems: string;
  items: any[];

  seeItems = 'no';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(e) {
    if (e) {
      if (!(this.warnings || []).length && (this.items || []).length) {
        this.items = this.items.filter(i => i.type !== 'warning');
      }

      if (!(this.errors || []).length && (this.items || []).length) {
        this.items = this.items.filter(i => i.type !== 'error');
      }
    }
  }

  toggleItems(type) {
    if (this.shownItems === type || this.shownItems === undefined) {
      this.seeItems = this.seeItems === 'no' ? 'yes' : 'no';
    } else if (this.shownItems !== type && this.seeItems === 'no') {
      this.seeItems = 'yes';
    }

    this.items = type === 'e' ? this.errors : this.warnings;
    this.shownItems = type;
  }

  removeItems(item) {
    if (item.type === 'warning') {
      const index = this.warnings.findIndex(i => i.message === item.message);
      this.warnings.splice(index, 1);
    } else {
      const index = this.errors.findIndex(i => i.message === item.message);
      this.errors.splice(index, 1);
    }
  }
}
