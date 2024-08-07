const mongoose = require('mongoose');
require('dotenv').config();
const callBackify = require('util').callbackify;

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

console.log(restaurantModel)

const restaurantModelFindSkipLimitExecCallBack = callBackify(function (offset, limit) {
    return restaurantModel.find().skip(offset).limit(limit).exec();
})

const restaurantModelFindByIdExecCallBack = callBackify(function (id) {
    return restaurantModel.findById(id).exec();
})

const restaurantModelCreateCallBack = callBackify(function (newRestaurant) {
    return restaurantModel.create(newRestaurant)
})

const restaurantSaveCallBack = callBackify(function (restaurant) {
    return restaurant.save();
})

const restaurantModelFindByIdAndDeleteExecCallBack = callBackify(function (id) {
    return restaurantModel.findByIdAndDelete(id).exec();
})


const getAllRestaurant = function (req, res) {
    let limit = LIMIT;
    let offset = OFFSET;

    let response = {
        status: GET_CODE,
        data: {}
    }

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
            if (limit > LIMIT) {
                response.status = BAD_REQUEST_CODE;
                response.data = { message: OVER_LIMIT_MESSAGE };
                res.status(response.status).json(response.data);
            }
        }
    }
    restaurantModelFindSkipLimitExecCallBack(offset, limit, function (err, restaurants) {
        if (err) {
            response.status = SOMETHING_WRONG_CODE;
            response.data = { message: err.message };
        }
        else if (restaurants) {
            response.data = restaurants;
        }
        else {
            response.status = NOT_FOUND_CODE;
            response.data = { message: NOT_FOUND_MESSAGE };
        }
        res.status(response.status).json(response.data);
    })
}

const getRestaurantById = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let response = {
        status: GET_CODE,
        data: {}
    }
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err) {
            response.status = SOMETHING_WRONG_CODE;
            response.data = { message: err.message };
        }
        else if (restaurant) {
            response.data = restaurant
        }
        else {
            response.status = NOT_FOUND_CODE;
            response.data = { message: NOT_FOUND_MESSAGE };
        }
        res.status(response.status).json(response.data);
    })
}

const createRestaurant = function (req, res) {
    let response = {
        status: POST_CODE,
        data: {}
    }
    let newRestaurant = {
        name: req.body.name,
        publishedYear: req.body.publishedYear,
        location: req.body.location,
        dishes: req.body.dishes
    }
    restaurantModelCreateCallBack(newRestaurant, function (err, newRestaurant) {
        if (err) {
            response.status = SOMETHING_WRONG_CODE;
            response.data = { message: err.message };
        }
        else {
            response.data = newRestaurant;
        }
        res.status(response.status).json(response.data);
    })
}

const updateRestaurantPartial = function (req, res) {
    _updateRestaurant(req, res, _partialUpdate, PATCH_CODE);
}

const updateRestaurantFull = function (req, res) {
    _updateRestaurant(req, res, _fullUpdate, PUT_CODE);
}

const deleteRestaurant = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let response = {
        status: process.env.DELETE_CODE,
        json: {}
    }
    restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
        if (err) {
            response.status = SOMETHING_WRONG_CODE;
            response.data = err.message;
            res.status(response.status).json(response.data);
        }
        else {
            if (restaurant) {
                restaurantModelFindByIdAndDeleteExecCallBack(restaurantId, function (err, deleteRestaurant) {
                    if (err) {
                        response.status = SOMETHING_WRONG_CODE;
                        response.data = err.message;
                    }
                    else {
                        response.data = deleteRestaurant;
                    }
                    res.status(response.status).json(response.data);
                });
            }
            else {
                response.status = NOT_FOUND_CODE;
                response.data = { message: NOT_FOUND_MESSAGE };
                res.status(response.status).json(response.data);
            }
        }
    })
}

const _fullUpdate = function (req, restaurant) {
    restaurant.name = req.body.name;
    restaurant.publishedYear = req.body.publishedYear;
    restaurant.location = req.body.location;
    restaurant.dishes = req.body.dishes;
}

const _partialUpdate = function (req, restaurant) {
    if (req.body && req.body.name) restaurant.name = req.body.name;
    if (req.body && req.body.publishedYear) restaurant.publishedYear = req.body.publishedYear;
    if (req.body && req.body.location) restaurant.location = req.body.location;
    if (req.body && req.body.dishes) restaurant.dishes = req.body.dishes;
}

const _updateRestaurant = function (req, res, callBack, STATUS_CODE) {
    let restaurantId = req.params.restaurantId;

    let response = {
        status: parseInt(STATUS_CODE),
        json: {}
    };

    if (!mongoose.isValidObjectId(restaurantId)) {
        response.status = process.env.NOT_FOUND_CODE;
        response.json = { message: process.env.NOT_FOUND_MESSAGE };
        res.status(response.status).json(response.json);
    }
    else {
        restaurantModelFindByIdExecCallBack(restaurantId, function (err, restaurant) {
            if (err) {
                response.status = process.env.SOMETHING_WRONG_CODE;
                response.json = { message: err.message };
                res.status(response.status).json(response.json);
            }
            else {
                if (restaurant) {
                    callBack(req, restaurant);
                    restaurantSaveCallBack(restaurant, function (err, updatedrestaurant) {
                        if (err) {
                            response.status = process.env.SOMETHING_WRONG_CODE;
                            response.json = { message: err.message };
                        }
                        else {
                            response.json = updatedrestaurant;
                        }
                        res.status(response.status).json(response.json);
                    });
                }
                else {
                    response.status = process.env.NOT_FOUND_CODE;
                    response.json = { message: process.env.NOT_FOUND_MESSAGE };
                    res.status(response.status).json(response.json);
                }
            }
        });
    }
}

module.exports = { getAllRestaurant, getRestaurantById, createRestaurant, updateRestaurantPartial, updateRestaurantFull, deleteRestaurant }