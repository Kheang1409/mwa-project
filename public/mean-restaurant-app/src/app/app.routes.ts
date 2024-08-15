import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginComponent } from './login/login.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { CreateRestaurantComponent } from './create-restaurant/create-restaurant.component';
import { CreateDishComponent } from './create-dish/create-dish.component';
import { RegisterComponent } from './register/register.component';
import { UpdateRestaurantComponent } from './update-restaurant/update-restaurant.component';
import { UpdateDishComponent } from './update-dish/update-dish.component';

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
        path: "sign-up", component: RegisterComponent
    },
    {
        path: "restaurant/:id", component: RestaurantComponent
    },
    {
        path: "create-restaurant", component: CreateRestaurantComponent
    },
    {
        path: "edit-restaurant/:id", component: UpdateRestaurantComponent
    },
    {
        path: "restaurant/:id/add-dish", component: CreateDishComponent
    },
    {
        path: "restaurant/:id/edit-dish/:dishId", component: UpdateDishComponent
    },
    {
        path: "sign-in", component: LoginComponent
    },
    {
        path: "**", component: ErrorPageComponent
    }
];
