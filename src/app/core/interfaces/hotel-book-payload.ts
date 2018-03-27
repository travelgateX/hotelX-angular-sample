import { HotelBookingDetail } from './hotel-booking-detail';
import { AuditData } from 'app/core/interfaces/audit-data';
import { IWarning } from 'app/core/interfaces/warning';
import { IError } from 'app/core/interfaces/error';

export interface HotelBookPayload {
  stats: string;
  auditData: AuditData;
  booking: HotelBookingDetail;
  errors: IError[];
  warnings: IWarning[];
}
