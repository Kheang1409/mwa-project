import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { set } from 'mongoose';


export class Location {
  #_id!: string;
  #city!: string;
  #state!: string;
  #country!: string

  get _id(): string {
    return this.#_id
  }
  get city(): string {
    return this.#city
  }
  get state(): string {
    return this.#state
  }
  get country(): string {
    return this.#country
  }

  constructor(id: string, city: string, state: string, country: string) {
    this.#_id = id;
    this.#city = city;
    this.#state = state;
    this.#country = country;
  }
}

export class Dish {
  #_id!: string;
  #title!: string;
  #price!: number;
  #picture!: string;
  #description!: string

  get _id(): string {
    return this.#_id
  }
  get title(): string {
    return this.#title
  }
  get price(): number {
    return this.#price
  }
  get picture(): string {
    return this.#picture
  }
  get description(): string {
    return this.#description
  }

  set title(title: string) {
    this.#title = title;
  }
  set price(price: number) {
    this.#price = price;
  }
  set picture(picture: string) {
    this.#picture = picture;
  }
  set description(description: string) {
    this.#description = description;
  }

  constructor(id: string, title: string, price: number, picture: string, description: string) {
    this.#_id = id;
    this.#title = title;
    this.#price = price;
    this.#picture = picture;
    this.#description = description;
  }
  plantObject() {
    return {
      title: this.title,
      price: this.price,
      picture: this.picture,
      description: this.description
    }
  }
}

export class Restaurant {
  #_id!: string;
  #name!: string;
  #publishedYear!: number;
  #location!: Location;
  #dishes!: Dish[];
  #about!: string;
  #logo!: string;

  get _id(): string {
    return this.#_id
  }
  get name(): string {
    return this.#name
  }
  get publishedYear(): number {
    return this.#publishedYear
  }
  get location(): Location {
    return this.#location
  }
  get dishes(): Dish[] {
    return this.#dishes
  }
  get about(): string {
    return this.#about
  }
  get logo(): string {
    return this.#logo
  }
  constructor(id: string, name: string, publishedYear: number, location: Location, dishes: Dish[], about: string, logo: string) {
    this.#_id = id;
    this.#name = name;
    this.#publishedYear = publishedYear;
    this.#location = location;
    this.#dishes = dishes;
    this.#about = about;
    this.#logo = logo;
  }
  plantObject() {
    return {
      name: this.name,
      publishedYear: this.publishedYear,
      about: this.about,
      logo: this.logo,
      location: {
        city: this.location.city,
        state: this.location.state,
        country: this.location.country,
      }
    }
  }
}



@Injectable({
  providedIn: 'root'
})

export class RestaurantsDataService {

  private _baseUrl = "http://localhost:3000/api";

  constructor(private _httpClient: HttpClient, private _authService: AuthService) { }

  getRestaurants(pageNumber: number): Observable<Restaurant[]> {
    const url: string = this._baseUrl + "/restaurants?pageNumber=" + pageNumber;
    return this._httpClient.get<Restaurant[]>(url);
  }
  getRestaurant(restaurantId: string): Observable<Restaurant> {
    const url: string = this._baseUrl + "/restaurants/" + restaurantId;
    return this._httpClient.get<Restaurant>(url);
  }
  getTotalRestaurants(): Observable<number> {
    const url: string = this._baseUrl + "/restaurants/totals";
    return this._httpClient.get<number>(url);
  }
  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url: string = this._baseUrl + "/restaurants";
    const headers = new HttpHeaders().set('Authorization', `${this._authService.getToken()}`);
    return this._httpClient.post<Restaurant>(url, (restaurant.plantObject()), { headers });
  }
  addDish(restaurantId: string, dish: Dish): Observable<Restaurant> {
    const url: string = this._baseUrl + "/restaurants/" + restaurantId + '/dishes';
    console.log(url);
    console.log(dish.plantObject());
    const headers = new HttpHeaders().set('Authorization', `${this._authService.getToken()}`);
    return this._httpClient.post<Restaurant>(url, (dish.plantObject()), { headers });
  }
}
