import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { ClientSelectorService } from './client-selector.service';
import { OrganizationSelectorService } from '../organization-selector/organization-selector.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'b2b-client-selector',
  templateUrl: './client-selector.component.html',
  styleUrls: ['./client-selector.component.css']
})
export class ClientSelectorComponent implements OnInit {
  // @Output() accessesToSearchOutput = new EventEmitter();
  clients: Client[];
  clientSelected: string;
  showErrorClients: boolean;
  constructor(
    private webConfigService: WebConfigService,
    private clientSelectorService: ClientSelectorService,
    private organizationSelectorService: OrganizationSelectorService, 
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.showErrorClients = false;
    this.organizationSelectorService.organizationSelected$.subscribe(res => {
      this.clientSelectorService.getClients(res);
    });
    this.clientSelectorService.clients$.subscribe(
      res => {
        this.clients = res;
        const storedClient = this.webConfigService.getObjectFromLocalStorage('client');
        if (
          storedClient &&
          this.clients.findIndex(
            client => client.code === storedClient.code
          ) !== -1
        ) {
          this.clientSelected = this.webConfigService.getObjectFromLocalStorage('client')['code'];
          this.onClientSelected();
          this.showErrorClients = false;
        } else if (this.clients.length === 1) {
          this.clientSelected = this.clients[0].code;
          this.onClientSelected();
          this.showErrorClients = false;
        }
        if (this.clients.length === 0) {
          this.notificationService.toast('Clients', 'No clients available', 5);
          this.clientSelectorService.clientSelected$.next(null);
          this.showErrorClients = true;
        }
      },
      err => {
        console.log('Error: on getClients()');
        console.log(err);
      }
    );
  }

  onClientSelected() {
    const client = this.clients.find(
      clientAux => clientAux.code === this.clientSelected
    );
    if (client) {
      this.webConfigService.setObjectInLocalStorage('client', client);
      this.clientSelectorService.clientSelected$.next(client);
    }
  }
}
