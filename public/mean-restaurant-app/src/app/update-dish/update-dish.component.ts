import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Dish } from '../restaurant';
import { AuthService } from '../auth.service';
import { RestaurantsDataService } from '../restaurants-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-update-dish',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-dish.component.html',
  styleUrl: './update-dish.component.css'
})
export class UpdateDishComponent {
  @ViewChild(environment.forms.dishForm)
  dishForm!: NgForm;
  dish!: Dish;
  restaurantId!: string;
  dishId!: string;

  updateFailMessage: string = ''
  isUpdateFail: boolean = false;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
    }
  }
  ngOnInit(): void {
    this.dish = new Dish();
    this.restaurantId = this._activatedRouter.snapshot.params[environment.params.restaurantId];
    this.dishId = this._activatedRouter.snapshot.params[environment.params.dishId];
    this._restaurantsService.getDish(this.restaurantId, this.dishId).subscribe(dish => {
      this.dish = Object.assign(new Dish(), dish);
    })
  }

  update(): void {
    if (!this.isBlank()) {
      this._restaurantsService.updateDish(this.restaurantId, this.dishId, this.dish).subscribe({
        next: (restaurant) => {
          this.updateFailMessage = ''
          this.isUpdateFail = false;
        },
        error: (error) => {
          this.updateFailMessage = environment.message.updateFailMessage;
          this.isUpdateFail = true;
        },
        complete: () => {
          if (!this.isUpdateFail) {
            this.updateFailMessage = ''
            this.isUpdateFail = false;
            this._router.navigate([`${environment.urlFrontend.restaurant}/${this.restaurantId}`]);
          }
        }
      });
    }
  }
  isBlank(): boolean {
    if (this.dish.title === '' || this.dish.price === null || this.dish.picture === '' || this.dish.description === '') {
      this.updateFailMessage = environment.message.filledInTheBlank;
      this.isUpdateFail = true;
      return true;
    }
    return false;
  }
}
