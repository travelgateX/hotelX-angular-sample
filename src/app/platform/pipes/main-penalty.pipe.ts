import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mainPenalty',
})
export class MainPenaltyPipe implements PipeTransform {
  transform(value: any, checkIn: any): any {
    const checkin = new Date(
      `${checkIn.year}/${checkIn.month}/${checkIn.day} 00:00:00`
    );
    return checkin.setHours(checkin.getHours() - value.hoursBefore);
  }
}
