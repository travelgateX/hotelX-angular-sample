import { auth0Config } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IProfile } from 'app/core/interfaces/iprofile';
import { NotificationService } from '../../shared/services/notification.service';
import { ClientSelectorService } from '../../shared/components/selectors/client-selector/client-selector.service';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { WebConfigService } from './web-config.service';
import { CookieService } from 'ngx-cookie-service';

declare var auth0: any;

/**
 * Auth0 service which handles user access, information, etc
 */
@Injectable()
export class AuthService {
  userProfile: IProfile;
  profile$ = new BehaviorSubject<any>(this.userProfile);

  lock = new Auth0Lock(
    auth0Config.clientId,
    auth0Config.domain,
    auth0Config.options
  );

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private clientSelectorService: ClientSelectorService,
    private indexedDBService: IndexedDbService,
    private webConfigService: WebConfigService,
    private cookieService: CookieService
  ) {
    // Checks if there is already a user logged checking local storage
    if (localStorage.getItem('profile') !== null) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.profile$.next(this.userProfile);
    }
    if (!this.userProfile && this.cookieService.get('loggedin')) {
      let login = JSON.parse(this.cookieService.get('loggedin'));
      this.getUserInfo(login, login.expiresAt, false);
    }

    this.lock.on('authenticated', authResult => {
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
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
    this.webConfigService.setAccess({
      code: savedAccess,
      name: 'UrlAccess'
    });
    this.indexedDBService.closeDB();
    for (
      let count = 0;
      this.cookieService.check('loggedin') && count < 100;
      count++
    ) {
      this.cookieService.delete('loggedin', '/', 'travelgatex.com');
    }

    if (savedAccess) {
      this.router.navigate(['/home', { popLogin: true }]);
    } else {
      this.router.navigate(['/home']);
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

// import { environment, auth0Config } from './../../../environments/environment';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { IProfile } from 'app/core/interfaces/iprofile';
// import { NotificationService } from '../../shared/services/notification.service';

// declare var auth0: any;

// /**
//  * Auth0 service which handles user access, information, etc
//  */
// @Injectable()
// export class AuthService {
//   userProfile: IProfile;
//   profile$ = new BehaviorSubject<any>(this.userProfile);

//   auth0HUB = new auth0.WebAuth({
//     domain: auth0Config.domain,
//     clientID: auth0Config.clientId,
//     redirectUri: location.origin + '/home',
//     responseType: 'token id_token',
//     scope: 'openid profile email picture name',
//     leeway: 30
//   });

//   constructor(
//     private router: Router,
//     private notificationService: NotificationService
//   ) {
//     // Checks if there is already a user logged checking local storage
//     if (localStorage.getItem('profile') !== null) {
//       this.userProfile = JSON.parse(localStorage.getItem('profile'));
//       this.profile$.next(this.userProfile);
//     }
//   }

//   /**
//    * Handle user authentication
//    */
//   handleAuthentication(): void {
//     this.auth0HUB.parseHash((err, authResult) => {
//       if (authResult && authResult.accessToken && authResult.idToken) {
//         window.location.hash = '';
//         this.setSession(authResult);
//         this.router.navigate(['/platform/search-bookings']);
//       } else if (err) {
//         console.log(err);
//         this.notificationService.error(err);
//         this.router.navigate(['/home']);
//       }
//     });
//   }

//   /**
//    * Set the time that the access token will expire at,
//    * also calls getProfile to save profile info
//    */
//   private setSession(authResult): void {
//     const expiresAt = JSON.stringify(
//       authResult.expiresIn * 1000 + new Date().getTime()
//     );
//     localStorage.setItem('access_token', authResult.accessToken);
//     localStorage.setItem('token', authResult.idToken);
//     localStorage.setItem('expires_at', expiresAt);
//     this.getProfile();
//   }

//   /**
//    * Gets progile and saves all the data in local storage and user object
//    */
//   getProfile(): void {
//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       throw new Error('Access token must exist to fetch profile');
//     }

//     const self = this;
//     this.auth0HUB.client.userInfo(accessToken, (err, profile) => {
//       if (profile) {
//         self.userProfile = profile;
//         self.userProfile.groups = profile['https://xtg.com/groups'];
//         self.userProfile.permissions = profile['https://xtg.com/permissions'];
//         self.userProfile.roles = profile['https://xtg.com/roles'];
//         self.profile$.next(self.userProfile);
//         localStorage.setItem('profile', JSON.stringify(self.userProfile));
//       }
//     });
//   }

//   /**
//    * Sign in a user
//    * @param username Username or email
//    * @param password Password
//    */
//   login(): void {
//     this.auth0HUB.authorize();
//   }

//   /**
//    * Remove profile and token from localStorage
//    */
//   logout(): void {
//     this.userProfile = null;
//     this.profile$.next(this.userProfile);
//     localStorage.clear();
//     this.router.navigate(['/home']);
//   }

//   /**
//    * Check whether the current time is past the access token's expiry time
//    */
//   authenticated(): boolean {
//     const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
//     return new Date() < new Date(expiresAt);
//   }
// }
