import { Injectable } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { BehaviorSubject, Subject } from 'rxjs';
import { CoreAdminService } from '../../../../core/services/core-admin.service';

@Injectable()
export class ClientSelectorService {
  clientSelected$ = new BehaviorSubject<Client>(null);
  clients$ = new Subject<any>();

  clientSpinner = new Subject<number>();

  constructor(private coreAdminService: CoreAdminService) {}

  getClients(organization) {
    let clients = [];
    if(!organization){
      this.clientSpinner.next(0);
      return;
    }
    this.coreAdminService.getClients(organization).valueChanges.subscribe(res => {
      if (res) {
        res.data.admin.clients.edges.map(edge => {
          if (edge.node && edge.node.clientData) {
            clients.push(edge.node.clientData);
          }
        });
        clients = clients.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.clients$.next(clients);
        this.clientSpinner.next(clients.length);
      }else{
        this.clientSpinner.next(0);
      }
    });
  }
}
