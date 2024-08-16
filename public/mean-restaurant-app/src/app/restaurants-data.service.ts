import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this._httpClient.get<Restaurant[]>(url);
  }
  getRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.get<Restaurant>(url);
  }
  getTotalRestaurants(name: string | null): Observable<number> {
    let url: string = `${this._baseUrl}/${environment.urlApi.total}`;
    if (name && name !== '') {
      url = `${url}?${environment.urlApi.query.name}=${name}`
    }
    return this._httpClient.get<number>(url);
  }
  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url: string = this._baseUrl;
    return this._httpClient.post<Restaurant>(url, (restaurant.jsonify()));
  }

  updateRestaurant(restaurantId: string, restaurant: Restaurant): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.patch<Restaurant>(url, (restaurant.jsonify()));
  }

  deleteRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}`;
    return this._httpClient.delete<Restaurant>(url);
  }

  getDish(restaurantId: string, dishId: string): Observable<Dish> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.get<Dish>(url);
  }

  addDish(restaurantId: string, dish: Dish): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}`;
    return this._httpClient.post<Restaurant>(url, (dish.jsonify()));
  }
  updateDish(restaurantId: string, dishId: string, dish: Dish): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.patch<Restaurant>(url, (dish.jsonify()));
  }
  deleteDish(restaurantId: string, dishId: string): Observable<Restaurant> {
    const url: string = `${this._baseUrl}/${restaurantId}/${environment.urlApi.dishes}/${dishId}`;
    return this._httpClient.delete<Restaurant>(url);
  }
}
