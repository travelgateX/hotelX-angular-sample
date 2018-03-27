import { MARKETS } from './../../core/interfaces/markets';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const markets = MARKETS;
const notValid = {
  marketMatch: {
    allowedMarket: 'No market selected',
  },
};

/**
 * Checks if the control has a valid market.
 *
 * From a control, check if it has value and if so,
 * check that the market selected is correct.
 * In case there is an error, we return notValid object
 */
export function marketValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.hasOwnProperty('iso_code')) {
      const isValid = markets.find(x => x.iso_code === control.value.iso_code);
      if (!isValid) {
        return notValid;
      } else {
        return null;
      }
    } else {
      return notValid;
    }
  };
}
