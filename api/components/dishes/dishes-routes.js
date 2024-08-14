const express = require('express');
const router = express.Router({ mergeParams: true });
const dishController = require('./dishes-controller')

router.route(process.env.URL_DISHES)
    .get(dishController.getAllDishes)
    .post(dishController.createDish)

router.route(process.env.URL_DISHES_WITH_ID)
    .get(dishController.fineDishById)
    .patch(dishController.updateDishPartial)
    .put(dishController.updateDishFull)
    .delete(dishController.deleteDish)

module.exports = router;