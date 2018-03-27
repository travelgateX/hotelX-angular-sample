import { CancelPolicy } from './cancel-policy';
import { Supplement } from './supplement';
import { Price } from './price';
import { Room } from './room';
import { Occupancy } from './occupancy';

export interface Option {
  supplier: string;
  access: string;
  market: string;
  hotelCode: string;
  hotelName: string;
  boardCode: string;
  paymentType: string;
  status: 'OK' | 'RQ';
  occupancies: Occupancy[];
  rooms: Room[];
  price: Price;
  supplements: Supplement[] | null;
  rateRules: string[] | null;
  cancelPolicy: CancelPolicy | null;
  remarks: String;
  id: string;
}
