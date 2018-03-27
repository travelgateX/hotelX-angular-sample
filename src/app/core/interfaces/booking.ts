import { Price } from 'app/core/interfaces/price';
import { Reference } from 'app/core/interfaces/reference';

export interface Booking {
  reference: Reference;
  status: 'OK' | 'RQ';
  price: Price;
  remarks: string;
  payable: string;
}
