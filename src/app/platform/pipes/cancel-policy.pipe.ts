import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cancelPolicy',
})
export class CancelPolicyPipe implements PipeTransform {
  transform(value: any): string {
    if (value && value.hasOwnProperty('refundable')) {
      if (value.refundable) {
        return '';
      } else {
        return 'NRF';
      }
    }
    return '';
  }
}
