import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'package',
})
export class PackagePipe implements PipeTransform {
  /**
   * Check only rates which are package or nrf
   * due to travelgatex does not have any other type (or it should)
   * @param array option rate values
   */
  transform(array: string[]): string {
    const result = [];
    if (array) {
      array.map(value => {
        switch (value) {
          case 'PACKAGE':
            result.push(value);
            break;
          case 'NON_REFUNDABLE':
            result.push('NRF');
            break;
          default:
            console.log('There is another package type: ', value);
            break;
        }
      });
    }

    if (result.length) {
      return result.join(', ');
    }
    return '';
  }
}
