const mongoose = require('mongoose');
const callBackify = require('util').callbackify;
require('dotenv').config();

const RESTAURANT_MODEL = process.env.RESTAURANT_MODEL;
const LIMIT = process.env.LIMIT;
const OFFSET = process.env.OFFSET;
const MAX_DISPLAY = process.env.MAX_DISPLAY;

GET_CODE = process.env.GET_CODE;
POST_CODE = process.env.POST_CODE;
PUT_CODE = process.env.PUT_CODE;
PATCH_CODE = process.env.PATCH_CODE;
DELETE_CODE = process.env.DELETE_CODE;
BAD_REQUEST_CODE = process.env.BAD_REQUEST_CODE;
NOT_FOUND_CODE = process.env.NOT_FOUND_CODE;
SOMETHING_WRONG_CODE = process.env.SOMETHING_WRONG_CODE;


BAD_REQUEST_MESSAGE = process.env.BAD_REQUEST_MESSAGE;
NOT_FOUND_MESSAGE = process.env.NOT_FOUND_MESSAGE;
CREATED_MESSAGE = process.env.CREATED_MESSAGE;
INVALID_TYPE_MESSAGE = process.env.INVALID_TYPE_MESSAGE;
OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE = process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE;
OVER_LIMIT_MESSAGE = process.env.OVER_LIMIT_MESSAGE;

const restaurantModel = mongoose.model(RESTAURANT_MODEL);

const restaurantModelFindByIdExecCallBack = callBackify(function (id) {
    return restaurantModel.findById(id).exec();
})

const restaurantModelFindByIdAndUpdateExecCallBack = callBackify(function (id, updateRestaurant) {
    return restaurantModel.findByIdAndUpdate(id, updateRestaurant).exec();
})

const restaurantSaveCallBack = callBackify(function (restaurant) {
    return restaurant.save();
})

const getAllDishes = function (req, res) {

    let response = {
        status: GET_CODE,
        data: {}
    }

    let restaurantId = req.params.restaurantId;
    let limit = LIMIT;
    let offset = OFFSET;
    if (req.query && req.query.offset) {
        if (isNaN(req.query.offset) == true) {
            response.status = BAD_REQUEST_CODE;
            response.data = { message: OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE };
            res.status(response.status).json(onse.data);
        }
        else {
            offset = parseInt(req.query.offset);
        }
    }

    if (req.query && req.query.limit) {
        if (isNaN(req.query.limit) == true) {
            response.status = BAD_REQUEST_CODE;
            response.data = { message: INVALID_TYPE_MESSAGE };
            res.status(response.status).json(response.data);
        }
        else {
            limit = parseInt(req.query.limit);
            if (limit > MAX_DISPLAY) {
                response.status = BAD_REQUEST_CODE;
                response.data = { message: OVER_LIMIT_MESSAGE };
                res.status(response.status).json(response.data);
            }
        }
    }
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err) {
            response.status = SOMETHING_WRONG_CODE;
            response.data = { message: err.message };
        }
        else if (restaurant) {
            if (restaurant.dishes.length == 0) {
                response.status = NOT_FOUND_CODE;
                response.data = { message: NOT_FOUND_MESSAGE };
            }
            else {
                response.data = restaurant.dishes.slice(offset, offset + limit);
            }
        }
        else {
            response.status = NOT_FOUND_CODE;
            response.data = { message: NOT_FOUND_MESSAGE };
        }
        res.status(response.status).json(response.data);
    })
}

const fineDishById = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err)
            res.status(500).json({ message: err });
        else if (restaurant == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            if (!mongoose.Types.ObjectId.isValid(dishId)) {
                return res.status(400).json({ message: 'Invalid dish ID format!' });
            }
            else {
                let dish = restaurant.dishes.id(dishId);
                if (dish == null)
                    res.status(404).json({ message: 'dish\'s not found!' });
                else
                    res.status(200).json(dish);
            }
        }
    })
}

const createDish = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let newDish = {
        title: req.body.title,
        price: req.body.price,
        picture: req.body.picture
    };
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err)
            res.status(500).json({ message: err });
        else if (restaurant == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            restaurant.dishes.push(newDish);
            restaurantSaveCallBack(restaurant, function (err, newDish) {
                if (err)
                    res.status(400).json({ message: err.message });
                else
                    res.status(201).json(newDish.dishes)
            });
        }
    })
}
const updateDishPartial = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    let updateData = req.body;

    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err)
            res.status(500).json({ message: err });
        else if (restaurant == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            if (!mongoose.Types.ObjectId.isValid(dishId)) {
                res.status(400).json({ message: 'Invalid dish ID format!' });
            }
            else {
                const dish = restaurant.dishes.id(dishId);
                if (!dish)
                    res.status(404).json({ message: 'dish\'s not found!' });
                else {
                    for (const key in updateData) {
                        dish[key] = updateData[key];
                    }
                    restaurantSaveCallBack(restaurant, function (err, response) {
                        if (err)
                            res.status(400).json({ message: err.message });
                        else
                            res.status(203).json(response.dishes.id(dishId));
                    });
                }
            }
        }
    })
}

const updateDishFull = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    let updateData = req.body;

    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err)
            res.status(500).json({ message: err });
        else if (restaurant == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            if (!mongoose.Types.ObjectId.isValid(dishId)) {
                res.status(400).json({ message: 'Invalid dish ID format!' });
            }
            else {
                const dish = restaurant.dishes.id(dishId);
                if (!dish)
                    res.status(404).json({ message: 'dish\'s not found!' });
                else {
                    dish.title = updateData.title;
                    dish.price = updateData.price;
                    dish.picture = updateData.picture;
                    restaurantSaveCallBack(restaurant, function (err, response) {
                        if (err)
                            res.status(400).json({ message: err.message });
                        else
                            res.status(203).json(response.dishes.id(dishId));
                    });
                }
            }
        }
    })
}

const removeDish = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err)
            res.status(500).json({ message: err });
        else if (restaurant == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            if (!mongoose.Types.ObjectId.isValid(dishId)) {
                res.status(400).json({ message: 'Invalid dish ID format!' });
            }
            else {
                const deletedDish = restaurant.dishes.id(dishId);
                restaurantModelFindByIdAndUpdateExecCallBack(restaurant, { $pull: { dishes: { _id: dishId } } }, { new: true, runValidators: true }, function (err, restaurant) {
                    if (err)
                        res.status(500).json({ message: err.message });
                    else
                        res.status(203).json(deletedDish);
                });
            }
        }
    })
}

module.exports = { getAllDishes, fineDishById, createDish, updateDishPartial, updateDishFull, removeDish }