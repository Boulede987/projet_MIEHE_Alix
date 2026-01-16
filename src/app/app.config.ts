import { 
  ApplicationConfig, 
  importProvidersFrom, 
  provideBrowserGlobalErrorListeners, 
  provideZonelessChangeDetection 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { 
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS, 
} from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { routes } from './app.routes';

import { FavoritePollutionsState } from './pollution_managment/pollution-store/states/favorite-pollutions.state';
import {ApiHttpInterceptor} from './http_interceptor/http_interceptor';
import { AuthState } from './auth_managment/authentification-store/states/auth.state';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
    NgxsModule.forRoot([FavoritePollutionsState, AuthState]),
    NgxsStoragePluginModule.forRoot({
      keys: ['favoritePollutions']
    })
  ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ApiHttpInterceptor, multi: true },
  ]
};
