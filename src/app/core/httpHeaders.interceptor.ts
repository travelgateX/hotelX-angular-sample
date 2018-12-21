import { OperationsToStore } from './utils/operationsToStore';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const requestToStore = {
      bearer: 'Bearer ' + localStorage.getItem('token'),
      rq: cloneReq
    };
    if (OperationsToStore.includes(requestToStore.rq.body.operationName)) {
      this.requestStorageService.storeRequestResponse(requestToStore, false);
    }
    return next.handle(cloneReq);
  }
}
