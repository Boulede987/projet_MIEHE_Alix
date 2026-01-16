import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthConnexion } from '../actions/auth.action';
import { AuthDeconnexion } from '../actions/auth.action';
import { AuthStateModel } from '../models/auth-state.model';
import { User } from '../../../user_managment/classes/user/user';
import { AuthService } from '../../services/auth-service/auth-service';


@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    connexion: false,
    user: null
  },
})
@Injectable()
export class AuthState {

  constructor(private authService: AuthService) {}

 @Selector()
  static isConnected(state: AuthStateModel): boolean {
    return state?.connexion ?? false;
  }

  @Selector()
  static isAdmin(state: AuthStateModel): boolean {
    return state?.user?.role === 'admin';
  }

  @Selector()
  static getUser(state: AuthStateModel): User | null {
    return state?.user ?? null;
  }

  @Action(AuthConnexion)
  login(
    { patchState, getState }: StateContext<AuthStateModel>,
    { payload }: AuthConnexion
  ) {
    console.log('🔴 AuthConnexion action RECEIVED');
    console.log('🔴 Payload:', payload);
    console.log('🔴 State BEFORE patch:', getState());
    
    patchState({
      connexion: payload.connexion,
      user: payload.user
    });
    
    console.log('🔴 State AFTER patch:', getState());
  }



  @Action(AuthDeconnexion)
  logout({ patchState }: StateContext<AuthStateModel>) {
    console.log('🔴 AuthDeconnexion action RECEIVED');
    this.authService.clearToken();
    patchState({ 
      connexion: false,
      user: null 
    });
    console.log('🔴 User logged out, state cleared');
  }
}
