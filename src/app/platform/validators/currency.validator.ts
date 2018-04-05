import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CURRENCIES } from '../../core/interfaces/currencies';

const currencies = CURRENCIES;
const notValid = {
  currencyMatch: {
    allowedCurrency: 'No currency selected',
  },
};

/**
 * Checks if the control has a valid currency.
 *
 * From a control, check if it has value and if so,
 * check that the currency selected is correct.
 * In case there is an error, we return notValid object
 */
export function currencyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.hasOwnProperty('iso_code')) {
      const isValid = currencies.find(x => x.iso_code === control.value.iso_code);
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
