import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LANGUAGES } from 'app/core/interfaces/languages';

const languages = LANGUAGES;
const notValid = {
  languageMatch: {
    allowedLanguage: 'No language selected',
  },
};

/**
 * Checks if the control has a valid language.
 *
 * From a control, check if it has value and if so,
 * check that the language selected is correct.
 * In case there is an error, we return notValid object
 */
export function languageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.hasOwnProperty('iso_code')) {
      const isValid = languages.find(x => x.iso_code === control.value.iso_code);
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
