import {
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct): string {
    if (date === null) {
      return '';
    }
    const d = moment({
      year: date.year,
      month: date.month - 1,
      date: date.day
    });
    return d.isValid() ? d.format(environment.organization.dateFormat) : '';
  }

  parse(value: string): NgbDateStruct {
    if (!value) {
      return null;
    }
    const d = moment(value, environment.organization.dateFormat);
    return d.isValid()
      ? {
          year: d.year(),
          month: d.month() + 1,
          day: d.date()
        }
      : null;
  }
}
