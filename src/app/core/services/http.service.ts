
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * HTTP middleware which implements Auth0
 */
@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  /**
   * Executes a POST request
   * @param url URL
   * @param body Object request
   */
  post(url: string, body: Object): Observable<any> {
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /**
   * Executes a DELETE request
   * @param url URL
   */
  delete(url: string, options?: any): Observable<any> {
    return this.http.delete(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Executes a GET request
   * @param url URL
   * @param body Object request
   */
  get(url: string, options?: any): Observable<any> {
    return this.http.get(url, options);
  }

  /**
   * Executes a PUT request
   * @param url URL
   * @param body Object request
   */
  put(url: string, body?: Object): Observable<any> {
    return this.http.put(url, body).pipe(catchError(this.handleError));
  }

  /**
   * Returns the statusText or the message of a error response
   * @param e Error
   */
  private handleError(e) {
    let errMsg: string;
    if (e instanceof Response) {
      errMsg = e.statusText;
    } else {
      errMsg = e.message ? e.message : e.toString();
    }
    return observableThrowError(errMsg);
  }
}
