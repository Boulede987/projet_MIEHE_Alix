import { State, Action, StateContext, Selector } from '@ngxs/store';
import { FavoritePollutionsStateModel } from '../models/pollution-favorite-state.model';
import { AddFavoritePollution, RemoveFavoritePollution, ClearFavoritePollutions } from '../actions/favorite-pollution.action';


@State<FavoritePollutionsStateModel>({
  name: 'favoritePollutions',
  defaults: {
    items: []
  }
})
export class FavoritePollutionsState {

  /* SELECTORS */
  @Selector()
  static items(state: FavoritePollutionsStateModel) {
    return state.items;
  }

  @Selector()
  static count(state: FavoritePollutionsStateModel) {
    return state.items.length;
  }

  @Selector()
  static isFavorite(state: FavoritePollutionsStateModel) {
    return (id: number) => state.items.includes(id);
  }

  /* ACTIONS */
  @Action(AddFavoritePollution)
  add({ getState, patchState }: StateContext<FavoritePollutionsStateModel>, { pollutionId }: AddFavoritePollution) {
    const state = getState();
    if (!state.items.includes(pollutionId)) {
      patchState({ items: [...state.items, pollutionId] });
    }
  }

  @Action(RemoveFavoritePollution)
  remove({ getState, patchState }: StateContext<FavoritePollutionsStateModel>, { pollutionId }: RemoveFavoritePollution) {
    patchState({
      items: getState().items.filter(id => id !== pollutionId)
    });
  }

  @Action(ClearFavoritePollutions)
  clear({ setState }: StateContext<FavoritePollutionsStateModel>) {
    setState({ items: [] });
  }
}
