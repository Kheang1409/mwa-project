const express = require('express');
const router = express.Router();
require('dotenv').config();

const restaurantController = require('./restaurants-controller');
const dishesRouter = require('./../dishes/dishes-routes')

router.route(process.env.URL_EMPTY)
    .get(restaurantController.getAllRestaurant)
    .post(restaurantController.createRestaurant)

router.route(process.env.URL_RESTAURANTS_WITH_ID)
    .get(restaurantController.getRestaurantById)
    .patch(restaurantController.updateRestaurantPartial)
    .put(restaurantController.updateRestaurantFull)
    .delete(restaurantController.deleteRestaurant)

//nested api
router.use(process.env.URL_RESTAURANTS_WITH_ID, dishesRouter);

module.exports = router;

