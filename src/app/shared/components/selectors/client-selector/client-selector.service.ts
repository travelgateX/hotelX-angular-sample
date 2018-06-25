import { Injectable } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CoreAdminService } from '../../../../core/services/core-admin.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

@Injectable()
export class ClientSelectorService {
  clientSelected$ = new BehaviorSubject<Client>(null);
  clients$ = new Subject<any>();

  clientSpinner = new Subject<number>();

  constructor(private coreAdminService: CoreAdminService, private webConfigService: WebConfigService) {}

  getClients(organization) {
    const clients = [];
    this.coreAdminService.getClients(organization).valueChanges.subscribe(res => {
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
