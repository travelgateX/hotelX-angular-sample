import { Pipe, PipeTransform } from '@angular/core';
import { getType } from 'app/shared/utilities/functions';

/**
 * Transforms first letter in uppercase
 */
@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  /**
   * Returns the first letter in uppercase
   * Only when its a string or a boolean
   * @param value it can be any
   */
  transform(value: any) {
    const type = getType(value);
    switch (type) {
      case 'Boolean':
        return (
          value
            .toString()
            .charAt(0)
            .toUpperCase() + value.toString().slice(1)
        );
      case 'String':
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return '';
  }
}
