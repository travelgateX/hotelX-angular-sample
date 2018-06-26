import { Injectable } from '@angular/core';
import { Access, Supplier, Currency, Language, Market, Client } from 'app/core/interfaces';

@Injectable()
export class WebConfigService {
  constructor() {}

  setAccess(access: Access) {
    localStorage.setItem('access', JSON.stringify(access));
  }

  getAccess(): Access {
    return JSON.parse(localStorage.getItem('access'));
  }

  setSupplier(supplier: Supplier) {
    localStorage.setItem('supplier', JSON.stringify(supplier));
  }

  getSupplier(): Supplier {
    return JSON.parse(localStorage.getItem('supplier'));
  }

  setLanguage(language: Language) {
    localStorage.setItem('language', JSON.stringify(language));
  }

  getLanguage(): Language {
    return JSON.parse(localStorage.getItem('language'));
  }

  setContext(context: string) {
    localStorage.setItem('context', JSON.stringify(context));
  }

  getContext(): string {
    return JSON.parse(localStorage.getItem('context'));
  }

  setCurrency(currency: Currency) {
    localStorage.setItem('currency', JSON.stringify(currency));
  }

  getCurrency(): Currency {
    return JSON.parse(localStorage.getItem('currency'));
  }

  setMarket(market: Market) {
    localStorage.setItem('market', JSON.stringify(market));
  }

  getMarket(): Market {
    return JSON.parse(localStorage.getItem('market'));
  }

  setClient(client: Client) {
    localStorage.setItem('client', JSON.stringify(client));
  }

  getClient(): Client {
    return JSON.parse(localStorage.getItem('client'));
  }
}
