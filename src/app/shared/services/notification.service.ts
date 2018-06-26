import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { IError } from 'app/core/interfaces/error';
import { IWarning } from 'app/core/interfaces/warning';
import { NotificationType } from '../../core/interfaces/notification-type.enum';

/**
 * Implements Toasty methods for notifications in the SPA
 */
@Injectable()
export class NotificationService {
  toastrConfig: IndividualConfig;
  /**
   * Init default toasty configuration
   * @param toastyService toasty service
   * @param toastyConfig toasty basic configuration
   */
  constructor(
    private toastr: ToastrService,
  ) {
    this.toastrConfig = <IndividualConfig> {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true
    }
  }

  /**
   * Create an info toasty
   * @param title title
   * @param message message
   */
  info(message: string, title: string = 'INFO') {
    this.toastr.info(message, title, this.toastrConfig);
  }

  /**
   * Create a success toasty
   * @param title title
   * @param message message
   */
  success(message: string, title: string = 'SUCCESS') {
    this.toastr.success(message, title, this.toastrConfig);
  }

  /**
   * Create an error toasty
   * @param title title
   * @param message message
   */
  error(message: string, title: string = 'ERROR') {
    this.toastr.error(message, title, this.toastrConfig);
  }

  /**
   * Create a warning toasty
   * @param title title
   * @param message message
   */
  warning(message: string, title: string = 'WARNING') {
    this.toastr.warning(message, title, this.toastrConfig);
  }

  /**
   * Create a show toasty
   * @param title title
   * @param message message
   */
  show(message: string, title: string = 'SHOW') {
    this.toastr.show(message, title, this.toastrConfig);
  }

  /**
   * Create a custom mtoasty
   * @param title title
   * @param msg message
   * @param type notification type
   */
  toast(title: string, message: string, type: NotificationType) {
    switch (type) {
      case NotificationType.INFO:
        this.toastr.info(message, title, this.toastrConfig);
        break;
      case NotificationType.SUCCESS:
        this.toastr.success(message, title, this.toastrConfig);
        break;
      case NotificationType.SHOW:
        this.toastr.show(message, title, this.toastrConfig);
        break;
      case NotificationType.ERROR:
        this.toastr.error(message, title, this.toastrConfig);
        break;
      case NotificationType.WARNING:
        this.toastr.warning(message, title, this.toastrConfig);
        break;
    }
  }

  /**
   * Handles GraphQL errors
   * @param errors list of errors from the response
   */
  handleIError(errors: IError[]) {
    const arrayErrors = errors
      .map(error => {
        return error.description;
      })
      .join(', ');

    this.error(arrayErrors);
  }

  /**
   * Handles GraphQL warnings
   * @param warnings list of warnings from the response
   */
  handlIWarning(warnings: IWarning[]) {
    const arrayWarnings = warnings
      .map(warning => {
        return warning.description;
      })
      .join(', ');

    this.warning(arrayWarnings);
  }

  /**
    * Handle error without knowing error type
    * @param error error object
    */
  handleError(error): void {
    if (error instanceof Response) {
      this.error(error.statusText);
    } else if (typeof error === 'string') {
      this.error(error.toString());
    } else if (error instanceof TypeError) {
      this.error(error.message);
    } else if (
      error.hasOwnProperty('code') &&
      error.hasOwnProperty('description')
    ) {
      this.toast(`Error ${error.code}!`, error.description, 4);
    } else {
      console.log(error, error.constructor.name, Object.keys(error));
    }
  }
}
