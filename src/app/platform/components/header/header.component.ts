import { AuthService } from './../../../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImpersonationModalComponent } from '../impersonation-modal/impersonation-modal.component';

@Component({
  selector: 'b2b-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription[];
  profile: any;
  environment: any;
  emailImper: string = null;

  constructor(
    public authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.subscriptions$ = [];
    this.subscriptions$[0] = this.authService.profile$.subscribe(profile => {
      this.profile = profile;
    });
    this.environment = environment;

    this.authService.emailImpes$.subscribe(res => {
      this.emailImper = res;
    });
  }

  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }

  onImper() {
    this.modalService.open(ImpersonationModalComponent, {
      keyboard: true,
      windowClass: 'modal-impersonation'
    });
  }
  offImper() {
    // this.authUniversalService.clearImpersotion();
  }
}
