import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { HubService } from '../../../../core/services/hub.service';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { ClientSelectorService } from './client-selector.service';
import { OrganizationSelectorService } from '../organization-selector/organization-selector.service';

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
    private hubService: HubService,
    private webConfigService: WebConfigService,
    private clientSelectorService: ClientSelectorService,
    private organizationSelectorService: OrganizationSelectorService
  ) {}

  ngOnInit() {
    this.showErrorClients = false;
    this.organizationSelectorService.organizationSelected$.subscribe(res => {
      this.clientSelectorService.getClients(res);
    });
    this.clientSelectorService.clients$.subscribe(
      res => {
        this.clients = res;
        let storedClient = this.webConfigService.getClient();
        if (
          storedClient &&
          this.clients.findIndex(
            client => client.code === storedClient.code
          ) !== -1
        ) {
          this.clientSelected = this.webConfigService.getClient().code;
          this.onClientSelected();
        } else if (this.clients.length === 1) {
          this.clientSelected = this.clients[0].code;
          this.onClientSelected();
        }
        if (this.clients.length === 0) {
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
    let client = this.clients.find(
      client => client.code === this.clientSelected
    );
    if (client) {
      this.webConfigService.setClient(client);
      this.clientSelectorService.clientSelected$.next(client);
    }
  }
}
