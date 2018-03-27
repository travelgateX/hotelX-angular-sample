import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';

/**
 * Handles all the functions from language
 */
@Injectable()
export class LangService {
  constructor() {}

  /**
   * Returns the current lang selected through the url
   * https://travelgatex-b2b-dev.firebaseapp.com/en/home -> en
   * https://travelgatex-b2b-dev.firebaseapp.com/es/home -> es
   */
  getLang(): string {
    const currentLang = environment.languages.filter(lang => {
      return window.location.href.indexOf(`/${lang}/`) !== -1;
    });

    return currentLang.length ? currentLang[0] : 'en';
  }
}
