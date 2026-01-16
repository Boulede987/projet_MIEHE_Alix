import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth_managment/services/auth-service/auth-service';
import { AuthDeconnexion } from '../auth_managment/authentification-store/actions/auth.action';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {

  private store = inject(Store);

  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const token = this.auth.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      tap({
        next: (evt: HttpEvent<unknown>) => {
          if (evt instanceof HttpResponse) {
            const authHeader = evt.headers.get('Authorization');

            if (authHeader?.startsWith('Bearer ')) {
              const jwt = authHeader.slice(7);
              this.auth.setToken(jwt);
              console.log('JWT captured:', jwt);
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            console.warn('Unauthorized - clearing token and logging out');
            this.auth.clearToken();
            this.store.dispatch(new AuthDeconnexion());
          }
        },
      })
    );
  }
}
