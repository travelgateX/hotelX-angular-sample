import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { RequestStorageService } from '../shared/services/request-storage.service';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  constructor(private requestStorageService: RequestStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });
    const cloneReq = req.clone({ headers });
    const requestToStore = {rq: cloneReq, headers: headers}
    this.requestStorageService.storeRequestResponse(requestToStore, false);
    return next.handle(cloneReq);
  }
}
