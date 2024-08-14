import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginComponent } from './login/login.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { CreateRestaurantComponent } from './create-restaurant/create-restaurant.component';
import { CreateDishComponent } from './create-dish/create-dish.component';

export const routes: Routes = [
    {
        path: "", redirectTo: "home", pathMatch: "full"
    },
    {
        path: "home", component: HomeComponent
    },
    {
        path: "restaurants", component: RestaurantsComponent
    },
    {
        path: "restaurant/:id", component: RestaurantComponent
    },
    {
        path: "create-restaurant", component: CreateRestaurantComponent
    },
    {
        path: "restaurant/:id/create-dish", component: CreateDishComponent
    },
    {
        path: "login", component: LoginComponent
    },
    {
        path: "**", component: ErrorPageComponent
    }
];
