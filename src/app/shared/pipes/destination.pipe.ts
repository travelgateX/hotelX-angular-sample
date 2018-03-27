import { Pipe, PipeTransform } from '@angular/core';
import { Criteria } from 'app/core/interfaces/criteria';

/**
 * Show current selected destination
 */
@Pipe({
  name: 'destination',
})
export class DestinationPipe implements PipeTransform {
  /**
   * Shows the selected city or the list of the selected hotels
   * @param value Criteria search object
   */
  transform(value: Criteria): any {
    if (value) {
      if (value.city) {
        return value.items[0].label;
      } else {
        return value.items.map(x => x.display).join(', ');
      }
    }
    return 'none';
  }
}
