import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from 'app/core/services/spinner.service';
import { Observable } from 'rxjs/Observable';

/**
 * Spinner component for handling on loading
 * When is loading, some classes are added to the component and the effect is handled by css
 */
@Component({
  selector: 'b2b-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription[];
  loading: boolean;

  /**
   * Subscribe to Spinner Service and get loading variable
   * @param spinnerService SpinnerService
   */
  constructor(private spinnerService: SpinnerService) {}

  /**
   * Subscribe to spinner service
   */
  ngOnInit() {
    this.subscriptions$ = [];
    this.subscriptions$.push(
      this.spinnerService.loading$.subscribe(res => {
        this.loading = res;
      })
    );
  }

  /**
   * Unsubscribe from the spinner observable
   */
  ngOnDestroy() {
    this.subscriptions$.map(x => x.unsubscribe());
  }
}
