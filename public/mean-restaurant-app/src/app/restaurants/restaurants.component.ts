import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Restaurant, RestaurantsDataService } from '../restaurants-data.service';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit {

  previouseDisable: boolean = false;
  nextDisable: boolean = false;

  private pageNumberKey = 'pageNumber';

  page: number = 1;
  total_page!: number;
  restaurants: Restaurant[] = new Array<Restaurant>();

  constructor(private _restaurantsService: RestaurantsDataService) {
    this.page = sessionStorage.getItem(this.pageNumberKey) == null ? 1 : Number(sessionStorage.getItem(this.pageNumberKey))
  }

  previouse() {
    if (this.page > 1) {
      this.nextDisable = false;
      this.page--;
      this.setPageNumber(this.page);
      this.getRestaurants(this.page);
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
      this.getRestaurants(this.page);
      this.previouseDisable = false;
    }
  }
  ngOnInit(): void {
    this.getRestaurants(this.page)
    this._restaurantsService.getTotalRestaurants().subscribe(restaurants => {
      this.total_page = Math.ceil(restaurants / 4);
    });
  }
  getRestaurants(pageNumber: number): void {
    this._restaurantsService.getRestaurants(pageNumber).subscribe(restaurants => {
      this.restaurants = restaurants;
    });
  }
  setPageNumber(page: number) {
    this.page = page;
    sessionStorage.setItem(this.pageNumberKey, "" + page);
  }
}
