import { CloseBookingsComponent } from './platform/pages/close-bookings/close-bookings.component';
import { ResultBookingsComponent } from './platform/pages/result-bookings/result-bookings.component';
import { SearchBookingsComponent } from './platform/pages/search-bookings/search-bookings.component';
import { LoginGuard } from './core/guard/login.guard';
import { NotFoundComponent } from './static/components/not-found/not-found.component';
import { HomeComponent } from './static/components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyBookingsComponent } from './platform/pages/my-bookings/my-bookings.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'platform',
    canActivateChild: [LoginGuard],
    children: [
      {
        path: 'search-bookings',
        component: SearchBookingsComponent
      },
      {
        path: 'results-bookings',
        component: ResultBookingsComponent
      },
      {
        path: 'close-bookings',
        component: CloseBookingsComponent
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'search-bookings'
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
