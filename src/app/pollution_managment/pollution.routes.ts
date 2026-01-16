import { Routes } from '@angular/router';
import { ListPollutions } from './components/list-pollutions/list-pollutions';
import { FormDelcarationPollution } from './components/form-delcaration-pollution/form-delcaration-pollution';
import { ListFavoritePollutions } from './components/list-favorite-pollutions/list-favorite-pollutions';

import { IsLoggedInGuard } from '../auth_managment/guards/is-logged-in-guard';

export const POLLUTION_ROUTES: Routes = [
    { path: 'create', component: FormDelcarationPollution, canActivate: [IsLoggedInGuard] },
    { path: 'list', component: ListPollutions },
    { path: 'edit/:id', component: FormDelcarationPollution, canActivate: [IsLoggedInGuard] },
    { path: 'favorites', component: ListFavoritePollutions, canActivate: [IsLoggedInGuard] }
];