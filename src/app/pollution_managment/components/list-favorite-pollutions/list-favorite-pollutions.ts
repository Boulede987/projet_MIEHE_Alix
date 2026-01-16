import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { PollutionAPI } from '../../services/pollution-api';
import { PollutionRecap } from '../pollution-recap/pollution-recap';

import { FavoritePollutionsState } from '../../pollution-store/states/favorite-pollutions.state';
import { RemoveFavoritePollution } from '../../pollution-store/actions/favorite-pollution.action';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-list-favorite-pollutions',
  imports: [AsyncPipe, PollutionRecap],
  templateUrl: './list-favorite-pollutions.html',
  styleUrl: './list-favorite-pollutions.scss'
})
export class ListFavoritePollutions {
  
  private store = inject(Store);
  private pollutionApi = inject(PollutionAPI);

  favorites = this.store.selectSignal(FavoritePollutionsState.items);

  favoritePollutions$ = 
    this.favorites().length ? this.pollutionApi.getPollutions().pipe(
        map(polls => polls.filter(p => this.favorites().includes(p.id)))
      )
    : of([]);

  toggleFavorite(id: number) {
    this.store.dispatch(new RemoveFavoritePollution(id));
  }

}
