import { BookingRoom } from 'app/core/interfaces/booking-room';
import { Occupancy } from 'app/core/interfaces/occupancy';

export interface BookingHotel {
  creationDate: Date;
  checkIn: Date;
  checkOut: Date;
  hotelCode: string;
  hotelName: string;
  boardCode: string;
  occupancies: Occupancy[];
  rooms: BookingRoom[];
}
