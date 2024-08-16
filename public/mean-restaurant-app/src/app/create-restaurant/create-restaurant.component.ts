import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RestaurantsDataService } from '../restaurants-data.service';
import { Location, Restaurant } from '../restaurant';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-create-restaurant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-restaurant.component.html',
  styleUrl: './create-restaurant.component.css'
})
export class CreateRestaurantComponent implements OnInit {
  @ViewChild(environment.forms.restaurantForm)
  restaurantForm!: NgForm;
  restaurant!: Restaurant;
  location!: Location;

  createFailMessage: string = '';
  isCreateFail: boolean = false;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
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
    if (!this.isBlanked()) {
      this.restaurant = this.createRestaurantObject(form)
      this._restaurantsService.addRestaurant(this.restaurant).subscribe({
        next: (restaurant) => {
          this.createFailMessage = '';
          this.isCreateFail = false;
          this.restaurant = restaurant;
        },
        error: (error) => {
          console.log(error);
          this.createFailMessage = error.message;
          this.isCreateFail = true;
        },
        complete: () => {
          if (!this.isCreateFail) {
            this.createFailMessage = '';
            this.isCreateFail = false;
            this._router.navigate([`/${environment.urlFrontend.restaurant}/${this.restaurant._id}`]);
          }
        }
      })
    }
  }

  createLocationObject(form: NgForm) {
    const location = new Location();
    location.fill(form);
    return location;
  }

  createRestaurantObject(form: NgForm) {
    const restaurant = new Restaurant();
    restaurant.fill(form);
    restaurant.location = this.createLocationObject(form);
    return restaurant;
  }

  isBlanked(): boolean {
    if (this.restaurantForm.value.name === '' || this.restaurantForm.value.publishedYear === '' || this.restaurantForm.value.about === '' || this.restaurantForm.value.logo === '' || this.restaurantForm.value.city === '' || this.restaurantForm.value.state === '' || this.restaurantForm.value.country === '') {
      this.createFailMessage = environment.message.filledInTheBlank;
      this.isCreateFail = true;
      return true;
    }
    return false;
  }
}
