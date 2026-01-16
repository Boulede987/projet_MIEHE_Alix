import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../authentification-store/states/auth.state';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): boolean {
    const isAdmin = this.store.selectSnapshot(AuthState.isAdmin);
    if (!isAdmin) {
      // redirect to home or dashboard
      this.router.navigate(['/']); 
      return false;
    }
    return true;
  }
}
