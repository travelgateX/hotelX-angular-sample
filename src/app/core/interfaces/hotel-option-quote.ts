import { Surcharge } from './surcharge';
import { CancelPolicy } from './cancel-policy';
import { Price } from './price';
import { AuditData } from './audit-data';

export interface HotelOptionQuote {
  stats: string;
  auditData: AuditData;
  optionRefId: string;
  status: 'OK' | 'RQ';
  price: Price;
  cancelPolicy: CancelPolicy;
  remarks: string;
  surcharges: Surcharge[];
  cardTypes: string[];
}
