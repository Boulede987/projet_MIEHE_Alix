import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; 
import { Observable, combineLatest, map, startWith, Subject, switchMap, merge, debounceTime, distinctUntilChanged } from 'rxjs';
import { Store } from '@ngxs/store';

import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { PollutionAPI } from '../../services/pollution-api';
import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';

import { FavoritePollutionsState } from '../../pollution-store/states/favorite-pollutions.state';
import { AddFavoritePollution, RemoveFavoritePollution } from '../../pollution-store/actions/favorite-pollution.action';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { POLLUTION_TYPES, PollutionType } from '../../classes/submittedPollution/submitted-pollution';

@Component({
  selector: 'app-list-pollutions',
  imports: [AsyncPipe, PollutionRecap, ReactiveFormsModule],
  templateUrl: './list-pollutions.html',
  styleUrl: './list-pollutions.scss'
})
export class ListPollutions implements OnInit {

  private refreshTrigger$ = new Subject<void>();

  submittedPollutions$ ? : Observable<SubmittedPollution[]>
  filteredPollutions$ ! : Observable<SubmittedPollution[]>

  searchFilter = new FormControl('')
  typeFilter = new FormControl('')
  readonly pollutionTypes = POLLUTION_TYPES;

  private readonly store = inject(Store);

  readonly favorites = this.store.selectSignal(FavoritePollutionsState.items);
  readonly isFavorite = this.store.selectSignal(FavoritePollutionsState.isFavorite);
  readonly isConnected$: Observable<boolean> = this.store.select(AuthState.isConnected);
  constructor
  (
    private pollutionApi : PollutionAPI,
    private router: Router
  )
  {
    //
  }

  
  ngOnInit() 
  {
    this.loadPollutions()
  }



  onDelete(pollution: SubmittedPollution) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.pollutionApi.deletePollution(pollution).subscribe({
        next: (response) => {
          console.log('Pollution deleted:', response);
          this.refreshTrigger$.next(); 
        },
        error: (error) => {
          console.error('Error deleting pollution:', error);
        }
      });
    }
  }


  onEdit(pollution: SubmittedPollution) {
    this.router.navigate(['/pollution/edit', pollution.id]);
  }




  loadPollutions()
  {
    const filters$ = combineLatest([
      this.searchFilter.valueChanges.pipe(startWith('')),
      this.typeFilter.valueChanges.pipe(startWith(''))
    ])
    .pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1])
    );

    const trigger$ = merge(
      this.refreshTrigger$.pipe(map(() => ['', ''] as [string, string])),
      filters$
    ).pipe(startWith(['', '']));

    this.submittedPollutions$ = trigger$.pipe(
      switchMap(([search, type]) => this.pollutionApi.getPollutions(search ?? undefined, type ?? undefined))
    );

    this.filteredPollutions$ = this.submittedPollutions$;
  }




  
  toggleFavorite(id: number) {
    const isFav = this.isFavorite()(id);
    this.store.dispatch(
      isFav ? new RemoveFavoritePollution(id) : new AddFavoritePollution(id)
    );
  }




}
