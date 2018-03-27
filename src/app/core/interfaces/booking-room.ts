import { BookingPaxes } from 'app/core/interfaces/booking-paxes';

export interface BookingRoom {
  occupancyRefId: number;
  paxes: BookingPaxes[];
}
