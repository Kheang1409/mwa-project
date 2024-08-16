import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestaurantsDataService } from '../restaurants-data.service';
import { Restaurant } from '../restaurant';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit {

  previouseDisable: boolean = false;
  nextDisable: boolean = false;

  private pageNumberKey = environment.keys.pageNumberKey;

  page: number = environment.numbers.page;
  total_page!: number;
  restaurants: Restaurant[] = new Array<Restaurant>();

  searchQuery: string = '';

  isError: boolean = false;
  errorMessage: string = ''

  constructor(private _restaurantsService: RestaurantsDataService) {
    this.page = sessionStorage.getItem(this.pageNumberKey) == null ? environment.numbers.page : Number(sessionStorage.getItem(this.pageNumberKey))
  }

  previouse() {
    if (this.page > 1) {
      this.nextDisable = false;
      this.page--;
      this.setPageNumber(this.page);
      this.getRestaurants(this.page, this.searchQuery);
    }
    else {
      this.previouseDisable = true;
    }
  }

  next() {
    if (this.page > this.total_page - 1) {
      this.nextDisable = true;
    }
    else {
      this.page++;
      this.setPageNumber(this.page);
      this.getRestaurants(this.page, null);
      this.previouseDisable = false;
    }
  }
  ngOnInit(): void {
    this.getTotalPage(this.searchQuery)
    this.getRestaurants(this.page, this.searchQuery);
  }

  getTotalPage(name: string | null) {
    this._restaurantsService.getTotalRestaurants(name).subscribe(restaurants => {
      this.total_page = Math.ceil(restaurants / environment.numbers.limit);
      if (this.total_page < 1) {
        this.total_page = 1;
      }
    });
  }
  getRestaurants(pageNumber: number, name: string | null): void {
    this._restaurantsService.getRestaurants(pageNumber, name).subscribe(restaurants => {
      this.restaurants = restaurants;
    });

    this._restaurantsService.getRestaurants(pageNumber, name).subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants;
        this.isError = false;
      },
      error: (error) => {
        this.isError = true;
        this.errorMessage = error.message;
        this.restaurants = [];
      },
      complete: () => {

      }
    });
  }
  setPageNumber(page: number) {
    this.page = page;
    sessionStorage.setItem(this.pageNumberKey, `${page}`);
  }

  searchRestaurants() {
    this.getTotalPage(this.searchQuery)
    this.getRestaurants(this.page, this.searchQuery)
  }
}
