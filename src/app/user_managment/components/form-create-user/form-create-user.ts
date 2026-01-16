import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../classes/user/user';
import { UserApi } from '../../services/userApi/user-api';
import { UserRecap } from '../user-recap/user-recap';

import { AbstractControl, ValidationErrors } from '@angular/forms';



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
  // // isEditMode : boolean = false
  
  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, strictEmailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), strictPasswordValidator]),
    role: new FormControl('user', [Validators.required])
  });


  constructor
  (
    private userApi : UserApi,
    private route : ActivatedRoute,
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
    if (!this.loading)
    {

      this.loading = true;
      this.user = Object.assign(new User(), this.userForm.value)
      
      this.userApi.postUser(this.user).subscribe({
        next: (response) => {
          console.log('User created:', response);
          this.submitted = true;
          this.cdr.detectChanges(); // détection des changements pour que submitted mette à jour l'affichage
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.loading = false;
        }
      });
    }
  }







  
  cancel() 
  {
    this.router.navigate(['/']);
  }
}
