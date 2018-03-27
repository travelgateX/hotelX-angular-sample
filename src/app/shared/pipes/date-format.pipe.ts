import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Transforms a NgbDateStruct to a string
 */
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  /**
   * Transforms a NgbDateStruct to a string
   * considering the join value.
   * @param value a NgbDateStruct object with a date
   * @param join value to make the join
   */
  transform(value: NgbDateStruct, format?: string): any {
    let date;
    if (value.year && value.month && value.day) {
     date = moment(value.year + '-' + value.month + '-' + value.day);
    } else {
     date = moment(value);
    }
    return date.format(format);
  }
}
