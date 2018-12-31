import { AuthService } from './../../../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'b2b-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription[];
  profile: any;
  environment: any;
  show: true;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.subscriptions$ = [];
    this.subscriptions$[0] = this.authService.profile$.subscribe(profile => {
      this.profile = profile;
    });
    this.environment = environment;
  }

  ngOnDestroy() {
    this.subscriptions$.map(i => i.unsubscribe());
  }
}
