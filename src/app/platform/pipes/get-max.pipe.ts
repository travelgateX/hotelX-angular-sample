import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getMax',
})
export class GetMaxPipe implements PipeTransform {
  transform(value: any[]): any {
    if (value && value.length) {
      let max = { hoursBefore: 0 };
      value.forEach(element => {
        max = element.hoursBefore > max.hoursBefore ? element : max;
      });
      return max;
    }
    return null;
  }
}
