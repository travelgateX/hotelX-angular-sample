import { Component, Input, OnChanges } from "@angular/core";
import { BookingHotel } from "../../../../core/interfaces/booking-hotel";
import { HotelBookingDetail } from "../../../../core/interfaces/hotel-booking-detail";
import { Board } from "../../../../core/interfaces/board";
import { CancelBooking } from "app/core/interfaces/cancel-booking";
import { HubService } from "../../../../core/services/hub.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { WebConfigService } from "app/core/services/web-config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RqModalComponent } from "app/platform/components/rq-modal/rq-modal.component";
import { RsModalComponent } from "app/platform/components/rs-modal/rs-modal.component";
import {
  loadRequest,
  loadResponse,
  storeResponse
} from "app/shared/utilities/functions";
import { Room } from "../../../../core/interfaces/room";
import { CancelPolicyModalComponent } from "app/platform/components/cancel-policy-modal/cancel-policy-modal.component";
import { environment } from "environments/environment";
import { NgbDateMomentParserFormatter } from "app/shared/utilities/ngbParserFormatter";

@Component({
  selector: "b2b-my-bookings-table",
  templateUrl: "./my-bookings-table.component.html",
  styleUrls: ["./my-bookings-table.component.css"]
})
export class MyBookingsTableComponent implements OnChanges {
  @Input() bookings: HotelBookingDetail[];
  @Input() boards: Board[];
  environment = environment;
  ngbDateMomentParserFormatter: NgbDateMomentParserFormatter;

  constructor(
    private hubService: HubService,
    private notificationService: NotificationService,
    private webConfigService: WebConfigService,
    private modalService: NgbModal
  ) {
    this.ngbDateMomentParserFormatter = new NgbDateMomentParserFormatter();
  }

  ngOnChanges(changes) {
    if (this.bookings) {
      this.getBoards();
    }
    // storeResponse('myBookingsRS', res);
  }

  getBoards() {
    this.hubService
      .getBoards(
        [this.webConfigService.getAccess()],
        this.webConfigService.getLanguage()["iso_code"]
      )
      .valueChanges.subscribe(res => {
        this.boards = [];
        res.data.hotelX.boards.edges.map(board => {
          if (board.node && board.node.boardData) {
            this.boards.push(board.node.boardData);
          }
        });
      });
  }

  /**
   * Method triggered when a cancel button has been press
   * @param booking
   */
  onCancel(booking) {
    const cancelBooking: CancelBooking = {
      accessCode: this.webConfigService.getAccess().code,
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
        const bk = res.data.hotelX.cancel.cancellation.booking;
        storeResponse("cancelBookingRS_" + bk.reference.supplier, res);
        booking.showMoreOptions = true;
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

  /**
   * Opens modal to show last request made of myBookings type
   */
  showRequest(booking = false) {
    if (sessionStorage.getItem("interceptedRequest")) {
      const modalRef = this.modalService.open(RqModalComponent, {
        size: "lg",
        keyboard: false,
        backdrop: "static"
      });

      if (booking) {
        modalRef.componentInstance.input = loadRequest(
          "cancelBookingRQ_" + booking["reference"].supplier
        );
      } else {
        modalRef.componentInstance.input = loadRequest("myBookingsRQ");
      }
    }
  }

  /**
   * Opens modal to show last response got form myBookings request
   */
  showResponse(booking = false) {
    if (sessionStorage.getItem("storedResponses")) {
      const modalRef = this.modalService.open(RsModalComponent, {
        size: "lg",
        keyboard: false,
        backdrop: "static"
      });

      if (booking) {
        modalRef.componentInstance.book = loadResponse(
          "cancelBookingRS_" + booking["reference"].supplier
        );
      } else {
        modalRef.componentInstance.book = loadResponse("myBookingsRS");
      }
    }
  }

  /**
   * Returns the title with the room descriptions of a selected booking
   * @param rooms
   */
  formatTitle(rooms: Room[]) {
    let typeRooms = [];
    let result = "";
    rooms.map(room => {
      let index = typeRooms.findIndex(
        roomAux => roomAux.typeRoom.code === room.code
      );
      if (index === -1) {
        typeRooms.push({ typeRoom: room, count: 1 });
      } else {
        typeRooms[index].count++;
      }
    });
    typeRooms.map(roomAux => {
      result =
        result + roomAux.typeRoom.description + " x" + roomAux.count + "\n";
    });
    return result;
  }

  openCancelPolicyModal(cancelPenalties) {
    const modalRef = this.modalService.open(CancelPolicyModalComponent, {
      size: "lg",
      keyboard: false,
      backdrop: "static"
    });
    modalRef.componentInstance.cancelPenalties = cancelPenalties;
  }
}
