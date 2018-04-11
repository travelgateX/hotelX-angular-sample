import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { storeRequest } from 'app/shared/utilities/functions';
import { RequestStorageService } from 'app/core/services/request-storage.service';
import { Injectable } from '@angular/core';

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

    this.requestStorageService.storeRequest(req);

    const cloneReq = req.clone({ headers });

    return next.handle(cloneReq);
  }
}
