import { auth0Config } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IProfile } from 'app/core/interfaces/iprofile';
import { NotificationService } from '../../shared/services/notification.service';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { WebConfigService } from './web-config.service';
import { CookieService } from 'ngx-cookie-service';
import { Apollo } from 'apollo-angular';
import { getImpersonation } from '../graphQL/shared/queries/impersonation';

/**
 * Auth0 service which handles user access, information, etc
 */
@Injectable()
export class AuthService {
  userProfile: IProfile;
  profile$ = new BehaviorSubject<any>(this.userProfile);
  emailImpes$: BehaviorSubject<string> = new BehaviorSubject(null);

  lock = new Auth0Lock(auth0Config.clientId, auth0Config.domain, auth0Config.options);

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private indexedDBService: IndexedDbService,
    private webConfigService: WebConfigService,
    private cookieService: CookieService,
    private apollo: Apollo
  ) {
    // Checks if there is already a user logged checking local storage
    if (localStorage.getItem('profile') !== null) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.profile$.next(this.userProfile);
    }
    if (!this.userProfile && this.cookieService.get('loggedin')) {
      const login = JSON.parse(this.cookieService.get('loggedin'));
      this.getUserInfo(login, login.expiresAt, false);
    }
    if (this.cookieService.get('impersonation')) {
      const impersonation = JSON.parse(this.cookieService.get('impersonation'));
      this.webConfigService.setItemInLocalStorage('id_token_impersonation', impersonation.idToken);
      this.webConfigService.setItemInLocalStorage('email_impersonation', impersonation.memberCode);
    }

    this.lock.on('authenticated', authResult => {
      const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
      this.getUserInfo(authResult, expiresAt, true);
      this.cookieService.set(
        'loggedin',
        JSON.stringify({
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
          expiresAt: expiresAt
        }),
        0,
        '/',
        'travelgatex.com'
      );
    });
    this.lock.on('authorization_error', error => console.log(error));

    this.lock.on('unrecoverable_error', error => console.log(error));

    const emailImpes = this.webConfigService.getItemFromLocalStorage('email_impersonation');
    const idTokenImpes = this.webConfigService.getItemFromLocalStorage('id_token_impersonation');
    if (!!emailImpes && !!idTokenImpes) {
      this.emailImpes$.next(emailImpes);
    } else {
      this.clearImpersotion(false);
    }
  }

  getUserInfo(authResult, expiresAt, redirect) {
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        console.log(error);
        this.notificationService.error(error);
        this.router.navigate(['/home']);
        return;
      }

      window.location.hash = '';
      this.setSession(authResult, profile, expiresAt);
      this.router.navigate(['/platform/search-bookings']);
    });
  }

  /**
   * Handle user authentication
   */
  handleAuthentication(): void {
    if (!this.authenticated() && localStorage.getItem('expires_at')) {
      this.logout();
    }
  }

  /**
   * Set the time that the access token will expire at,
   * also calls getProfile to save profile info
   */
  private setSession(authResult, profile, expiresAt): void {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.userProfile = profile;
    this.profile$.next(this.userProfile);
    localStorage.setItem('profile', JSON.stringify(this.userProfile));
    this.indexedDBService.openDB(['interceptedRequest', 'storedResponses']);
  }

  /**
   * Sign in a user
   * @param username Username or email
   * @param password Password
   */
  login(): void {
    this.lock.show();
  }

  /**
   * Remove profile and token from localStorage
   */
  logout(savedAccess?: string): void {
    this.userProfile = null;
    this.profile$.next(this.userProfile);
    localStorage.clear();
    this.webConfigService.setObjectInLocalStorage('access', {
      code: savedAccess,
      name: 'UrlAccess',
      isTest: false
    });
    this.indexedDBService.closeDB();
    for (let count = 0; this.cookieService.check('loggedin') && count < 100; count++) {
      this.cookieService.delete('loggedin', '/', 'travelgatex.com');
    }

    if (savedAccess) {
      this.router.navigate(['/home', { popLogin: true }]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  getImpersonation(memberCode: string) {
    return new Promise((resolve, reject) =>
      this.apollo
        .use('coreController')
        .watchQuery<any>({
          query: getImpersonation,
          variables: { memberCode: memberCode },
          fetchPolicy: 'network-only'
        })
        .valueChanges.subscribe((res: any) => {
          const member = res.data.admin.members.edges[0].node.memberData;
          const idToken = !member ? null : member.impersonationJWT.token;
          if (idToken) {
            this.webConfigService.setItemInLocalStorage('id_token_impersonation', idToken);
            this.webConfigService.setItemInLocalStorage('email_impersonation', memberCode);
            this.cookieService.set(
              'impersonation',
              JSON.stringify({
                emailImpersonation: memberCode,
                idTokenImpersonation: idToken
              }),
              0,
              '/',
              'travelgatex.com'
            );
            this.emailImpes$.next(memberCode);
            window.location.reload();
            return resolve(true);
          }
          return resolve(false);
        })
    );
  }

  clearImpersotion(reload: boolean) {
    this.webConfigService.removeItemFromLocalStorage('id_token_impersonation');
    this.webConfigService.removeItemFromLocalStorage('email_impersonation');
    for (let count = 0; this.cookieService.check('impersonation') && count < 100; count++) {
      this.cookieService.delete('impersonation', '/', 'travelgatex.com');
    }
    this.emailImpes$.next(null);
    if (reload) {
      window.location.reload();
    }
  }

  /**
   * Check whether the current time is past the access token's expiry time
   */
  authenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date() < new Date(expiresAt);
  }
}
