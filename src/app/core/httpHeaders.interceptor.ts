import { OperationsToStore } from './utils/operationsToStore';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { RequestStorageService } from '../shared/services/request-storage.service';
import { flow, get, includes } from 'lodash/fp';
import { ConfigService } from '@ngx-config/core';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  constructor(private readonly injector: Injector, private requestStorageService: RequestStorageService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url === environment.configUrl) {
      return next.handle(req);
    }

    const config = this.injector.get(ConfigService);
    const apiKey = config.getSettings<string>()['apiKey'];

    const headers = new HttpHeaders({
      Authorization: !apiKey
        ? `Bearer ${localStorage.getItem('token')}`
        : `Apikey ${apiKey}`,
      'Content-Type': 'application/json'
    });

    const cloneReq = req.clone({ headers });
    const requestToStore = {
      ...(!apiKey
        ? { bearer: `Bearer ${localStorage.getItem('token')}` }
        : { Authorization: `Apikey ${apiKey}` }),
      rq: cloneReq
    };

    const hasOperation = flow(
      get('body.operationName'),
      cur => includes(cur)(OperationsToStore)
    )(requestToStore.rq);

    if (hasOperation) {
      this.requestStorageService.storeRequestResponse(requestToStore, false);
    }

    return next.handle(cloneReq);
  }
}
