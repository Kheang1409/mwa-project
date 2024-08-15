import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantsDataService } from '../restaurants-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dish } from '../restaurant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-dish',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-dish.component.html',
  styleUrl: './create-dish.component.css'
})
export class CreateDishComponent implements OnInit {

  @ViewChild('dishForm')
  dishForm!: NgForm;
  dish!: Dish;
  restaurantId!: string;

  createFailMessage: string = '';
  isCreateFail: boolean = false;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate(['/sign-in']);
    }
  }
  ngOnInit(): void {
    this.dish = new Dish();
    this.restaurantId = this._activatedRouter.snapshot.params['id'];
  }

  create(): void {
    this._restaurantsService.addDish(this.restaurantId, this.dish).subscribe({
      next: (restaurant) => {
        this.createFailMessage = '';
        this.isCreateFail = false;
      },
      error: (error) => {
        this.createFailMessage = 'Create unsuccessfully!';
        this.isCreateFail = true;
      },
      complete: () => {
        if (!this.isCreateFail) {
          this.createFailMessage = '';
          this.isCreateFail = false;
          this._router.navigate([`/restaurant/${this.restaurantId}`]);
        }
      }
    });
  }
}
