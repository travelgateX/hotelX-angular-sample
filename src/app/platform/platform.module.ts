import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TagInputModule } from "ngx-chips";
import { NgxPaginationModule } from "ngx-pagination";

import { SharedModule } from "./../shared/shared.module";
import { LoginGuard } from "./../core/guard/login.guard";
import { ResultBookingsComponent } from "./pages/result-bookings/result-bookings.component";
import { SearchBookingsComponent } from "./pages/search-bookings/search-bookings.component";
import { AvailabilityComponent } from "./components/availability/availability.component";
import { BookingsComponent } from "./components/bookings/bookings.component";
import { HeaderComponent } from "./components/header/header.component";
import { EditCriteriaModalComponent } from "./components/edit-criteria-modal/edit-criteria-modal.component";
import { ValuationModalComponent } from "./components/valuation-modal/valuation-modal.component";
import { GoogleMapsModalComponent } from "./components/google-maps-modal/google-maps-modal.component";
import { AgmCoreModule } from "@agm/core";
import { CloseBookingsComponent } from "app/platform/pages/close-bookings/close-bookings.component";
import { HotelOptionComponent } from "app/platform/components/hotel-option/hotel-option.component";
import { BookingDetailComponent } from "./components/booking-detail/booking-detail.component";
import { RsModalComponent } from "./components/rs-modal/rs-modal.component";
import { RqModalComponent } from "./components/rq-modal/rq-modal.component";
import { JoinPipe } from "./pipes/join.pipe";
import { CancelPolicyPipe } from "./pipes/cancel-policy.pipe";
import { CapitalizePipe } from "./pipes/capitalize.pipe";
import { PackagePipe } from "./pipes/package.pipe";
import { MainPenaltyPipe } from "./pipes/main-penalty.pipe";
import { CancelPolicyModalComponent } from "./components/cancel-policy-modal/cancel-policy-modal.component";
import { GetMaxPipe } from "./pipes/get-max.pipe";
import { MarketValidatorDirective } from "./directives/market-validator.directive";
import { MealplanPipe } from "./pipes/mealplan.pipe";
import { BindingModalComponent } from "./components/binding-modal/binding-modal.component";
import { CarouselModalComponent } from "./components/carousel-modal/carousel-modal/carousel-modal.component";
import { MultiSelectModule } from "primeng/multiselect";
import { MyBookingsComponent } from "./pages/my-bookings/my-bookings.component";
import { SupplierAccessesComponent } from "app/platform/components/supplier-accesses/supplier-accesses.component";

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    TagInputModule,
    NgxPaginationModule,
    AgmCoreModule,
    MultiSelectModule
  ],
  declarations: [
    AvailabilityComponent,
    BookingsComponent,
    CloseBookingsComponent,
    HeaderComponent,
    MyBookingsComponent,
    ResultBookingsComponent,
    SearchBookingsComponent,
    EditCriteriaModalComponent,
    ValuationModalComponent,
    GoogleMapsModalComponent,
    HotelOptionComponent,
    BookingDetailComponent,
    RsModalComponent,
    RqModalComponent,
    JoinPipe,
    CancelPolicyPipe,
    CapitalizePipe,
    PackagePipe,
    MainPenaltyPipe,
    CancelPolicyModalComponent,
    GetMaxPipe,
    MarketValidatorDirective,
    MealplanPipe,
    BindingModalComponent,
    CarouselModalComponent,
    SupplierAccessesComponent
  ],
  entryComponents: [
    EditCriteriaModalComponent,
    ValuationModalComponent,
    GoogleMapsModalComponent,
    RsModalComponent,
    RqModalComponent,
    CancelPolicyModalComponent,
    BindingModalComponent,
    CarouselModalComponent
  ],
  providers: [LoginGuard]
})
export class PlatformModule {}
