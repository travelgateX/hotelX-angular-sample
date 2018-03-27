import { marketValidator } from '../validators/market.validator';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive } from '@angular/core';

/**
 * Directive which checks a valid market object
 */
@Directive({
  selector: '[marketMatch][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MarketValidatorDirective,
      multi: true,
    },
  ],
})
export class MarketValidatorDirective implements Validator {
  constructor() {}

  /**
   * Validates if the control has a valid market
   * @param c an ngModel control
   */
  validate(c: FormControl) {
    return marketValidator()(c);
  }
}
