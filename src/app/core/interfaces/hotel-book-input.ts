import { BookingRoom } from 'app/core/interfaces/booking-room';
import { HolderInput } from 'app/core/interfaces/holder-input';
import { CreditCardInput } from 'app/core/interfaces/credit-card-input';
import { DeltaPriceInput } from 'app/core/interfaces/delta-price-input';

export interface HotelBookInput {
  optionRefId: string;
  language?: string;
  clientReference: string;
  deltaPrice?: DeltaPriceInput;
  creditCard?: CreditCardInput;
  remarks?: string;
  holder: HolderInput;
  rooms: BookingRoom[];
}
