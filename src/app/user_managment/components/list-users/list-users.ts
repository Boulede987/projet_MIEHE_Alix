import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; 
import { Observable, combineLatest, map, startWith, Subject, switchMap } from 'rxjs';

import { User } from '../../classes/user/user';
import { UserApi } from '../../services/userApi/user-api';
import { UserRecap } from '../user-recap/user-recap';

@Component({
  selector: 'app-list-users',
  imports: [AsyncPipe, UserRecap, ReactiveFormsModule],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss'
})
export class ListUsers {
  private refreshTrigger$ = new Subject<void>();

  users$ ? : Observable<User[]>
  filteredUsers$ ! : Observable<User[]>

  searchFilter = new FormControl('')
  typeFilter = new FormControl('')

  showForm : boolean = false // pour permette l'édition via formulaire

  constructor
  (
    private userApi : UserApi,
    private router: Router
  )
  {
    //
  }

  
  ngOnInit() 
  {

    this.loadUsers()

  }



  // onDelete(user: User) {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
  //     this.userApi.deleteUser(user).subscribe({
  //       next: (response) => {
  //         console.log('Pollution deleted:', response);
  //         // Rediriger ou rafraîchir la liste
  //         this.refreshTrigger$.next(); 
  //       },
  //       error: (error) => {
  //         console.error('Error deleting pollution:', error);
  //       }
  //     });
  //   }
  // }


  // onEdit(user: User) {
  //   this.router.navigate(['/user/edit', user.id]);
  // }




  loadUsers()
  {
    // this.submittedPollutions$ = this.pollutionApi.getPollutions()
    this.users$ = this.refreshTrigger$.pipe(
      startWith(undefined), // <- Charge au démarrage
      switchMap(() => this.userApi.getUsers()) // <- Recharge à chaque émission
    );

    // Combinaison du stream de données original aves les filters controls
    this.filteredUsers$ = 
    combineLatest
    (
      [
        this.users$,
        this.searchFilter.valueChanges.pipe(startWith('')),
        this.typeFilter.valueChanges.pipe(startWith(''))
      ]
    )
    .pipe
    (
      map( ( [users, searchTerm] ) => 
        {
          return users.filter( user => 
            {
              // filtrer selon le titre et la description
              const matchesSearch : boolean = 
              ( 
                !searchTerm // si on as pas de filtre
                || 
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) // si le nom de l'utilisateur correpsond
                ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) // si l'email de l'utilisateur correspond
              )
              
              return matchesSearch
            })
        }
      )
    );
  }

}