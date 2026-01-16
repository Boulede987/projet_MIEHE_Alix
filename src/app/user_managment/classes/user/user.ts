import type { UserRole } from '../../constants/user-roles/user.role';

export class User {
  id: number = 0;
  username: string = '';
  email: string = '';
  // optional for sending only on creation/update
  password?: string;
  role: UserRole = 'user';
}
