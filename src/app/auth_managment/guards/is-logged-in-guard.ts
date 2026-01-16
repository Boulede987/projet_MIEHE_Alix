import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../authentification-store/states/auth.state';

@Injectable({ providedIn: 'root' })
export class IsLoggedInGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.store.selectSnapshot(AuthState.isConnected);
    if (!isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
