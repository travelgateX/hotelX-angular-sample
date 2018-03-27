import { BookingHotel } from './booking-hotel';
import { CancelPolicy } from './cancel-policy';
import { Price } from './price';
import { Holder } from './holder';
import { Reference } from './reference';

export interface HotelBookingDetail {
  reference: Reference;
  holder: Holder;
  hotel: BookingHotel;
  price: Price;
  cancelPolicy?: CancelPolicy;
  remarks: string;
  status: 'OK' | 'RQ';
  payable: string;
}
