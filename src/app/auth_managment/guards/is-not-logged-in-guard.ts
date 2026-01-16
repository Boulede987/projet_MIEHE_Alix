import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../authentification-store/states/auth.state';

@Injectable({ providedIn: 'root' })
export class IsNotLoggedInGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isConnected = await firstValueFrom(
      this.store.select(AuthState.isConnected)
    );
    if (isConnected) {
      this.router.navigate(['/acceuil']);
      return false;
    }
    return true;
  }
}
