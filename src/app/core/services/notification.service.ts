import { NotificationType } from './../interfaces/notification-type.enum';
import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { IError } from 'app/core/interfaces/error';
import { IWarning } from 'app/core/interfaces/warning';

/**
 * Implements Toasty methods for notifications in the SPA
 */
@Injectable()
export class NotificationService {
  /**
   * Init default toasty configuration
   * @param toastyService toasty service
   * @param toastyConfig toasty basic configuration
   */
  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig
  ) {
    this.toastyConfig.position = 'bottom-right';
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.showClose = true;
    this.toastyConfig.timeout = 3000;
  }

  /**
   * Create a default toasty
   * @param title title
   * @param message message
   */
  default(message: string, title: string = 'DEFAULT') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.default(toastOptions);
  }

  /**
   * Create an info toasty
   * @param title title
   * @param message message
   */
  info(message: string, title: string = 'INFO') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.info(toastOptions);
  }

  /**
   * Create a success toasty
   * @param title title
   * @param message message
   */
  success(message: string, title: string = 'SUCCESS') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.success(toastOptions);
  }

  /**
   * Create a wait toasty
   * @param title title
   * @param message message
   */
  wait(message: string, title: string = 'WAIT') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.wait(toastOptions);
  }

  /**
   * Create an error toasty
   * @param title title
   * @param message message
   */
  error(message: string, title: string = 'ERROR') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.error(toastOptions);
  }

  /**
   * Create a warning toasty
   * @param title title
   * @param message message
   */
  warning(message: string, title: string = 'WARNING') {
    const toastOptions = {
      title: title,
      msg: message,
    };
    this.toastyService.warning(toastOptions);
  }

  /**
   * Create a custom mtoasty
   * @param title title
   * @param msg message
   * @param type notification type
   */
  toast(title: string, msg: string, type: NotificationType) {
    const toastOptions = {
      title: title,
      msg: msg,
    };

    switch (type) {
      case NotificationType.DEFAULT:
        this.toastyService.default(toastOptions);
        break;
      case NotificationType.INFO:
        this.toastyService.info(toastOptions);
        break;
      case NotificationType.SUCCESS:
        this.toastyService.success(toastOptions);
        break;
      case NotificationType.WAIT:
        this.toastyService.wait(toastOptions);
        break;
      case NotificationType.ERROR:
        this.toastyService.error(toastOptions);
        break;
      case NotificationType.WARNING:
        this.toastyService.warning(toastOptions);
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
