export type UserRole = 'admin' | 'moderator' | 'user'


export class User {
  id: number = 0;
  username: string = '';
  email: string = '';
  password?: string; // optional for sending only on creation/update
  role: UserRole = 'user';
}
