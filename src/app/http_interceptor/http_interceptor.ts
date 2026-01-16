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

  private readonly store = inject(Store);

  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const requestWithToken = this.attachToken(req);

    return next.handle(requestWithToken).pipe(
      tap({
        next: (evt: HttpEvent<unknown>) => this.handleResponse(evt),
        error: (err: HttpErrorResponse) => this.handleError(err),
      })
    );
  }

  private attachToken(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.auth.getToken();

    if (!token) return req;

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleResponse(evt: HttpEvent<unknown>): void {
    if (!(evt instanceof HttpResponse)) return;

    const authHeader = evt.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) return;

    const jwt = authHeader.slice(7);
    this.auth.setToken(jwt);
    console.log('JWT captured:', jwt);
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status !== 401) return;

    console.warn('Unauthorized - clearing token and logging out');
    this.auth.clearToken();
    this.store.dispatch(new AuthDeconnexion());
  }
}
