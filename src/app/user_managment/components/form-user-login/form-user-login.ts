import { Component, inject, Signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthConnexion } from '../../../auth_managment/authentification-store/actions/auth.action';
import { Auth } from '../../../auth_managment/authentification-store/models/auth.model';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';

import { UserApi } from '../../services/userApi/user-api';

@Component({
  selector: 'app-form-user-login',
  imports: [ReactiveFormsModule],
  templateUrl: './form-user-login.html',
  styleUrl: './form-user-login.scss',
})
export class FormUserLogin {

  userForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });


  private store = inject(Store);

  connexion: Signal<Boolean> = toSignal(
    this.store.select(AuthState.isConnected),
    {
      initialValue: false,
    }
  );


constructor(private userApi: UserApi, private router: Router
  ) {
    //
  }



  onSubmit() {
    const { email, password } = this.userForm.getRawValue();

    this.userApi.userLogin(email, password).pipe(
      switchMap((response) => {
        console.log('API response received:', response);
        return this.store.dispatch(new AuthConnexion({
          connexion: true,
          user: response
        }));
      })
    ).subscribe({
      next: () => {
        console.log('Login successful, state updated');
        console.log('Current auth state:', this.store.selectSnapshot(AuthState.isConnected));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }


}
