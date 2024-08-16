import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantsDataService } from '../restaurants-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dish } from '../restaurant';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-create-dish',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-dish.component.html',
  styleUrl: './create-dish.component.css'
})
export class CreateDishComponent implements OnInit {

  @ViewChild(environment.forms.dishForm)
  dishForm!: NgForm;
  dish!: Dish;
  restaurantId!: string;

  createFailMessage: string = '';
  isCreateFail: boolean = false;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
    }
  }
  ngOnInit(): void {
    this.dish = new Dish();
    this.restaurantId = this._activatedRouter.snapshot.params[environment.params.restaurantId];
  }

  create(): void {
    if (!this.isBlank()) {
      this._restaurantsService.addDish(this.restaurantId, this.dish).subscribe({
        next: (restaurant) => {
          this.createFailMessage = '';
          this.isCreateFail = false;
        },
        error: (error) => {
          this.createFailMessage = environment.message.createFailMessage;
          this.isCreateFail = true;
        },
        complete: () => {
          if (!this.isCreateFail) {
            this.createFailMessage = '';
            this.isCreateFail = false;
            this._router.navigate([`${environment.urlFrontend.restaurant}/${this.restaurantId}`]);
          }
        }
      });
    }
  }
  isBlank(): boolean {
    if (this.dish.title === undefined || this.dish.price === undefined || this.dish.picture === undefined || this.dish.description === undefined) {
      this.createFailMessage = environment.message.filledInTheBlank;
      this.isCreateFail = true;
      return true;
    }
    return false;
  }
}
