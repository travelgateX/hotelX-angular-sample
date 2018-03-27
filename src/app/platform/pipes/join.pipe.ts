import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(arr: Array<any>, separator: string, property?: string[]): string {
    if (arr && arr.length) {
      if (property) {
        if (property.length === 1) {
          return arr.map(x => x[property[0]]).join(separator);
        }
        if (property.length > 1) {
          return arr
            .map(x => x[property[0]] + ' (' + x[property[1]] + ')')
            .join(separator);
        }
      } else {
        return arr.join(separator);
      }
    } else {
      return '';
    }
  }
}
