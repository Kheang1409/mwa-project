import { Component, OnInit } from '@angular/core';
import { Location, Restaurant, RestaurantsDataService } from '../restaurants-data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DishesComponent } from '../dishes/dishes.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, DishesComponent],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit {
  restaurantId!: string;
  restaurant!: Restaurant;
  constructor(private _restaurantsService: RestaurantsDataService, private _activedRoute: ActivatedRoute) {
    this.restaurant = new Restaurant('', '', 0, new Location('', '', '', ''), [], '', '');
  }

  ngOnInit(): void {
    this.restaurantId = this._activedRoute.snapshot.params["id"];
    this._restaurantsService.getRestaurant(this.restaurantId).subscribe(restaurant => {
      this.restaurant = restaurant;
    })
  }

}
