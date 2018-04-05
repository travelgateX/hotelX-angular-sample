import { FormControl, NG_VALIDATORS, Validator } from "@angular/forms";
import { Directive } from "@angular/core";
import { currencyValidator } from "app/platform/validators/currency.validator";

/**
 * Directive which checks a valid market object
 */
@Directive({
  selector: "[currencyMatch][ngModel]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CurrencyValidatorDirective,
      multi: true
    }
  ]
})
export class CurrencyValidatorDirective implements Validator {
  constructor() {}

  /**
   * Validates if the control has a valid market
   * @param c an ngModel control
   */
  validate(c: FormControl) {
    return currencyValidator()(c);
  }
}
