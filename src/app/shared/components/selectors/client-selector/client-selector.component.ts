import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../core/interfaces/client';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { ClientSelectorService } from './client-selector.service';

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
    private clientSelectorService: ClientSelectorService
  ) {}

  ngOnInit() {
    this.showErrorClients = false;
    this.clientSelectorService.getClients();
    this.clientSelectorService.clients$.subscribe(
      res => {
        this.clients = res;
        const storedClient = this.webConfigService.getItemFromLocalStorage('client');
        if (
          storedClient &&
          this.clients.findIndex(
            client => client.code === storedClient.code
          ) !== -1
        ) {
          this.clientSelected = this.webConfigService.getItemFromLocalStorage('client')['code'];
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
    const client = this.clients.find(
      clientAux => clientAux.code === this.clientSelected
    );
    if (client) {
      this.webConfigService.setItemInLocalStorage('client', client);
      this.clientSelectorService.clientSelected$.next(client);
    }
  }
}
