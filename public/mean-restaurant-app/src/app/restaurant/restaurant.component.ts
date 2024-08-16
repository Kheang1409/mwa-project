import { Component, OnInit } from '@angular/core';
import { RestaurantsDataService } from '../restaurants-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DishesComponent } from '../dishes/dishes.component';
import { Location, Restaurant } from '../restaurant';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment.development';

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

  isError: boolean = false;
  errorMessage: string = ''

  constructor(private _restaurantsService: RestaurantsDataService, private _authService: AuthService, private _activedRoute: ActivatedRoute, private _router: Router) {
    this.restaurant = new Restaurant();
    this.restaurant.location = new Location();
  }

  ngOnInit(): void {
    this.restaurantId = this._activedRoute.snapshot.params[environment.params.restaurantId];
    this._restaurantsService.getRestaurant(this.restaurantId).subscribe(restaurant => {
      this.restaurant = restaurant;
    })
  }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  delete() {

    this._restaurantsService.deleteRestaurant(this.restaurantId).subscribe({
      next: (restaurants) => {
        this.restaurant = restaurants;
        this.isError = false;
      },
      error: (error) => {
        this.isError = true;
        this.errorMessage = error.message;
      },
      complete: () => {
        if (!this.isError) {
          this._router.navigate([environment.urlFrontend.restaurants]);
        }
      }
    })
  }
  update() {
    this._router.navigate([`${environment.urlFrontend.editRestaurant}/${this.restaurantId}`]);

  }
}
