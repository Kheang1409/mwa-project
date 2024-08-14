import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class User {
  #_id!: string;
  #name!: string;
  #username!: string;
  #password!: string;

  get _id(): string {
    return this.#_id;
  }
  get name(): string {
    return this.#name;
  }
  get username(): string {
    return this.#username;
  }
  get password(): string {
    return this.#password;
  }
  constructor(id: string, name: string, username: string, password: string) {
    this.#_id = id;
    this.#name = name;
    this.#username = username;
    this.#password = password
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  private _baseUrl = "http://localhost:3000/api";

  constructor(private _httpClient: HttpClient) { }
  getUsers(): Observable<User[]> {
    const url: string = this._baseUrl + "/users";
    return this._httpClient.get<User[]>(url);
  }
  getToken(user: User): Observable<string> {
    const url: string = this._baseUrl + "/users/login";
    const body = {
      username: user.username,
      password: user.password,
    };
    return this._httpClient.post<string>(url, body);
  }
}
