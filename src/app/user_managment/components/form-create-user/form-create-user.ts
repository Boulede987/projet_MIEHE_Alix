import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { UserRole } from '../../constants/user-roles/user.role';

import { User } from '../../classes/user/user';
import { UserApi } from '../../services/userApi/user-api';
import { UserRecap } from '../user-recap/user-recap';

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { USER_ROLES } from '../../constants/user-roles/user.role';



export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(control.value) ? null : { emailInvalid: true };
}

export function strictPasswordValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(control.value) ? null : { passwordInvalid: true };
}




@Component({
  selector: 'app-form-create-user',
  imports: [ReactiveFormsModule, UserRecap, AsyncPipe],
  templateUrl: './form-create-user.html',
  styleUrl: './form-create-user.scss'
})
export class FormCreateUser implements OnInit
{
  user ? : User

  submitted : boolean = false
  loading : boolean = false

  private readonly store = inject(Store);

  readonly isAdmin$: Observable<boolean> = this.store.select(AuthState.isAdmin);

    
readonly allowedRoles$: Observable<readonly UserRole[]> =
  this.isAdmin$.pipe(
    map(isAdmin =>
      isAdmin
        ? USER_ROLES
        : ['user']
    )
  );
  
  readonly userRoles = USER_ROLES;
  
  readonly userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, strictEmailValidator]),
    password: new FormControl('', [Validators.required, strictPasswordValidator]),
    role: new FormControl<UserRole>('user', Validators.required),
  });


  constructor
  (
    private userApi : UserApi,
    private router : Router,
    private cdr: ChangeDetectorRef
  ) 
  {
    //
  }


  ngOnInit() 
  { }


  onSubmit()
  {
    if (this.loading) return;
    this.loading = true;

    const prepared = this.prepareUserFromForm();
    this.user = prepared;
    this.submitCreate(prepared);
  }

  private prepareUserFromForm(): User {
    return Object.assign(new User(), this.userForm.value);
  }

  private submitCreate(user: User): void {
    this.isAdmin$.pipe(take(1)).subscribe(isAdmin => {

      if (!isAdmin && user.role !== 'user') {
        console.warn('Unauthorized role creation attempt');
        this.loading = false;
        return;
      }

      this.userApi.postUser(user).subscribe({
        next: response => {
          this.submitted = true;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    });
  }








  
  cancel() 
  {
    this.router.navigate(['/']);
  }
}
