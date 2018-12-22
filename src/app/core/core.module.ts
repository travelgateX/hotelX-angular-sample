import { LangService } from './services/lang.service';
import { ApolloModule, Apollo } from 'apollo-angular';
import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
  Injector,
  Provider
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginGuard } from './guard/login.guard';
import { SearchService } from 'app/core/services/search.service';
import { HttpService } from 'app/core/services/http.service';
import { AuthService } from 'app/core/services/auth.service';
import { HubService } from 'app/core/services/hub.service';
import { BookingService } from 'app/core/services/booking.service';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpHeadersInterceptor } from './httpHeaders.interceptor';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { fragmentTypes } from './fragmentTypes';
import { WebConfigService } from './services/web-config.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigModule } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { environment } from '../../environments/environment';

export const configFactory = (http: HttpClient) => {
  return new ConfigHttpLoader(http, environment.configUrl);
};

@NgModule({
  imports: [CommonModule, HttpClientModule, ApolloModule, HttpLinkModule, ConfigModule.forRoot()],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      deps: [Injector],
      multi: true
    },
    HttpService,
    AuthService,
    WebConfigService,
    SearchService,
    HubService,
    BookingService,
    LoginGuard,
    LangService,
    HttpLink,
    CookieService
  ],
  declarations: []
})
export class CoreModule {
  /**
   * ForRoot method can only be accessed from App Module
   * It prevents to import a Service more than once, in this case, services are singleton
   */
  static forRoot(config: Provider): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpHeadersInterceptor,
          deps: [Injector],
          multi: true
        },
        HttpService,
        AuthService,
        WebConfigService,
        HubService,
        SearchService,
        BookingService,
        LoginGuard,
        LangService,
        HttpLink,
        CookieService,
        config,
      ]
    };
  }

  /**
   * Checks if Core Module is imported more than once
   * @param parentModule Core Module
   */
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
    const introspectionQueryResultData = fragmentTypes;
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });
    const http = httpLink.create({ uri: 'https://api.travelgatex.com' });

    apollo.create({
      link: http,
      cache: new InMemoryCache({ fragmentMatcher })
    });
  }
}
