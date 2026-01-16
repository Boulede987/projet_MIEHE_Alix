import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  imports: [ReactiveFormsModule, UserRecap],
  templateUrl: './form-create-user.html',
  styleUrl: './form-create-user.scss'
})
export class FormCreateUser implements OnInit
{
  user ? : User

  submitted : boolean = false
  loading : boolean = false

  
  readonly userRoles = USER_ROLES;
  
  readonly userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, strictEmailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), strictPasswordValidator]),
    role: new FormControl('user', [Validators.required])
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

  private submitCreate(user: User) {
    this.userApi.postUser(user).subscribe({
      next: (response) => {
        console.log('User created:', response);
        this.submitted = true;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.loading = false;
      }
    });
  }







  
  cancel() 
  {
    this.router.navigate(['/']);
  }
}
