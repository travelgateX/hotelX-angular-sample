import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { languageValidator } from 'app/platform/validators/language.validator';

/**
 * Directive which checks a valid market object
 */
@Directive({
  selector: '[languageMatch][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LanguageValidatorDirective,
      multi: true,
    },
  ],
})
export class LanguageValidatorDirective implements Validator {
  constructor() {}

  /**
   * Validates if the control has a valid market
   * @param c an ngModel control
   */
  validate(c: FormControl) {
    return languageValidator()(c);
  }
}
