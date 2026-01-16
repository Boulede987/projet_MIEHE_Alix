import { Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith, switchMap, shareReplay } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { User } from '../../classes/user/user';
import { UserApi } from '../../services/userApi/user-api';
import { UserRecap } from '../user-recap/user-recap';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [AsyncPipe, UserRecap, ReactiveFormsModule],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss',
})
export class ListUsers {

  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly showForm = false;

  readonly searchFilter = new FormControl<string>('', { nonNullable: true });
  readonly typeFilter = new FormControl<string>('', { nonNullable: true });

  private readonly refreshTrigger$ = new Subject<void>();

  readonly users$: Observable<User[]> = this.createUsersStream();
  readonly filteredUsers$: Observable<User[]> = this.createFilteredUsersStream();

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }

  private createUsersStream(): Observable<User[]> {
    return this.refreshTrigger$.pipe(
      startWith(void 0),
      switchMap(() => this.userApi.getUsers()),
      shareReplay({ bufferSize: 1, refCount: true }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private createFilteredUsersStream(): Observable<User[]> {
    return combineLatest([
      this.users$,
      this.searchFilter.valueChanges.pipe(startWith(this.searchFilter.value)),
      this.typeFilter.valueChanges.pipe(startWith(this.typeFilter.value)),
    ]).pipe(
      map(([users, searchTerm]) => this.filterUsers(users, searchTerm)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private filterUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm) {
      return users;
    }

    const normalized = searchTerm.toLowerCase();

    return users.filter(user =>
      this.matchesSearch(user, normalized)
    );
  }

  private matchesSearch(user: User, search: string): boolean {
    return (
      user.username?.toLowerCase().includes(search) === true ||
      user.email?.toLowerCase().includes(search) === true
    );
  }
}
