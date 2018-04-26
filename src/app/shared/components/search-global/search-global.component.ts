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
import { SearchGlobalData } from './interfaces/search-global-data';
import { SearchGlobalConfig } from './interfaces/search-global-config';

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
  @Input() itemData: SearchGlobalData;
  hotels: any[];
  destinations: any[];
  selectedItems = [];
  availableItems = [];
  collections = [];

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
  @Input() config: SearchGlobalConfig;

  private configurations = {
    closeOnAdd: true,
    clearOnAdd: true,
    clearOnBlur: true,
    searchOnFocus: true
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
    if (this.config.onadd) {
      this.configurations.closeOnAdd = !this.config.onadd.includes('open');
      this.configurations.clearOnAdd = !this.config.onadd.includes('keeptext');
    }

    if (this.config.onblur) {
      this.configurations.clearOnBlur = this.config.onblur === 'clear';
    }
    if (this.config.onfocus) {
      this.configurations.searchOnFocus = this.config.onfocus === 'search';
    }
  }

  decideClosure(event) {
    if (event.path) {
      const classes = event.path.map(p => p.className || '');
      if (!classes.includes('dropdown-root')) {
        this.closeDropdown();
        if (this.configurations.clearOnBlur) {
          this.searchValue = '';
        }
      } else if (
        event.target.id === 'inputSearch' &&
        this.configurations.searchOnFocus &&
        this.searchValue &&
        this.searchValue.length > 2
      ) {
        this.keyUpEvent.emit(this.searchValue);
      }
    }
  }

  ngOnChanges(changes) {
    if ('itemData' in changes) {
      this.displayItems();
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

  // /**
  //  * Filters
  //  */
  displayItems() {
    if (this.selectedItems.length) {
      if (
        this.selectedItems.find(si => si.destination) ||
        this.selectedItems.length >= 5
      ) {
        this.availableItems = [];
        this.closeDropdown();
        return;
      } else {
        const selectedValues = this.selectedItems.map(si => si.value);
        this.availableItems = [
          ...this.itemData.items.filter(
            item => !selectedValues.includes(item.value)
          )
        ];
      }
    } else {
      this.availableItems = [...this.itemData.items];
    }

    if (
      (!!this.searchValue && this.searchValue.length > 2) ||
      (!!this.searchValue && this.availableItems.length > 0)
    ) {
      if (this.itemData.grouping) {
        this.filterItems();
      } else {
        this.collections = [{ title: false, list: this.availableItems }];
      }
      this.openDropdown();
    } else if (!this.searchValue) {
      this.closeDropdown();
    }
  }

  /**
   * Filters items if grouping parameter is set to true
   */
  filterItems() {
    const collections = [];
    const setArray = Array.from(this.itemData.groupConfig.keys());
    if (setArray.length) {
      for (let i = 0; i < setArray.length; i++) {
        const groupConfig = this.itemData.groupConfig.get(setArray[i]);

        if (groupConfig) {
          const collection = {
            title: groupConfig.title || 'Not defined',
            list: this.availableItems.filter(ai => {
              if (ai[this.itemData.groupBy] === setArray[i]) {
                ai['disp'] = groupConfig.display(ai);
                return true;
              }
            })
          };
          collections.push(collection);
        }
      }

      this.collections = collections;
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
    this.displayItems();
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
    this.displayItems();
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
      };
      const focusedHeight = trueFocused.offsetTop - currentScrollHeight;
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
