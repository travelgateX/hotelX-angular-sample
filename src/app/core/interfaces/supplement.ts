import { Price } from './price';

export interface Supplement {
  code?: any;
  name?: any;
  description: string;
  supplementType: string;
  chargeType: string;
  mandatory: boolean;
  durationType?: any;
  quantity?: any;
  unit?: any;
  effectiveDate?: any;
  expireDate?: any;
  resort?: any;
  price: Price;
}
