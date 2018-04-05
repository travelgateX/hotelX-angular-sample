import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clipboard'
})
export class ClipboardPipe implements PipeTransform {

  transform(value: boolean, args?: any): any {
    return value ? 'Copied!' : 'Copy to clipboard';
  }
}
