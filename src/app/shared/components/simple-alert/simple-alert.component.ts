import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'b2b-simple-alert',
  templateUrl: './simple-alert.component.html'
})
export class SimpleAlertComponent implements OnChanges {
  @Input('title') title: string;
  @Input('message') message: string;
  @Input('type') type: string;
  typeString: string;
  @Output() indexRemoved: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  removeItem() {
    this.indexRemoved.emit(true);
  }

  ngOnChanges(event) {
    switch (this.type) {
      case 'success':
        this.typeString = 'success'; // Green
        break;
      case 'info':
        this.typeString = 'info'; // Dark blue
        break;
      case 'warning':
        this.typeString = 'warning'; // Orange
        break;
      case 'danger':
      case 'error':
        this.typeString = 'danger'; // Red
        break;
      default:
        this.typeString = 'default'; // Grey
        break;
    }
  }
}
