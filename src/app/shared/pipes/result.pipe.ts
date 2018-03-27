import { Criteria } from 'app/core/interfaces/criteria';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns the destination
 */
@Pipe({
  name: 'result',
})
export class ResultPipe implements PipeTransform {
  /**
   * Shows the selected destination
   * In case is a city, it returns the city name,
   * in the other case, it returns the firs selected hotel
   * @param value current search criteria
   */
  transform(value: Criteria): any {
    if (value) {
      if (value.city) {
        return value.items[0].display;
      } else {
        if (value.items.length > 1) {
          return value.items[0].display + '...';
        } else {
          return value.items[0].display;
        }
      }
    }
    return '';
  }
}
