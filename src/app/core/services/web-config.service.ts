import { Injectable } from '@angular/core';
import { Access } from 'app/core/interfaces';

@Injectable()
export class WebConfigService {
  constructor() {}

  getItemFromLocalStorage(key: string): any {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key);
    }

    return '';
  }

  setItemInLocalStorage(key: string, value: any) {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  clearLocalStorage() {
    const cookiesConfirmed = localStorage.getItem('cookies-confirmed')
      ? true
      : false;
    localStorage.clear();
    localStorage.setItem('cookies-confirmed', cookiesConfirmed.toString());
  }

  removeItemFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
