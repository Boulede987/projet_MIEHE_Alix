
import { Auth } from './auth.model';
import { User } from '../../../user_managment/classes/user/user';

export interface AuthStateModel {
  connexion: boolean;
  user: User | null;
}
