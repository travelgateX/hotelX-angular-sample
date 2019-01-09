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

  toggledType: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(e) {
    this.toggledType = undefined;
  }

  toggleItems(type) {
    if(this.toggledType !== type){
      this.toggledType = type;
    }else{
      this.toggledType = undefined;
    }
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

  getToggledItems(){
    if(this.toggledType){
      return this.toggledType === 'e' ? this.errors : this.warnings;
    }
    return [];
  }
}
