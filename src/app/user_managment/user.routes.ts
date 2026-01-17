import { Routes } from '@angular/router';
import { FormCreateUser } from './components/form-create-user/form-create-user';
import { FormUserLogin } from './components/form-user-login/form-user-login';
import { ListUsers } from './components/list-users/list-users';
import { IsNotLoggedInGuard } from '../auth_managment/guards/is-not-logged-in-guard';
import { IsAdminGuard } from '../auth_managment/guards/is-admin-guard';
import { CreateUserAccessGuard } from './guards/create-user-access-guard';

export const USER_ROUTES: Routes = [
    { path: 'create', component: FormCreateUser, canActivate: [CreateUserAccessGuard] },
    { path: 'login', component: FormUserLogin, canActivate: [IsNotLoggedInGuard] },
    { path: 'list', component: ListUsers, canActivate: [IsAdminGuard] }
];

