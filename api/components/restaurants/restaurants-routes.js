const express = require('express');
const router = express.Router();

const restaurantController = require('./restaurants-controller');
const dishesRouter = require('./../dishes/dishes-routes')
const auth_controller = require('./../authentication/authentication-controller')


router.route(process.env.URL_EMPTY)
    .get(restaurantController.getAllRestaurant)
    .post(auth_controller.isValidToken, restaurantController.createRestaurant)

router.route('/test').get(auth_controller.isValidTokenTest);
//auth_controller.isValidToken,

router.route(process.env.URL_TOTAL)
    .get(restaurantController.getTotalRestaurants)

router.route(process.env.URL_RESTAURANTS_WITH_ID)
    .get(restaurantController.getRestaurantById)
    .patch(auth_controller.isValidToken, restaurantController.updateRestaurantPartial)
    .put(auth_controller.isValidToken, restaurantController.updateRestaurantFull)
    .delete(auth_controller.isValidToken, restaurantController.deleteRestaurant)

//nested api
router.use(process.env.URL_RESTAURANTS_WITH_ID, dishesRouter);

module.exports = router;

