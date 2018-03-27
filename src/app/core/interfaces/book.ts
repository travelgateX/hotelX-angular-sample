import { AuditData } from "app/core/interfaces/audit-data";
import { IWarning } from "app/core/interfaces/warning";
import { IError } from "app/core/interfaces/error";
import { Booking } from "app/core/interfaces/booking";

export interface Book {
  stats: string;
  auditData: AuditData;
  booking: Booking;
  warnings: IWarning[];
  errors: IError[];
}
