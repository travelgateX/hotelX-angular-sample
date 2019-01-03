import { Component, Input, OnInit } from '@angular/core';
import { CURRENCIES } from 'app/core/interfaces/currencies';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Currency } from 'app/core/interfaces/currency';
import { CurrencySelectorService } from './currency-selector.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

@Component({
  selector: 'b2b-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.css']
})
export class CurrencySelectorComponent implements OnInit {
  @Input() disabled: Boolean;
  currency: Currency = { currency_name: 'Euro', iso_code: 'EUR' };
  currencies = CURRENCIES;
  currencyResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.currency_name}`;
  currencyInputFormatter = (result: any) => {
    this.valuate(result.currency_name);
    return result.currency_name;
  };

  constructor(
    private currencySelectorService: CurrencySelectorService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    const defaultCurrency = this.webConfigService.getObjectFromLocalStorage('currency');
    if (defaultCurrency && defaultCurrency.currency_name) {
      this.currency = defaultCurrency;
    }
  }

  currencyFilter = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .pipe(
        map(
          term =>
            term === ''
              ? []
              : this.currencies.filter(item => {
                  const name =
                    item.currency_name
                      .toLowerCase()
                      .indexOf(term.toLowerCase()) !== -1;

                  return (
                    item.iso_code.toLowerCase().indexOf(term.toLowerCase()) !==
                      -1 || name
                  );
                })
        )
      );

  /**
   * We pass the name target due to a we cannot have objects on NgModel yet and we
   * must valuate when the result was introduced by keyboard or by click selection on the typehead.
   * @param currencyTarget
   */
  valuate(currencyNameTarget) {
    const currency = this.currencies.filter(
      x => x.currency_name.toLowerCase() === currencyNameTarget.toLowerCase()
    );
    if (currency.length === 1) {
      this.webConfigService.setObjectInLocalStorage('currency', currency[0]);
      this.currencySelectorService.currency$.next(currency[0]);
    } else {
      this.currencySelectorService.currency$.next(null);
    }
  }
}
