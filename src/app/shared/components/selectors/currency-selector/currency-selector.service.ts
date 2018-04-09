import { Injectable } from '@angular/core';
import { Currency } from 'app/core/interfaces/currency';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CurrencySelectorService {
  currency$ = new BehaviorSubject<Currency>(null);

  constructor() { }

}
