import { Component, Input, OnInit } from '@angular/core';
import { MARKETS } from 'app/core/interfaces/markets';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Market } from 'app/core/interfaces/market';
import { MarketSelectorService } from './market-selector.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

@Component({
  selector: 'b2b-market-selector',
  templateUrl: './market-selector.component.html',
  styleUrls: ['./market-selector.component.css']
})
export class MarketSelectorComponent implements OnInit {
  @Input() disabled: Boolean;
  market: Market = {
    iso_code: 'es',
    country_name: 'Spain'
  };
  markets = MARKETS;
  marketResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.country_name}`;
  marketInputFormatter = (result: any) => {
    this.valuate(result.country_name);
    return result.country_name;
  };

  constructor(
    private marketSelectorService: MarketSelectorService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    let defaultMarket = this.webConfigService.getMarket();
    if (defaultMarket && defaultMarket.country_name) {
      this.market = defaultMarket;
    }
  }

  marketFilter = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .pipe(
        map(
          term =>
            term === ''
              ? []
              : this.markets.filter(item => {
                  const name =
                    item.country_name
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
   * @param marketTarget
   */
  valuate(marketNameTarget) {
    let market = this.markets.filter(
      x => x.country_name.toLowerCase() === marketNameTarget.toLowerCase()
    );
    if (market.length === 1) {
      this.webConfigService.setMarket(market[0]);
      this.marketSelectorService.market$.next(market[0]);
    } else {
      this.marketSelectorService.market$.next(null);
    }
  }
}
