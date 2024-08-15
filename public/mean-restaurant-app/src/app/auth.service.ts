import { Injectable } from '@angular/core';
import { Token } from './token';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  #token!: Token | null;

  get token() {
    return this.#token;
  }
  set token(token: Token | null) {
    this.#token = token;
  }

  private tokenKey = 'authToken';

  setToken(token: Token) {
    this.#token = token;
    localStorage.setItem(this.tokenKey, token.token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  logout() {
    this.clearToken();
  }
}
