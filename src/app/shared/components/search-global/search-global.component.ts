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
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'b2b-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.css'],
  animations: [
    trigger('dropdown', [
      state(
        'yes',
        style({
          transform: 'translateY(-50px)',
          opacity: 0,
          display: 'none',
          pointerEvents: 'none'
        })
      ),
      state(
        'no',
        style({
          transform: 'translateY(0)',
          opacity: 1,
          display: 'block',
          pointerEvents: 'all'
        })
      ),
      transition(
        'no => yes',
        animate(
          150,
          keyframes([
            style({
              transform: 'translateY(0px)',
              opacity: 1,
              offset: 0,
              pointerEvents: 'none'
            }),
            style({
              transform: 'translateY(-10px)',
              opacity: 0.75,
              offset: 0.3
            }),
            style({
              transform: 'translateY(-30px)',
              opacity: 0.1,
              offset: 0.8
            }),
            style({
              transform: 'translateY(-50px)',
              opacity: 0,
              offset: 1
            })
          ])
        )
      ),
      transition(
        'yes => no',
        animate(
          150,
          keyframes([
            style({
              transform: 'translateY(-50px)',
              opacity: 0,
              offset: 0
            }),
            style({
              transform: 'translateY(-30px)',
              opacity: 0.5,
              offset: 0.3
            }),
            style({
              transform: 'translateY(-10px)',
              opacity: 1,
              offset: 0.8
            }),
            style({
              transform: 'translateY(0px)',
              opacity: 1,
              offset: 1,
              pointerEvents: 'all'
            })
          ])
        )
      )
    ])
  ]
})
export class SearchGlobalComponent implements OnChanges, OnInit {
  // Data variables
  searchValue: string;
  @Input() items: any[];
  hotels: any[];
  destinations: any[];
  selectedItems = [];
  availableItems = [];

  // Animation switches
  hiddenDropdown = 'yes';

  // Event triggers
  @Output() keyUpEvent: EventEmitter<string> = new EventEmitter();

  // Data binders
  @Output() criteriaItems: EventEmitter<any[]> = new EventEmitter();

  // DOM elements
  @ViewChild('inputSearch') inputSearch: ElementRef;
  @ViewChild('dropdownElem') dropdownElem: ElementRef;

  // Component configurations
  @Input() config: { add: any };

  private configurations = {
    closeOnAdd: true,
    clearOnAdd: true
  };

  backspace = false;

  constructor() {}

  ngOnInit() {
    this.configureComponent();
  }

  configureComponent() {
    if (!this.config) {
      return;
    }
    if (this.config.add) {
      this.configurations.closeOnAdd = !this.config.add.includes('open');
      this.configurations.clearOnAdd = !this.config.add.includes('keeptext');
    }
  }

  decideClosure(event) {
    if (event.path) {
      const classes = event.path.map(p => p.className || '');
      if (!classes.includes('dropdown-root')) {
        this.closeDropdown();
      }
    }
  }

  ngOnChanges(changes) {
    if ('items' in changes) {
      this.filterItems();
    }
  }

  onKeyupFilter(searchValue, event) {
    if (
      searchValue &&
      searchValue.length > 2 &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Enter'
    ) {
      this.keyUpEvent.emit(searchValue);
    } else if (
      !searchValue ||
      (searchValue &&
        searchValue.length < 3 &&
        event.key === 'Backspace' &&
        event.key !== 'Enter')
    ) {
      this.closeDropdown();
    }
  }

