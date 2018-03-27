import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

export class HttpHeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });

    const cloneReq = req.clone({ headers });

    return next.handle(cloneReq);
  }
}
