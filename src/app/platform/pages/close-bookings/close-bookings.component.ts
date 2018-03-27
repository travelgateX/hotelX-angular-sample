import { LangService } from "./../../../core/services/lang.service";
import { HotelBookPayload } from "app/core/interfaces/hotel-book-payload";
import { Component, OnInit } from "@angular/core";
import { SpinnerService } from "app/core/services/spinner.service";
import { HubService } from "app/core/services/hub.service";
import { NotificationService } from "app/core/services/notification.service";
import { BookingService } from "app/core/services/booking.service";
import { BookingDetail } from "app/core/interfaces/booking-detail";
import { Router } from "@angular/router";
import { SearchService } from "app/core/services/search.service";
import { WebConfigService } from "../../../core/services/web-config.service";

@Component({
  selector: "b2b-close-bookings",
  templateUrl: "./close-bookings.component.html",
  styleUrls: ["./close-bookings.component.css"]
})
export class CloseBookingsComponent implements OnInit {
  book: HotelBookPayload;
  bookingDetail: BookingDetail;
  loading$;

  constructor(
    private spinnerService: SpinnerService,
    private hubService: HubService,
    private notificationService: NotificationService,
    private bookingService: BookingService,
    private router: Router,
    private searchService: SearchService,
    private langService: LangService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.spinnerService.start();
    this.loading$ = this.spinnerService.loading$;
    this.bookingService.booking$.subscribe(
      res => {
        this.bookingDetail = res;
        this.getBook();
      },
      err => {
        this.notificationService.error(err);
        this.spinnerService.stop();
      }
    );
  }

  /**
   * Gets an hotel book
   */
  getBook() {
    if (this.bookingDetail && this.bookingDetail.input) {
      const lang = this.langService.getLang();
      this.bookingDetail.input.language = lang;

      this.hubService.getBook(this.bookingDetail.input, this.webConfigService.getContext()).subscribe(
        res => {
          if (res.errors) {
            this.notificationService.handleIError(res.errors);
          }

          if (res.warnings) {
            this.notificationService.handlIWarning(res.warnings);
          }
          this.book = res.data.hotelX.book;
          this.spinnerService.stop();
        },
        err => {
          this.spinnerService.stop();
          this.notificationService.error(err);
        }
      );
    } else {
      this.spinnerService.stop();
    }
  }

  /**
   * Executes a new search availability
   * @param criteria
   */
  onSearch(event) {
    if (event.criteria) {
      this.searchService.setCriteria(event.criteria);
    }
    this.router.navigate(["/platform/results-bookings"]);
  }
}
