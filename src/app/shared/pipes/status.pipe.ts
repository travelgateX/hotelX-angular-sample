import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: string, args?: any): string {
    switch (value.toLowerCase()) {
      case 'cancelled':
        return 'CN';
      case 'on_request':
        return 'RQ';
      case 'ok':
        return 'OK';
      case 'ko':
        return 'KO';
      default:
        return 'UN';
    }
  }
}
