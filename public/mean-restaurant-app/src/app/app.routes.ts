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
import { environment } from '../environments/environment.development';

const home = environment.urlFrontend.home;
const restaurants = environment.urlFrontend.restaurants;
const restaurant_id = environment.urlFrontend.restaurant_id;
const createRestaurant = environment.urlFrontend.createRestaurant;
const editRestaurant_id = environment.urlFrontend.editRestaurant_id;
const createDish = environment.urlFrontend.createDish;
const editDish = environment.urlFrontend.editDish;
const signIn = environment.urlFrontend.signIn;
const signUp = environment.urlFrontend.signUp;
const error = environment.urlFrontend.error;

export const routes: Routes = [
    {
        path: "", redirectTo: home, pathMatch: "full"
    },
    {
        path: home, component: HomeComponent
    },
    {
        path: restaurants, component: RestaurantsComponent
    },
    {
        path: restaurant_id, component: RestaurantComponent
    },
    {
        path: createRestaurant, component: CreateRestaurantComponent
    },
    {
        path: editRestaurant_id, component: UpdateRestaurantComponent
    },
    {
        path: createDish, component: CreateDishComponent
    },
    {
        path: editDish, component: UpdateDishComponent
    },
    {
        path: signIn, component: LoginComponent
    },
    {
        path: signUp, component: RegisterComponent
    },
    {
        path: error, component: ErrorPageComponent
    }
];
