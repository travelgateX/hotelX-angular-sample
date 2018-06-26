import { Injectable } from '@angular/core';
import { Language } from 'app/core/interfaces/language';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LanguageSelectorService {
  language$ = new BehaviorSubject<Language>(null);

  constructor() { }

}
