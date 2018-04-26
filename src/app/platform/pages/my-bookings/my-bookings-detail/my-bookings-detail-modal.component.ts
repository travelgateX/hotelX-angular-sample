import { Component, OnInit, Input } from '@angular/core';
import { HotelBookingDetail } from '../../../../core/interfaces/hotel-booking-detail';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HubService } from '../../../../core/services/hub.service';
import { CriteriaBooking } from '../../../../core/interfaces/criteria-booking';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { Room } from '../../../../core/interfaces/room';
import { Board } from '../../../../core/interfaces/board';

@Component({
  selector: 'b2b-my-bookings-detail-modal',
  templateUrl: './my-bookings-detail-modal.component.html',
  styleUrls: ['./my-bookings-detail-modal.component.css']
})
export class MyBookingsDetailModalComponent implements OnInit {
  @Input() booking: HotelBookingDetail;
  @Input() boards: Board[];
  totalPrice: number;

  constructor(
    public activeModal: NgbActiveModal,
    private hubService: HubService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.totalPrice = Math.round(this.booking.price.gross * 100) / 100
  }

  /**
   * Returns the title with the room descriptions of a selected booking
   * @param rooms
   */
  formatTitle(rooms: Room[]) {
    if (rooms) {
      const typeRooms = [];
      let result = '';
      rooms.map(room => {
        const index = typeRooms.findIndex(
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
          result + roomAux.typeRoom.description + ' x' + roomAux.count + '\n';
      });
      return result;
    }
  }
}