  filterItems() {
    if (this.selectedItems.length) {
      if (
        this.selectedItems.find(si => si.destination) ||
        this.selectedItems.length >= 5
      ) {
        this.availableItems = [];
        this.closeDropdown();
        return;
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
      (!!this.searchValue && this.searchValue.length > 2) ||
      (!!this.searchValue && this.availableItems.length > 0)
    ) {
      this.hotels = this.availableItems.filter(item => !item.destination);
      this.destinations = this.availableItems.filter(item => item.destination);
      this.openDropdown();
    } else if (!this.searchValue) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    if (this.hiddenDropdown !== 'no') {
      this.hiddenDropdown = 'no';
    }
  }

  closeDropdown() {
    if (this.hiddenDropdown !== 'yes') {
      this.hiddenDropdown = 'yes';
    }
  }

  addItem(item) {
    item.focused = false;
    const clone = JSON.parse(JSON.stringify(item));
    this.selectedItems.push(clone);
    this.filterItems();
    if (this.configurations.closeOnAdd) {
      this.closeDropdown();
      this.dropdownElem.nativeElement.scrollTop = 0;
    }
    if (this.configurations.clearOnAdd) {
      this.searchValue = '';
    }

    this.inputSearch.nativeElement.focus();
    this.criteriaItems.emit(this.selectedItems);
  }

  addItemWithEnter() {
    const auxArray = [].concat(this.hotels, this.destinations);
    const item = auxArray.find(a => a.focused);
    if (item) {
      this.addItem(item);
    }
  }

  removeItem(index) {
    this.selectedItems.splice(index, 1);
    this.filterItems();
  }

  /**
   * Catches event key. Triggers certain functions based on the key pressed
   * @param event
   */
  selectActionByKey(event) {
    switch (event.key) {
      case 'Backspace':
        this.startRemoving(event.target);
        break;
      case 'ArrowDown':
        this.focusItemFromList('next');
        break;
      case 'ArrowUp':
        this.focusItemFromList('prev');
        break;
      case 'Enter':
        this.addItemWithEnter();
        break;
    }
  }

  /**
   * Starts the removal process. If backspace key is pressed, las item from list is marked for deletion.
   * If backspace key is pressed again, that item is removed from the list.
   * @param target
   */
  startRemoving(target) {
    if (this.selectedItems.length) {
      if (!target.value && !this.selectedItems.find(si => si.toBeRemoved)) {
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

  /**
   * Focuses items from the dropdown using the arrow keys
   * @param param
   */
  focusItemFromList(param) {
    const auxArray = [].concat(this.hotels, this.destinations);
    if (this.hiddenDropdown === 'no') {
      const focusedIndex = auxArray.findIndex(aux => aux.focused);
      // If a node is already focused, it selects the apropiate one depending on key pressed.
      // Otherwise it starts focusing items from the start or the end of the list
      if (focusedIndex !== -1) {
        if (param === 'next') {
          auxArray[focusedIndex].focused = false;
          if (focusedIndex < auxArray.length - 1) {
            auxArray[focusedIndex + 1].focused = true;
          } else {
            auxArray[0].focused = true;
            this.dropdownElem.nativeElement.scrollTop = 0;
          }
        } else if (param === 'prev') {
          auxArray[focusedIndex].focused = false;
          if (focusedIndex > 0) {
            auxArray[focusedIndex - 1].focused = true;
          } else {
            auxArray[auxArray.length - 1].focused = true;
            this.dropdownElem.nativeElement.scrollTop = auxArray.length * 100;
          }
        }
      } else if (param === 'next') {
        auxArray[0].focused = true;
      } else if (param === 'prev') {
        auxArray[auxArray.length - 1].focused = true;
      }
      this.checkSelectedItemPosition(param);
    }
  }

  checkSelectedItemPosition(param) {
    const currentScrollHeight = this.dropdownElem.nativeElement.scrollTop;
    const dropdownHeight = this.dropdownElem.nativeElement.offsetHeight;
    const children = this.dropdownElem.nativeElement.querySelectorAll(
      'span.custom-dropdown-item'
    );
    // console.log('currentScrollHeight');
    // console.log(currentScrollHeight);
    // console.log('dropdownHeight');
    // console.log(dropdownHeight);

    let itemIndex;
    let focused;
    for (let i = 0; i < children.length; i++) {
      if (children[i].className.includes('focused')) {
        focused = children[i];
        itemIndex = i;
      }
    }

    if (focused) {
      let trueFocused;
      if (param === 'next') {
        if (itemIndex === children.length - 1) {
          trueFocused = children[0];
        } else {
          trueFocused = focused.nextElementSibling;
        }
      } else {
        if (itemIndex === 0) {
          trueFocused = children[children.length - 1];
          // trueFocused.classList.add('focused');
        } else {
          trueFocused = focused.previousElementSibling;
        }
      }
      // console.log(trueFocused);
      const focusedHeight = trueFocused.offsetTop - currentScrollHeight;
      // console.log(focusedHeight);
      if (focusedHeight > dropdownHeight - Math.floor(dropdownHeight * 0.2)) {
        this.dropdownElem.nativeElement.scrollTop =
          currentScrollHeight + Math.floor(dropdownHeight * 0.8);
      } else if (focusedHeight < 0) {
        this.dropdownElem.nativeElement.scrollTop =
          currentScrollHeight - Math.floor(dropdownHeight * 0.8);
      }
    }
  }
}
