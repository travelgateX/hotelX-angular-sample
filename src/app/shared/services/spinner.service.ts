import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Handles a spinner behavior
 */
@Injectable()
export class SpinnerService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor() {}

  /**
   * Set loading
   * @param loading boolean
   */
  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  /**
   * Get loading
   */
  getLoading() {
    return this.loading.value;
  }

  /**
   * Start spinner
   */
  start() {
    this.loading.next(true);
  }

  /**
   * Stop spinner
   */
  stop() {
    this.loading.next(false);
  }
}
