import { AuditData } from 'app/core/interfaces/audit-data';
import { Option } from 'app/core/interfaces/option';
import { IWarning } from 'app/core/interfaces/warning';
import { IError } from 'app/core/interfaces/error';

export interface HotelSearch {
  context: string;
  stats: string;
  auditData: AuditData;
  options: Option[];
  errors: IError[];
  warnings: IWarning[];
}
