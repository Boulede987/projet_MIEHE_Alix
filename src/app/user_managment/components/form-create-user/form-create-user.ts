import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { UserRole, USER_ROLES } from '../../constants/user-roles/user.role';
import { User } from '../../classes/user/user';
import { UserApi } from '../../services/userApi/user-api';
import { UserRecap } from '../user-recap/user-recap';

const ROUTES = {
  HOME: '/acceuil'
} as const;

const ERROR_MESSAGES = {
  UNAUTHORIZED_ROLE: 'Unauthorized role creation attempt'
} as const;

export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(control.value) ? null : { emailInvalid: true };
}

export function strictPasswordValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordRegex.test(control.value) ? null : { passwordInvalid: true };
}

@Component({
  selector: 'app-form-create-user',
  imports: [ReactiveFormsModule, UserRecap, AsyncPipe],
  templateUrl: './form-create-user.html',
  styleUrl: './form-create-user.scss'
})
export class FormCreateUser implements OnInit {
  user?: User;
  submitted = false;
  loading = false;
  
  private readonly store = inject(Store);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  
  readonly isAdmin$: Observable<boolean> = this.store.select(AuthState.isAdmin);
  
  readonly allowedRoles$: Observable<readonly UserRole[]> = this.isAdmin$.pipe(
    map(isAdmin => isAdmin ? USER_ROLES : (['user'] as const))
  );
  
  readonly userRoles = USER_ROLES;
  
  readonly userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, strictEmailValidator]),
    password: new FormControl('', [Validators.required, strictPasswordValidator]),
    role: new FormControl<UserRole>('user', Validators.required),
  });
  
  ngOnInit(): void {
    //
  }
  
  onSubmit(): void {
    if (this.loading || this.userForm.invalid) return;
    
    this.loading = true;
    const userData = this.prepareUserFromForm();
    this.user = userData;
    
    this.submitCreate(userData);
  }
  
  cancel(): void {
    this.navigateToHome();
  }
  
  private prepareUserFromForm(): User {
    return Object.assign(new User(), this.userForm.value);
  }
  
  private submitCreate(user: User): void {
    this.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (!this.isRoleAuthorized(user.role, isAdmin)) {
        this.handleUnauthorizedRole();
        return;
      }
      
      this.createUser(user);
    });
  }
  
  private isRoleAuthorized(role: UserRole, isAdmin: boolean): boolean {
    return isAdmin || role === 'user';
  }
  
  private handleUnauthorizedRole(): void {
    console.warn(ERROR_MESSAGES.UNAUTHORIZED_ROLE);
    this.loading = false;
  }
  
  private createUser(user: User): void {
    this.userApi.postUser(user).subscribe({
      next: () => this.handleCreateSuccess(),
      error: () => this.handleCreateError(),
    });
  }
  
  private handleCreateSuccess(): void {
    this.submitted = true;
    this.loading = false;
    
    setTimeout(() => this.navigateToHome(), 1500);
  }
  
  private handleCreateError(): void {
    this.loading = false;
  }
  
  private navigateToHome(): void {
    this.router.navigate([ROUTES.HOME]);
  }
}