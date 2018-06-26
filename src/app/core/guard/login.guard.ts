import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { WebConfigService } from '../services/web-config.service';

/**
 * Guard which handles user access
 */
@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private webConfigService: WebConfigService
  ) {}

  /**
   * Only lets user to enter when it's logged and it's JWT has not expired
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.authenticated()) {
      return true;
    }
    this.authService.logout();
    return false;
  }

  /**
   * Lets user to enter in all sub-rutes when it's logged and it's JWT has not expired
   */
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Temporal solution to catch the users that are using the old B2B
    let savedAccess;
    if (state.url.includes('search-bookings')) {
      if ((state.root.queryParams || {})['access']) {
        this.webConfigService.setAccess({
          code: state.root.queryParams['access'],
          name: 'UrlAccess'
        });
        savedAccess = state.root.queryParams['access'];
      }
    }
    if (this.authService.authenticated()) {
      return true;
    }
    this.authService.logout(savedAccess);
    return false;
  }
}
