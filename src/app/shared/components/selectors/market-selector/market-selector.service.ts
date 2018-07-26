import { Injectable } from '@angular/core';
import { Market } from 'app/core/interfaces/market';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MarketSelectorService {
  market$ = new BehaviorSubject<Market>(null);

  constructor() { }

}
