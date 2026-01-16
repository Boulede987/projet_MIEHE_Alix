import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../auth_managment/authentification-store/states/auth.state';

@Injectable({ providedIn: 'root' })
export class CreateUserAccessGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isConnected = this.store.selectSnapshot(AuthState.isConnected);
    const isAdmin = this.store.selectSnapshot(AuthState.isAdmin);

    if (!isConnected || isAdmin) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
