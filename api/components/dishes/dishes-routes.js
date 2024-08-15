const express = require('express');
const dishController = require('./dishes-controller')
const auth_controller = require('./../authentication/authentication-controller')
const router = express.Router({ mergeParams: true });

router.route(process.env.URL_DISHES)
    .get(dishController.getAllDishes)
    .post(auth_controller.isValidToken, dishController.createDish)

router.route(process.env.URL_DISHES_WITH_ID)
    .get(dishController.fineDishById)
    .patch(auth_controller.isValidToken, dishController.updateDishPartial)
    .put(auth_controller.isValidToken, dishController.updateDishFull)
    .delete(auth_controller.isValidToken, dishController.deleteDish)

module.exports = router;