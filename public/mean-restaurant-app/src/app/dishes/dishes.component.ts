import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CustomPipe } from '../custom.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Dish } from '../restaurant';
import { AuthService } from '../auth.service';
import { RestaurantsDataService } from '../restaurants-data.service';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, CustomPipe],
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.css'
})
export class DishesComponent implements OnInit {
  @Input() dishes!: Dish[];
  restaurantId!: string;
  isError: boolean[] = new Array<boolean>()
  errorMessage: string = ''

  constructor(private _activatedRouter: ActivatedRoute, private _router: Router, private _authService: AuthService, private _restaurantService: RestaurantsDataService) { }
  ngOnInit(): void {
    this.dishes = new Array<Dish>();
    this.restaurantId = this._activatedRouter.snapshot.params['id'];
  }

  addNewDish(): void {
    const url = '/restaurant/' + this.restaurantId + '/add-dish';
    this._router.navigate([url])
  }
  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  delete(index: number, dishId: string) {
    this._restaurantService.deleteDish(this.restaurantId, dishId).subscribe({
      next: (restaurant) => {
        this.isError[index] = false;
        this.dishes = restaurant.dishes
      },
      error: (error) => {
        this.isError[index] = true;
        this.errorMessage = error.message;
      }
    });
  }
  update(dishId: string) {
    const url = '/restaurant/' + this.restaurantId + '/edit-dish/' + dishId;
    this._router.navigate([url])
  }
}
