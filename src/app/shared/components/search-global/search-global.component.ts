import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Component({
  selector: 'b2b-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.css']
})
export class SearchGlobalComponent implements OnChanges, OnInit {
  searchValue: string;
  @Input() items: any[];
  hotels: any[];
  destinations: any[];
  selectedItems = [];
  availableItems = [];
  hiddenDropdown = false;
  @Output() keyUpEvent: EventEmitter<string> = new EventEmitter();
  @ViewChild('inputSearch') inputSearch: ElementRef;

  backspace = false;

  constructor() {}

  ngOnInit() {
    this.keyUpEvent.emit(this.searchValue);
    console.log(this.inputSearch);
    console.log(this.inputSearch.nativeElement.getBoundingClientRect());
  }

  ngOnChanges(changes) {
    if ('items' in changes) {
      this.filterItems();
    }
  }

  onKeyupFilter(searchValue) {
    if (searchValue && searchValue.length > 2) {
      this.keyUpEvent.emit(searchValue);
    }
  }

  filterItems() {
    this.hiddenDropdown = false;
    if (this.selectedItems.length) {
      if (
        this.selectedItems.find(si => si.destination) ||
        this.selectedItems.length >= 5
      ) {
        this.availableItems = [];
        this.hiddenDropdown = true;
        this.closeDropdown();
      } else {
        const selectedKeys = this.selectedItems.map(si => si.key);
        this.availableItems = [
          ...this.items.filter(item => !selectedKeys.includes(item.key))
        ];
      }
    } else {
      this.availableItems = [...this.items];
    }

    if (
      !!this.searchValue &&
      this.searchValue.length > 2 &&
      this.availableItems.length > 0
    ) {
      this.hotels = this.availableItems.filter(item => !item.destination);
      this.destinations = this.availableItems.filter(item => item.destination);
      this.openDropdown();
    }
  }

  openDropdown() {
    // if ((<any>$)('#inputSearch').attr('aria-expanded') === 'false') {
    //   console.log(this.inputSearch)
    //   this.inputSearch.nativeElement.dropdown('toggle');
    // }
  }
  closeDropdown() {
    // if ((<any>$)('#inputSearch').attr('aria-expanded') === 'true') {
    //   (<any>$)('#inputSearch').dropdown('toggle');
    // }
  }

  addItem(item) {
    this.selectedItems.push(item);
    this.filterItems();
    this.searchValue = '';
  }

  removeItem(index) {
    this.selectedItems.splice(index, 1);
    this.filterItems();
  }

  startRemoving(event) {
    if (event.key === 'Backspace' && this.selectedItems.length) {
      if (
        !event.target.value &&
        !this.selectedItems.find(si => si.toBeRemoved)
      ) {
        this.selectedItems[this.selectedItems.length - 1].toBeRemoved = true;
      } else if (this.selectedItems.find(si => si.toBeRemoved)) {
        this.removeItem(this.selectedItems.length - 1);
        if (this.selectedItems.length) {
          this.selectedItems[this.selectedItems.length - 1].toBeRemoved = true;
        }
      }
    } else {
      this.backspace = false;
      if (this.selectedItems.length) {
        this.selectedItems[this.selectedItems.length - 1].toBeRemoved = false;
      }
    }
  }
}
