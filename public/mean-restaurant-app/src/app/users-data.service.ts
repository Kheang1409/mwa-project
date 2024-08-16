import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from './user';
import { Token } from './token';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  private _baseUrl = environment.urlApi.baseUserUrl;

  constructor(private _httpClient: HttpClient) { }
  getUsers(): Observable<User[]> {
    const url: string = this._baseUrl;
    return this._httpClient.get<User[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  getToken(user: User): Observable<Token> {
    const url: string = this._baseUrl + environment.urlShared.login;
    return this._httpClient.post<Token>(url, user.jsonify()).pipe(
      catchError(this.handleError)
    );
  }
  createUser(user: User): Observable<User> {
    const url: string = this._baseUrl;
    return this._httpClient.post<User>(url, user.jsonifyCreate()).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError({ message: error.error.message });
  }
}
