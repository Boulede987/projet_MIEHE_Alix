import { Auth } from "../models/auth.model";
import { User } from "../../../user_managment/classes/user/user";

export class AuthConnexion {
  static readonly type = '[Auth] Connexion';
  constructor(public payload: { connexion: boolean; user?: User }) {}
}

export class AuthDeconnexion {
  static readonly type = '[Auth] Deconnexion';
}