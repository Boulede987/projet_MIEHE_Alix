import { Routes } from '@angular/router';
import { Acceuil } from './components/acceuil/acceuil';

export const routes: Routes = [
    { path: '', redirectTo: '/acceuil', pathMatch: 'full' },  // ← Redirection depuis "/"
    { path: 'acceuil', component: Acceuil },
    {
        path: 'pollution',
        loadChildren: () => // lazy loading
            import('./pollution_managment/pollution.routes').then(
            (r) => r.POLLUTION_ROUTES
            ),
    },
    {
        path: 'user',
        loadChildren: () => // lazy loading
            import('./user_managment/user.routes').then(
            (r) => r.USER_ROUTES
            ),
    },
];
