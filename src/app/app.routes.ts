import { Routes } from '@angular/router';
import { Acceuil } from './components/acceuil/acceuil';

export const routes: Routes = [
    { path: '', redirectTo: '/acceuil', pathMatch: 'full' },
    { path: 'acceuil', component: Acceuil },
    {
        path: 'pollution',
        loadChildren: () => 
            import('./pollution_managment/pollution.routes').then(
            (r) => r.POLLUTION_ROUTES
            ),
    },
    {
        path: 'user',
        loadChildren: () => 
            import('./user_managment/user.routes').then(
            (r) => r.USER_ROUTES
            ),
    },
];
