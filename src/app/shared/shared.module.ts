import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { LangUrlPipe } from './pipes/lang-url.pipe';
import { LangSelectComponent } from './components/lang-select/lang-select.component';
import { ResultPipe } from './pipes/result.pipe';
import { DestinationPipe } from './pipes/destination.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StarComponent } from './components/star/star.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ScrollDirective } from './directives/scroll.directive';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { AmenitiesComponent } from './components/amenities/amenities/amenities.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencySelectorComponent } from 'app/shared/components/selectors/currency-selector/currency-selector.component';
import { CurrencySelectorService } from './components/selectors/currency-selector/currency-selector.service';
import { LanguageSelectorComponent } from './components/selectors/language-selector/language-selector.component';
import { LanguageSelectorService } from 'app/shared/components/selectors/language-selector/language-selector.service';
import { ClipboardPipe } from './pipes/clipboard.pipe';
import { SimpleAlertComponent } from 'app/shared/components/simple-alert/simple-alert.component';
import { MarketSelectorComponent } from './components/selectors/market-selector/market-selector.component';
import { MarketSelectorService } from 'app/shared/components/selectors/market-selector/market-selector.service';
import { AlertService } from './services/alert.service';
import { NotificationService } from './services/notification.service';
import { RequestStorageService } from './services/request-storage.service';
import { SpinnerService } from './services/spinner.service';
import { RsModalComponent } from './components/rs-modal/rs-modal.component';
import { RqModalComponent } from './components/rq-modal/rq-modal.component';
import { ClientSelectorComponent } from './components/selectors/client-selector/client-selector.component';
import { ClientSelectorService } from './components/selectors/client-selector/client-selector.service';
import { AlertDropdownComponent } from './components/alert-dropdown/alert-dropdown.component';
import { SearchGlobalComponent } from './components/search-global/search-global.component';
import { StatusPipe } from './pipes/status.pipe';
import { IndexedDbService } from './services/indexed-db.service';
import { OrganizationSelectorComponent } from './components/selectors/organization-selector/organization-selector.component';
import { OrganizationSelectorService } from './components/selectors/organization-selector/organization-selector.service';
import { HighlightPipe } from './pipes/highlight.pipe';

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
  providers: [
    CurrencySelectorService,
    LanguageSelectorService,
    MarketSelectorService,
    ClientSelectorService,
    AlertService,
    NotificationService,
    RequestStorageService,
    SpinnerService,
    IndexedDbService,
    OrganizationSelectorService
  ],
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
    LanguageSelectorComponent,
    SimpleAlertComponent,
    MarketSelectorComponent,
    RsModalComponent,
    RqModalComponent,
    ClientSelectorComponent,
    AlertDropdownComponent,
    SearchGlobalComponent,
    StatusPipe,
    OrganizationSelectorComponent,
    HighlightPipe
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
    LanguageSelectorComponent,
    MarketSelectorComponent,
    SimpleAlertComponent,
    RsModalComponent,
    RqModalComponent,
    ClientSelectorComponent,
    AlertDropdownComponent,
    SearchGlobalComponent,
    StatusPipe,
    OrganizationSelectorComponent
  ]
})
export class SharedModule {}
