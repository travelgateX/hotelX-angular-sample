import { Pipe, PipeTransform } from '@angular/core';
import { Board } from 'app/core/interfaces/board';

/**
 * Check if the current value is a mealplan
 */
@Pipe({
  name: 'mealplan',
})
export class MealplanPipe implements PipeTransform {
  /**
   * Transforms the value to a mealplan value
   *
   * In case value is not empty,
   * the pipe checks is a valid mealplan and if it founds it,
   * it returns only the name, if not, then returns the value
   * @param value param to check
   */
  transform(value: string | null, mealplans: Board[]): string | null {
    if (value) {
      let result = null;
      mealplans.forEach(x => {
        if (x.boardCode === value) {
          result = x.boardCode;
          return;
        }
      });

      return result;
    }
    return value;
  }
}
