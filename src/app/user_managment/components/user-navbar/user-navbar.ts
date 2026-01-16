import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { AuthDeconnexion } from '../../../auth_managment/authentification-store/actions/auth.action';

@Component({
  selector: 'app-user-navbar',
  imports: [AsyncPipe, RouterModule],
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.scss'
})
export class UserNavbar {

  private store = inject(Store);
  private router = inject(Router);

  isConnected$: Observable<boolean> = this.store.select(AuthState.isConnected);
  isAdmin$: Observable<boolean> = this.store.select(AuthState.isAdmin);


  logout() {
    this.store.dispatch(new AuthDeconnexion()).subscribe({
      next: () => {
        console.log('User logged out');
        this.router.navigate(['/']);
      }
    });
  }
}
