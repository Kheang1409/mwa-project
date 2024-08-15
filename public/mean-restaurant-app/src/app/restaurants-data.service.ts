import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish, Restaurant } from './restaurant';




@Injectable({
  providedIn: 'root'
})

export class RestaurantsDataService {

  private _baseUrl = "http://localhost:3000/api/restaurants";

  constructor(private _httpClient: HttpClient) { }

  getRestaurants(pageNumber: number): Observable<Restaurant[]> {
    const url: string = this._baseUrl + "?pageNumber=" + pageNumber;
    return this._httpClient.get<Restaurant[]>(url);
  }
  getRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId;
    return this._httpClient.get<Restaurant>(url);
  }
  getTotalRestaurants(): Observable<number> {
    const url: string = this._baseUrl + "/totals";
    return this._httpClient.get<number>(url);
  }
  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url: string = this._baseUrl + "";
    return this._httpClient.post<Restaurant>(url, (restaurant.jsonify()));
  }

  updateRestaurant(restaurantId: string, restaurant: Restaurant): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId;
    return this._httpClient.patch<Restaurant>(url, (restaurant.jsonify()));
  }

  deleteRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId;
    return this._httpClient.delete<Restaurant>(url);
  }

  getDish(restaurantId: string, dishId: string): Observable<Dish> {
    const url: string = this._baseUrl + '/' + restaurantId + '/dishes/' + dishId;
    return this._httpClient.get<Dish>(url);
  }

  addDish(restaurantId: string, dish: Dish): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId + '/dishes';
    return this._httpClient.post<Restaurant>(url, (dish.jsonify()));
  }
  updateDish(restaurantId: string, dishId: string, dish: Dish): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId + '/dishes/' + dishId;
    return this._httpClient.patch<Restaurant>(url, (dish.jsonify()));
  }
  deleteDish(restaurantId: string, dishId: string): Observable<Restaurant> {
    const url: string = this._baseUrl + "/" + restaurantId + '/dishes/' + dishId;
    return this._httpClient.delete<Restaurant>(url);
  }
}
