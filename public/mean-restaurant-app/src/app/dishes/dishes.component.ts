import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../restaurants-data.service';
import { CustomPipe } from '../custom.pipe';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private _activatedRouter: ActivatedRoute, private _router: Router) { }
  ngOnInit(): void {
    this.restaurantId = this._activatedRouter.snapshot.params['id'];
  }

  addNewDish(): void {
    const url = '/restaurant/' + this.restaurantId + '/create-dish';
    this._router.navigate([url])
  }
}
