import { Injectable } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { BehaviorSubject, Subject } from 'rxjs';
import { HubService } from '../../../../core/services/hub.service';
import { CoreAdminService } from '../../../../core/services/core-admin.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

@Injectable()
export class ClientSelectorService {
  clientSelected$ = new BehaviorSubject<Client>(null);
  clients$ = new Subject<any>();

  clientSpinner = new Subject<number>();

  constructor(private coreAdminService: CoreAdminService, private webConfigService: WebConfigService) {}

  getClients(organization) {
    let clients = [];
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
      }
    });
  }
}
