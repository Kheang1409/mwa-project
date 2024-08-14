import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish, RestaurantsDataService } from '../restaurants-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-dish',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-dish.component.html',
  styleUrl: './create-dish.component.css'
})
export class CreateDishComponent implements OnInit {

  @ViewChild('dishForm')
  dishForm!: NgForm;
  dish!: Dish;
  location!: Location;
  restaurantId!: string;

  constructor(private _authService: AuthService, private _restaurantsService: RestaurantsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    this.dish = new Dish('', '', 0, '', '');
    this.restaurantId = this._activatedRouter.snapshot.params['id'];
  }

  create(): void {
    this._restaurantsService.addDish(this.restaurantId, this.dish).subscribe(restaurant => {
      this._router.navigate(['/restaurant/' + restaurant._id]);
    });
  }
}
