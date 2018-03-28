import { Component, OnInit } from "@angular/core";
import { HubService } from "app/core/services/hub.service";
import { CriteriaBooking } from "app/core/interfaces/criteria-booking";
import { LangService } from "../../../core/services/lang.service";
import { BookingCriteriaType } from "../../../core/enumerates/booking-criteria-type";
import { CriteriaBookingReference } from "app/core/interfaces/criteria-booking-reference";
import { CriteriaBookingDates } from "app/core/interfaces/criteria-booking-dates";
import { Access } from "app/core/interfaces/access";
import { getDisabled, enumToArray } from "../../../shared/utilities/functions";
import { CancelBooking } from "../../../core/interfaces/cancel-booking";
import { NotificationService } from "app/core/services/notification.service";
import { BookingCriteriaDateType } from "app/core/enumerates/booking-criteria-date-type";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbInputDatepicker, NgbCalendar, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "b2b-my-bookings",
  templateUrl: "./my-bookings.component.html",
  styleUrls: ["./my-bookings.component.css"]
})
export class MyBookingsComponent implements OnInit {
  accessesToSearch: Access[];
  myBookingForm: FormGroup;
  getDisabled = getDisabled;
  bookingCriteriaType = BookingCriteriaType;
  bookingCriteriaTypeArray = enumToArray(BookingCriteriaType);
  bookingCriteriaDateType = BookingCriteriaDateType;
  bookingCriteriaDateTypeArray = enumToArray(BookingCriteriaDateType);
  bookings: any[];

  constructor(
    private hubService: HubService,
    private langService: LangService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public calendar: NgbCalendar,
    private dateFormatter: NgbDateParserFormatter
  ) {}

  ngOnInit() {
    this.myBookingForm = this.fb.group({
      accessCode: "",
      language: this.langService.getLang(),
      typeSearch: {
        value: BookingCriteriaType.REFERENCES,
        disabled: !this.accessesToSearch || this.accessesToSearch.length === 0
      },
      dates: this.fb.group({
        dateType: BookingCriteriaDateType.ARRIVAL,
        start: this.calendar.getToday(),
        end: this.calendar.getNext(this.calendar.getToday(), "d", 1)
      }),
      references: this.fb.group({
        hotelCode: "",
        currency: "",
        references: this.fb.group({ client: "", supplier: "" })
      })
    });
  }

  getMyBookings(criteriaBooking) {
    this.bookings = [];
    this.hubService.getMyBookings(criteriaBooking).valueChanges.subscribe(res => {
      if (
        res.data &&
        res.data.hotelX &&
        res.data.hotelX.booking &&
        res.data.hotelX.booking.bookings
      ) {
        this.bookings = JSON.parse(
          JSON.stringify(res.data.hotelX.booking.bookings)
        );
      }
    });
  }

  onCancel(booking) {
    let cancelBooking: CancelBooking = {
      accessCode: this.accessesToSearch[0].code,
      hotelCode: booking.hotel.hotelCode,
      reference: {}
    };
    if (booking && booking.reference && booking.reference.supplier) {
      cancelBooking.reference.supplier = booking.reference.supplier;
    }
    if (booking && booking.reference && booking.reference.client) {
      cancelBooking.reference.client = booking.reference.client;
    }

    this.hubService.cancelBook(cancelBooking).subscribe(
      res => {
        if (
          res.data &&
          res.data.hotelX &&
          res.data.hotelX.cancel &&
          res.data.hotelX.cancel.cancellation &&
          res.data.hotelX.cancel.cancellation.status &&
          res.data.hotelX.cancel.cancellation.status === "CANCELLED"
        ) {
          booking.status = "CANCELLED";
          this.notificationService.success("Booking Cancelled");
        }
      },
      err => this.notificationService.error(err)
    );
  }

  searchByDate(value) {
    let criteriaBooking: CriteriaBooking = {...value}
    criteriaBooking.dates.start = this.dateFormatter.format(value.dates.start);
    criteriaBooking.dates.end = this.dateFormatter.format(value.dates.end);
    this.getMyBookings(criteriaBooking);
  }

  searchByReference() {
    // this.criteriaBooking.typeSearch = BookingCriteriaType.REFERENCES;
    // this.getMyBookings();
  }

  saveAccessesToSearch(accessesToSearch) {
    this.accessesToSearch = [...accessesToSearch];
    this.myBookingForm.patchValue({
      accessCode:
        this.accessesToSearch.length !== 0 ? this.accessesToSearch[0].code : ""
    });
    this.accessesToSearch.length !== 0
      ? this.myBookingForm.controls["typeSearch"].enable()
      : this.myBookingForm.controls["typeSearch"].disable();
  }

  /**
   * Toggle dates to make a range input
   * Cannot do it in the view because it seems that min date does not update
   * @param eToggle ngbDatepicker
   * @param sToggle ngbDatepicker
   */
  onChange(eToggle: NgbInputDatepicker, sToggle: NgbInputDatepicker) {
    // eToggle.close();
    // const date = new Date(`25/03/2018`);
    // date.setDate(date.getDate() + 1);
    // this.minDateTo.year = date.getFullYear();
    // this.minDateTo.month = date.getMonth() + 1;
    // this.minDateTo.day = date.getDate();
    // sToggle.open();
  }
}
