const mongoose = require('mongoose');

const RESTAURANT_MODEL = process.env.RESTAURANT_MODEL;

const restaurantModel = mongoose.model(RESTAURANT_MODEL);

const _restaurantModelFindByIdExec = function (restaurantId) {
    return restaurantModel.findById(restaurantId).exec();
}

const _restaurantSave = function (restaurant) {
    return restaurant.save();
}

const _getIfFoundRestaurant = function (restaurant) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (restaurant)
            resolve(restaurant);
        else
            reject(error);
    })
}

const _getIfFoundAnyDishes = function (dishes) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (dishes.length > 0)
            resolve(dishes);
        else
            reject(error);
    })
}

const _getIfFoundDish = function (dish) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (dish)
            resolve(dish);
        else
            reject(error);
    })
}

const _setDefaultResponse = function (statusCode, data) {
    return response = {
        status: statusCode,
        data: data
    }
}

const _setErrorResponse = function (response, statusCode, message) {
    response.status = statusCode;
    response.data = message;
}

const _sendReponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.data);
}

const _createNewDishObject = function (req) {
    return newDish = {
        title: req.body.title,
        price: req.body.price,
        picture: req.body.picture,
        description: req.body.description
    };

}

const _addDishToSubResturant = function (restaurant, dish) {
    return new Promise(resolve => {
        restaurant.dishes.push(dish)
        resolve(restaurant)
    })
}

const _deleteDishToSubResturant = function (restaurant, dishId) {
    return new Promise(resolve => {
        restaurant.dishes.pull(dishId);
        resolve(restaurant)
    })
}

const _fullyUpdateDish = function (restaurant, dish, req) {
    dish.title = req.body.title;
    dish.price = req.body.price;
    dish.picture = req.body.picture;
    dish.description = req.body.description
    return new Promise((resolve) => {
        resolve(restaurant)
    })

}

const _partiallyUpdateDish = function (restaurant, dish, req) {
    if (req.body.title) dish.title = req.body.title;
    if (req.body.price) dish.price = req.body.price;
    if (req.body.picture) dish.picture = req.body.picture;
    if (req.body.description) dish.description = req.body.description;
    return new Promise((resolve) => {
        resolve(restaurant)
    })
}

const _updateDish = function (req, res, callback, STATUS_CODE) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    let response = _setDefaultResponse(STATUS_CODE, {})

    if (!mongoose.isValidObjectId(restaurantId) || !mongoose.isValidObjectId(dishId)) {
        response.status = process.env.BAD_REQUEST_CODE;
        response.data = { message: process.env.INVALID_TYPE_MESSAGE };
        _sendReponse(res, response)
    }

    _restaurantModelFindByIdExec(restaurantId)
        .then(returnRestaurant => _getIfFoundRestaurant(returnRestaurant))
        .then(restaurant => callback(restaurant, restaurant.dishes.id(dishId), req))
        .then((restaurant) => _restaurantSave(restaurant))
        .then((restaurant) => response.data = restaurant)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => { _sendReponse(res, response) });
}

const getAllDishes = function (req, res) {

    let offset = process.env.OFFSET;
    let limit = process.env.LIMIT;
    let max = process.env.MAX_DISPLAY;
    let restaurantId = req.params.restaurantId;
    let response = _setDefaultResponse(process.env.GET_CODE, {});

    if (!mongoose.isValidObjectId(restaurantId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE)
    }
    if (req.query.limit) {
        if (isNaN(req.query.limit))
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, { message: process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE })
        else
            limit = parseInt(req.query.limit);
        if (limit > max)
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, { message: process.env.OVER_LIMIT_MESSAGE })

    }
    if (req.query.offset) {
        if (isNaN(req.query.offset))
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, { message: process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE })
        else
            offset = parseInt(req.query.offset);
    }
    if (response.status != process.env.GET_CODE) {
        _sendReponse(res, response)
    }
    else {
        _restaurantModelFindByIdExec(restaurantId)
            .then(returnRestaurant => _getIfFoundRestaurant(returnRestaurant))
            .then(restaurant => _getIfFoundAnyDishes(restaurant.dishes))
            .then(dishes => response.data = dishes.slice(offset, offset + limit))
            .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
            .finally(() => _sendReponse(res, response));
    }
}

const fineDishById = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    let response = _setDefaultResponse(process.env.GET_CODE, {});

    if (!mongoose.isValidObjectId(restaurantId) || !mongoose.isValidObjectId(dishId)) {
        response.status = process.env.BAD_REQUEST_CODE;
        response.data = { message: process.env.INVALID_TYPE_MESSAGE };
        _sendReponse(res, response)
    }

    _restaurantModelFindByIdExec(restaurantId)
        .then(returnRestaurant => _getIfFoundRestaurant(returnRestaurant))
        .then(restaurant => _getIfFoundDish(restaurant.dishes.id(dishId)))
        .then(dish => response.data = dish)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));

}

const createDish = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let newDishObject = _createNewDishObject(req);
    let response = _setDefaultResponse(process.env.POST_CODE, {});

    if (!mongoose.isValidObjectId(restaurantId)) {
        response.status = process.env.BAD_REQUEST_CODE;
        response.data = { message: process.env.INVALID_TYPE_MESSAGE };
        _sendReponse(res, response)
    }

    _restaurantModelFindByIdExec(restaurantId)
        .then(returnRestaurant => _getIfFoundRestaurant(returnRestaurant))
        .then(restaurant => _addDishToSubResturant(restaurant, newDishObject))
        .then((restaurant) => _restaurantSave(restaurant))
        .then((restaurant) => response.data = restaurant)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => { _sendReponse(res, response) });
}

const deleteDish = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let dishId = req.params.dishId;
    let response = _setDefaultResponse(process.env.DELETE_CODE, {});

    if (!mongoose.isValidObjectId(restaurantId) || !mongoose.isValidObjectId(dishId)) {
        response.status = process.env.BAD_REQUEST_CODE;
        response.data = { message: process.env.INVALID_TYPE_MESSAGE };
        _sendReponse(res, response)
    }
    _restaurantModelFindByIdExec(restaurantId)
        .then(returnRestaurant => _getIfFoundRestaurant(returnRestaurant))
        .then(restaurant => _deleteDishToSubResturant(restaurant, dishId))
        .then((restaurant) => _restaurantSave(restaurant))
        .then((restaurant) => response.data = restaurant)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => { _sendReponse(res, response) });
}

const updateDishPartial = function (req, res) {
    _updateDish(req, res, _partiallyUpdateDish, process.env.PUT_CODE);
}

const updateDishFull = function (req, res) {
    _updateDish(req, res, response, _fullyUpdateDish, process.env.PUT_CODE);
}

module.exports = { getAllDishes, fineDishById, createDish, updateDishPartial, updateDishFull, deleteDish }