import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Dish, Restaurant } from './restaurant';
import { environment } from '../environments/environment.development';




@Injectable({
  providedIn: 'root'
})

export class RestaurantsDataService {

  private _baseUrl = environment.urlApi.baseRestaurantUrl;

  constructor(private _httpClient: HttpClient) { }

  getRestaurants(pageNumber: number, name: string | null): Observable<Restaurant[]> {
    let url: string = this._baseUrl
    if (pageNumber || (name && name !== ''))
      url = `${url}?`;
    if (pageNumber) {
      url = `${url}${environment.urlApi.query.pageNumber}=${pageNumber}`
    }
    if (name && name !== '') {
      if (pageNumber)
        url = `${url}&`
      url = `${url}${environment.urlApi.query.name}=${name}`
    }
    return this._httpClient.get<Restaurant[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  getRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.get<Restaurant>(url).pipe(
      catchError(this.handleError)
    );
  }
  getTotalRestaurants(name: string | null): Observable<number> {
    let url: string = `${this._baseUrl}/${environment.urlApi.total}`;
    if (name && name !== '') {
      url = `${url}?${environment.urlApi.query.name}=${name}`
    }
    return this._httpClient.get<number>(url).pipe(
      catchError(this.handleError)
    );
  }
  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url: string = this._baseUrl;
    return this._httpClient.post<Restaurant>(url, (restaurant.jsonify())).pipe(
      catchError(this.handleError)
    );
  }

  updateRestaurant(restaurantId: string, restaurant: Restaurant): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.patch<Restaurant>(url, (restaurant.jsonify())).pipe(
      catchError(this.handleError)
    );
  }

  deleteRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.delete<Restaurant>(url).pipe(
      catchError(this.handleError)
    );
  }

  getDish(restaurantId: string, dishId: string): Observable<Dish> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.get<Dish>(url).pipe(
      catchError(this.handleError)
    );
  }

  addDish(restaurantId: string, dish: Dish): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}`;
    return this._httpClient.post<Restaurant>(url, (dish.jsonify())).pipe(
      catchError(this.handleError)
    );
  }
  updateDish(restaurantId: string, dishId: string, dish: Dish): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.patch<Restaurant>(url, (dish.jsonify())).pipe(
      catchError(this.handleError)
    );
  }
  deleteDish(restaurantId: string, dishId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.delete<Restaurant>(url).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError({ message: error.error.message });
  }
}
