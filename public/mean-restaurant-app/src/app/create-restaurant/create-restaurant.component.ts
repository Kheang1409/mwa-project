import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Dish, Location, Restaurant, RestaurantsDataService } from '../restaurants-data.service';

@Component({
  selector: 'app-create-restaurant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-restaurant.component.html',
  styleUrl: './create-restaurant.component.css'
})
export class CreateRestaurantComponent implements OnInit {
  @ViewChild('restaurantForm')
  restaurantForm!: NgForm;
  restaurant!: Restaurant;
  location!: Location;
  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.restaurantForm.setValue(
        {
          name: '',
          publishedYear: null,
          about: '',
          logo: '',
          city: '',
          state: '',
          country: ''
        }
      );
    }, 0);
  }

  create(form: NgForm): void {
    console.log('clicked');
    this.location = this.createLocationObject(form);
    this.restaurant = this.createRestaurantObject(form, [], this.location)
    this._restaurantsService.addRestaurant(this.restaurant).subscribe(restaurant => {
      this._router.navigate([`/restaurant/${restaurant._id}`]);
    })
  }

  createLocationObject(form: NgForm) {
    return new Location('', form.value.city, form.value.state, form.value.country);
  }

  createRestaurantObject(form: NgForm, dishes: Dish[], location: Location) {
    return new Restaurant('', form.value.name, form.value.publishedYear, location, dishes, form.value.about, form.value.logo);
  }
}
