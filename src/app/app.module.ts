import { RouterModule } from '@angular/router';
import { PlatformModule } from './platform/platform.module';
import { environment } from './../environments/environment';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/auth.service';
import { configFactory, CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './static/components/home/home.component';
import { NotFoundComponent } from './static/components/not-found/not-found.component';
import { ConfigLoader } from '@ngx-config/core';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot({
      provide: ConfigLoader,
      useFactory: configFactory,
      deps: [Injector]
    }),
    PlatformModule,
    SharedModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule {}
