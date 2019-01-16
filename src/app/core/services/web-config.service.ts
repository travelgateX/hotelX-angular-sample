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

  getObjectFromLocalStorage(key: string): any {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    }

    return '';
  }

  setItemInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  setObjectInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
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
  
  setOrganization(organization: string) {
    localStorage.setItem('organization', JSON.stringify(organization));
  }

  getOrganization(): string {
    return JSON.parse(localStorage.getItem('organization'));
  }
}
