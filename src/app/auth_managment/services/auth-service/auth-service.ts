import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token?: string;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | undefined {
    return this.token;
  }

  clearToken() {
    this.token = undefined;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

