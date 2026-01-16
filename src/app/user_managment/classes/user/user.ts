import type { UserRole } from '../../constants/user-roles/user.role';

export class User {
  id: number = 0;
  username: string = '';
  email: string = '';
  password?: string;
  role: UserRole = 'user';
}
