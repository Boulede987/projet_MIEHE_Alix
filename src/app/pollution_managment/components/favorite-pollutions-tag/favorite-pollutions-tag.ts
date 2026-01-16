import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FavoritePollutionsState } from '../../pollution-store/states/favorite-pollutions.state';

@Component({
  selector: 'app-favorite-pollutions-tag',
  imports: [],
  templateUrl: './favorite-pollutions-tag.html',
  styleUrl: './favorite-pollutions-tag.scss'
})
export class FavoritePollutionsTag {
  private store = inject(Store);

  favoritesCount = this.store.selectSignal(FavoritePollutionsState.count);
}
