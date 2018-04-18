import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { HubService } from '../../../../core/services/hub.service';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { ClientSelectorService } from './client-selector.service';

@Component({
  selector: 'b2b-client-selector',
  templateUrl: './client-selector.component.html',
  styleUrls: ['./client-selector.component.css']
})
export class ClientSelectorComponent implements OnInit {
  // @Output() accessesToSearchOutput = new EventEmitter();
  showErrorSuppliers: boolean;
  clients: Client[];
  clientSelected: string;
  constructor(
    private hubService: HubService,
    private webConfigService: WebConfigService,
    private clientSelectorService: ClientSelectorService
  ) {}

  ngOnInit() {
    this.hubService.getClients().valueChanges.subscribe(
      res => {
        this.clients = [];
        if (res.data.admin.clients.edges.length > 0)
          res.data.admin.clients.edges.map(edge => {
            if (edge.node && edge.node.clientData) {
              this.clients.push(edge.node.clientData);
            }
          });
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
      this.clientSelectorService.client$.next(client);
    }
  }
}
