import { Injectable } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ClientSelectorService {
  client$ = new BehaviorSubject<Client>(null);

  constructor() {}
}
