import { Price } from 'app/core/interfaces/price';

export interface Surcharge {
  chargeType: 'INCLUDE' | 'EXCLUDE' | 'PAY_AT_PROPERTY';
  price: Price;
  escription: string;
}
