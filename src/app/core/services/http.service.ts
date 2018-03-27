import { RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

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
    return this.http.post(url, body).catch(this.handleError);
  }

  /**
   * Executes a DELETE request
   * @param url URL
   */
  delete(url: string, options?: any): Observable<any> {
    return this.http.delete(url, options).catch(this.handleError);
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
    return this.http.put(url, body).catch(this.handleError);
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
    return Observable.throw(errMsg);
  }
}
