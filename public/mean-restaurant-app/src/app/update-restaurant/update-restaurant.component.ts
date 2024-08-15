import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RestaurantsDataService } from '../restaurants-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, Restaurant } from '../restaurant';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-restaurant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-restaurant.component.html',
  styleUrl: './update-restaurant.component.css'
})
export class UpdateRestaurantComponent implements OnInit {

  restaurantId!: string;
  restaurant!: Restaurant;

  updateFailMessage: string = '';
  isUpdateFail: boolean = false;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    this.restaurant = new Restaurant();
    this.restaurant.location = new Location();
    if (!this._authService.isLoggedIn()) {
      this._router.navigate(['/sign-in']);
    }
  }
  ngOnInit(): void {
    this.restaurantId = this._activatedRouter.snapshot.params['id'];
    this._restaurantsService.getRestaurant(this.restaurantId).subscribe(restaurant => {
      // this.restaurant = restaurant // it will lose jsonify
      this.restaurant = Object.assign(new Restaurant(), restaurant);
      this.restaurant.location = Object.assign(new Location(), this.restaurant.location)
    })
  }

  update(): void {
    this._restaurantsService.updateRestaurant(this.restaurantId, this.restaurant).subscribe({
      next: (restaurant) => {
        this.updateFailMessage = '';
        this.isUpdateFail = false;
      },
      error: (error) => {
        this.updateFailMessage = 'Update unsuccessfully!';
        this.isUpdateFail = true;
      },
      complete: () => {
        if (!this.isUpdateFail) {
          this.updateFailMessage = '';
          this.isUpdateFail = false;
          this._router.navigate([`/restaurant/${this.restaurant._id}`]);
        }
      }
    });
  }

}
