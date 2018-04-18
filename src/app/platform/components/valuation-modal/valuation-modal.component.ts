import { HotelOptionQuote } from './../../../core/interfaces/hotel-option-quote';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Option } from 'app/core/interfaces/option';
import { SearchService } from 'app/core/services/search.service';
import { Criteria } from 'app/core/interfaces/criteria';
import { HubService } from 'app/core/services/hub.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { HotelBookInput } from 'app/core/interfaces/hotel-book-input';
import { BookingPaxes } from 'app/core/interfaces/booking-paxes';
import { BookingRoom } from 'app/core/interfaces/booking-room';
import { Router } from '@angular/router';
import { Search } from 'app/core/interfaces/search';
import { BookingService } from 'app/core/services/booking.service';
import { formatHoursToDaysHours } from 'app/shared/utilities/functions';
import { environment } from 'environments/environment';
import { HotelInfoDetail } from 'app/core/interfaces/hotel-info/hotel-info-detail';
import { RqModalComponent } from '../../../shared/components/rq-modal/rq-modal.component';
import { RsModalComponent } from '../../../shared/components/rs-modal/rs-modal.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'b2b-valuation-modal',
  templateUrl: './valuation-modal.component.html',
  styleUrls: ['./valuation-modal.component.css']
})
export class ValuationModalComponent implements OnInit, OnDestroy {
  @Input() hotelInfo: HotelInfoDetail;
  @Input() option: Option;
  @Input() quote: HotelOptionQuote;
  // Warning: it does not work when roomsSearch is search
  @Input() roomsSearch: Search;
  subscriptions$: Subscription[];
  criteria: Criteria;
  book: FormGroup;
  rooms: any[];
  adultCount: number;
  childrenCount: number;
  environment: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private hubService: HubService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.rooms = [];
    this.subscriptions$ = [];
    this.subscriptions$[0] = this.searchService.criteria$.subscribe(res => {
      this.criteria = JSON.parse(JSON.stringify(res));
      this.book = new FormGroup({
        clientReference: new FormControl('', Validators.required),
        remarks: new FormControl(''),
        holder: new FormGroup({
          name: new FormControl('', Validators.required),
          surname: new FormControl('', Validators.required)
        }),
        rooms: this.createRoom()
      });
    });
    this.environment = environment;
  }

  /**
   * Create each room for the form
   */
  createRoom(): FormArray {
    const roomArray = new FormArray([]);

    this.criteria.rooms.forEach(room => {
      room.paxes.sort(function(a, b) {
        if (a.age < b.age) {
          return 1;
        }
        if (a.age > b.age) {
          return -1;
        }
        return 0;
      });
      const paxes = new FormArray([]);
      if (room.paxes != null) {
        for (let i = 0; i < room.paxes.length; i++) {
          const children = this.createPax(+room.paxes[i].age);
          children['number'] = i + 1;
          paxes.push(children);
        }
      }
      roomArray.push(paxes);
    });

    return roomArray;
  }

  /**
   * Creates a pax object
   * @param age number
   */
  createPax(age: number = 30): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      age: new FormControl({ value: age, disabled: true })
    });
  }

  /**
   * Book the selected option reference
   */
  onBook() {
    const input: HotelBookInput = {
      optionRefId: this.quote.optionRefId,
      remarks: this.book.get('remarks').value,
      clientReference: this.book.get('clientReference').value,
      holder: {
        name: this.book.get('holder').get('name').value,
        surname: this.book.get('holder').get('surname').value
      },
      rooms: this.transformFormToRooms()
    };

    this.bookingService.setInput(input);
    this.activeModal.close();
    this.router.navigate(['/platform/close-bookings']);
  }

  /**
   * Transforms form paxes to booking room arrayf
   */
  transformFormToRooms(): BookingRoom[] {
    const rooms: BookingRoom[] = [];
    let counter = 1;

    this.book['controls'].rooms['controls'].forEach(room => {
      const bookingRoom = {
        occupancyRefId: counter,
        paxes: []
      };
      room.controls.forEach(person => {
        const pax: BookingPaxes = {
          name: person.controls.name.value,
          surname: person.controls.surname.value,
          age: person.controls.age.value
        };
        bookingRoom.paxes.push(pax);
      });
      rooms.push(bookingRoom);
      ++counter;
    });
    return rooms;
  }

  /**
   * Reset the CountPaxes for a new room (returns true cause it runs the function for every room created on the DOM)
   */
  resetCountPaxes() {
    this.adultCount = 0;
    this.childrenCount = 0;
    return true;
  }

  /**
   * Returns true if it's a child pax and increment the childrenCount by one
   * @param pax pax to test
   */
  isChild(pax) {
    if (pax.get('age').value < 18) {
      this.childrenCount++;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns true if it's an adult pax and increment the adultCount by one
   * @param pax pax to test
   */
  isAdult(pax) {
    if (pax.get('age').value >= 18) {
      this.adultCount++;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Opens modal to show last request made of hotel type
   */
  showRequest() {
    if (sessionStorage.getItem('interceptedRequest')) {
      const modalRef = this.modalService.open(RqModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.input = 'quoteRQ';
      modalRef.result
        .then(res => {
          // https://github.com/ng-bootstrap/ng-bootstrap/issues/643#issuecomment-306256651
          document.body.classList.add('modal-open');
        })
        .catch(err => {
          document.body.classList.add('modal-open');
        });
    }
  }

  /**
   * Opens modal to show last response got form hotel request
   */
  showResponse() {
    if (sessionStorage.getItem('storedResponses')) {
      const modalRef = this.modalService.open(RsModalComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static'
      });

      modalRef.componentInstance.book = 'quoteRS';
      modalRef.result
        .then(res => {
          // https://github.com/ng-bootstrap/ng-bootstrap/issues/643#issuecomment-306256651
          document.body.classList.add('modal-open');
        })
        .catch(err => {
          document.body.classList.add('modal-open');
        });
    }
  }

  /**
   * Unsubscribe from all observables
   */
  ngOnDestroy() {
    // this.subscriptions$.map(i => i.unsubscribe());
  }

  formatHoursToDaysHours(hoursBefore: number): string {
    return formatHoursToDaysHours(hoursBefore);
  }
}
