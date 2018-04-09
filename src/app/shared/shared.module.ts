import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { LangUrlPipe } from "./pipes/lang-url.pipe";
import { LangSelectComponent } from "./components/lang-select/lang-select.component";
import { ResultPipe } from "./pipes/result.pipe";
import { DestinationPipe } from "./pipes/destination.pipe";
import { DateFormatPipe } from "./pipes/date-format.pipe";
import { FooterComponent } from "./components/footer/footer.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { StarComponent } from "./components/star/star.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { ScrollDirective } from "./directives/scroll.directive";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { CommonModule } from "@angular/common";
import { AmenitiesComponent } from "./components/amenities/amenities/amenities.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CurrencySelectorComponent } from "app/shared/components/selectors/currency-selector/currency-selector.component";
import { CurrencySelectorService } from "./components/selectors/currency-selector/currency-selector.service";
import { LanguageSelectorComponent } from './components/selectors/language-selector/language-selector.component';
import { LanguageSelectorService } from "app/shared/components/selectors/language-selector/language-selector.service";
import { ClipboardPipe } from './pipes/clipboard.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule
  ],
  providers: [CurrencySelectorService, LanguageSelectorService],
  declarations: [
    ScrollDirective,
    PaginationComponent,
    StarComponent,
    SpinnerComponent,
    FooterComponent,
    DateFormatPipe,
    DestinationPipe,
    ResultPipe,
    LangSelectComponent,
    LangUrlPipe,
    AmenitiesComponent,
    ClipboardPipe,
    CurrencySelectorComponent,
    LanguageSelectorComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ScrollDirective,
    PaginationComponent,
    StarComponent,
    SpinnerComponent,
    FooterComponent,
    DateFormatPipe,
    DestinationPipe,
    ResultPipe,
    LangSelectComponent,
    LangUrlPipe,
    AmenitiesComponent,
    ClipboardPipe,
    NgbModule,
    CurrencySelectorComponent,
    LanguageSelectorComponent
  ]
})
export class SharedModule {}
