import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private tokenKey = 'authToken';

  constructor() {
    this.token = localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  getToken(): string | null {
    this.token = localStorage.getItem(this.tokenKey);
    return JSON.parse(this.token + '')?.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  logout() {
    this.clearToken();
  }
}
