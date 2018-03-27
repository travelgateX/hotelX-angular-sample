import { RouterModule } from '@angular/router';
import { PlatformModule } from './platform/platform.module';
import { environment } from './../environments/environment';
import { SharedModule } from './shared/shared.module';
import { NotificationService } from './core/services/notification.service';
import { AuthService } from './core/services/auth.service';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastyModule } from 'ng2-toasty';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './static/components/home/home.component';
import { NotFoundComponent } from './static/components/not-found/not-found.component';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    PlatformModule,
    SharedModule,
    AppRoutingModule,
    ToastyModule.forRoot(),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey,
    }),
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule {}
