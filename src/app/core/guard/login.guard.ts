import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

/**
 * Guard which handles user access
 */
@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

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
    if (this.authService.authenticated()) {
      return true;
    }
    this.authService.logout();
    return false;
  }
}
