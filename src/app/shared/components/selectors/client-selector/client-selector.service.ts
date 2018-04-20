import { Injectable } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HubService } from '../../../../core/services/hub.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClientSelectorService {
  clientSelected$ = new BehaviorSubject<Client>(null);
  clients$ = new Subject<any>();

  clientSpinner = new Subject<number>();

  constructor(private hubService: HubService) {}

  getClients() {
    let clients = [];
    this.hubService.getClients().valueChanges.subscribe(res => {
      if (res) {
        res.data.admin.clients.edges.map(edge => {
          if (edge.node && edge.node.clientData) {
            clients.push(edge.node.clientData);
          }
        });
        this.clients$.next(clients);
        this.clientSpinner.next(clients.length);
      }
    });
  }
}
