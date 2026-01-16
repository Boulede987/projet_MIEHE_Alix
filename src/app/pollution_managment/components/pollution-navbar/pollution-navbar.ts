import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FavoritePollutionsTag } from '../favorite-pollutions-tag/favorite-pollutions-tag';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { Auth } from '../../../auth_managment/authentification-store/models/auth.model';

@Component({
  selector: 'app-pollution-navbar',
  imports: [AsyncPipe, RouterModule, FavoritePollutionsTag], // nécessaire pour la naviguation via router
  templateUrl: './pollution-navbar.html',
  styleUrl: './pollution-navbar.scss'
})
export class PollutionNavbar {

  private store = inject(Store);

  isConnected$: Observable<boolean> = this.store.select(AuthState.isConnected);
  isAdmin$: Observable<boolean> = this.store.select(AuthState.isAdmin);

}
