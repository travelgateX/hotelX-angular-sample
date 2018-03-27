import { Price } from './price';

export interface Breakdown {
  effectiveDate: string;
  expireDate: string;
  price: Price;
}
