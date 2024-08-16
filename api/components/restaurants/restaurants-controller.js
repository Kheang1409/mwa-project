const mongoose = require('mongoose');

const RESTAURANT_MODEL = process.env.RESTAURANT_MODEL;

const restaurantModel = mongoose.model(RESTAURANT_MODEL);

const restaurantModelFindSkipLimitExec = function (query, offset, count) {
    return restaurantModel.find(query).skip(offset).limit(count).exec();
}

const restaurantModelFindByIdExec = function (id) {
    return restaurantModel.findById(id).exec();
}

const restaurantModelCreate = function (newRestaurant) {
    return restaurantModel.create(newRestaurant)
}

const restaurantSave = function (restaurant) {
    return restaurant.save();
}

const restaurantModelFindByIdAndDeleteExec = function (id) {
    return restaurantModel.findByIdAndDelete(id).exec();
}

const restaurantModelFindAndCountExec = function (query) {
    return restaurantModel.find(query).countDocuments();
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

const _IfFoundAnyRestaurants
    = function (restaurants) {
        const error = {
            status: process.env.NOT_FOUND_CODE,
            message: process.env.NOT_FOUND_MESSAGE
        }
        return new Promise((resolve, reject) => {
            if (restaurants.length > process.env.EMPTY)
                resolve(restaurants);
            else
                reject(error);
        })
    }

const _IfFoundARestaurant = function (restaurant) {
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



const _fullUpdate = function (req, restaurant) {
    restaurant.name = req.body.name;
    restaurant.publishedYear = req.body.publishedYear;
    restaurant.location = req.body.location;
    restaurant.dishes = req.body.dishes;
    restaurant.logo = req.body.logo;
    restaurant.about = req.body.about;

    return new Promise(resolve => {
        resolve(restaurant)
    })
}

const _partialUpdate = function (req, restaurant) {
    if (req.body && req.body.name) restaurant.name = req.body.name;
    if (req.body && req.body.publishedYear) restaurant.publishedYear = req.body.publishedYear;
    if (req.body && req.body.location) restaurant.location = req.body.location;
    if (req.body && req.body.dishes) restaurant.dishes = req.body.dishes;
    if (req.body && req.body.logo) restaurant.logo = req.body.logo;
    if (req.body && req.body.about) restaurant.about = req.body.about;

    return new Promise(resolve => {
        resolve(restaurant)
    })
}

const _updateRestaurant = function (req, res, callBack, STATUS_CODE) {
    let restaurantId = req.params.restaurantId;
    let response = _setDefaultResponse(STATUS_CODE, {})
    if (!mongoose.isValidObjectId(restaurantId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE)
    }
    if (response.status != STATUS_CODE) {
        _sendReponse(res, response)
    }

    restaurantModelFindByIdExec(restaurantId)
        .then(restaurant => _IfFoundARestaurant(restaurant))
        .then(restaurant => callBack(req, restaurant))
        .then(restaurant => restaurantSave(restaurant))
        .then(restaurant => response.data = restaurant)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

const _setGeoSearch = function (let, len) {
    return query = {
        'publisher.location.coordinates': {
            $near: {
                $geometry: {
                    type: process.env.GEOMETRY_TYPE,
                    coordinates: [let, len]
                },
                $maxDistance: process.env.MAX_DISTANCE,
                $minDistance: process.env.MIN_DISTANCE
            }
        }
    }
}

const getAllRestaurant = function (req, res) {
    let count = process.env.COUNT;
    let offset = process.env.OFFSET;
    let limit = process.env.LIMIT;;
    let response = _setDefaultResponse(process.env.GET_CODE, {})
    let pageNumber = process.env.PAGE;
    let query = {};
    if (req.query.lat && req.query.len) {
        query = _setGeoSearch(req.query.len, eq.query.lat)
    }
    if (req.query && req.query.name) {
        query = { name: new RegExp(req.query.name, 'i') }
    }
    if (req.query && req.query.offset) {
        if (isNaN(req.query.offset) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            offset = parseInt(req.query.offset);
        }
    }

    if (req.query && req.query.pageNumber) {
        if (isNaN(req.query.pageNumber) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            pageNumber = parseInt(req.query.pageNumber);
        }
    }


    if (req.query && req.query.limit) {
        if (isNaN(req.query.limit) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            limit = parseInt(req.query.limit);
            if (count > LIMIT) {
                _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OVER_LIMIT_MESSAGE)
            }
        }
    }
    if (response.status != process.env.GET_CODE) {
        _sendReponse(res, response)
    }

    if (pageNumber > 1)
        offset = count * (pageNumber - 1);
    restaurantModelFindSkipLimitExec(query, offset, count)
        .then(restaurants => _IfFoundAnyRestaurants(restaurants))
        .then(restaurants => response.data = restaurants)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

const getRestaurantById = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let response = _setDefaultResponse(process.env.GET_CODE, {})

    if (!mongoose.isValidObjectId(restaurantId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE)
    }
    if (response.status != process.env.GET_CODE) {
        _sendReponse(res, response)
    }
    restaurantModelFindByIdExec(restaurantId)
        .then(restaurant => _IfFoundARestaurant(restaurant))
        .then(restaurant => response.data = restaurant)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

const restaurantObject = function (req) {
    let newRestaurant = {
        name: req.body.name,
        publishedYear: req.body.publishedYear,
        location: req.body.location,
        dishes: req.body.dishes,
        logo: req.body.logo,
        about: req.body.about,
    }
    return new Promise(resovle => {
        resovle(newRestaurant)
    })
}



const createRestaurant = function (req, res) {
    let response = _setDefaultResponse(process.env.POST_CODE, {})
    restaurantObject(req)
        .then(newRestaurant => restaurantModelCreate(newRestaurant))
        .then(createdRestaurant => response.data = createdRestaurant)
        .catch(error => _setErrorResponse(response, process.env.BAD_REQUEST_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

const updateRestaurantPartial = function (req, res) {
    _updateRestaurant(req, res, _partialUpdate, process.env.PATCH_CODE);
}

const updateRestaurantFull = function (req, res) {
    _updateRestaurant(req, res, _fullUpdate, process.env.PUT_CODE);
}

const deleteRestaurant = function (req, res) {
    let restaurantId = req.params.restaurantId;
    let response = _setDefaultResponse(process.env.DELETE_CODE, {})

    if (!mongoose.isValidObjectId(restaurantId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE)
    }
    if (response.status != process.env.DELETE_CODE) {
        _sendReponse(res, response)
    }
    restaurantModelFindByIdAndDeleteExec(restaurantId)
        .then(deletedRestaurant => _IfFoundARestaurant(deletedRestaurant))
        .then(deletedRestaurant => response.data = deletedRestaurant)
        .catch(error => _setErrorResponse(response, process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

const getTotalRestaurants = function (req, res) {
    let response = _setDefaultResponse(process.env.GET_CODE, {})
    let query = {};
    if (req.query && req.query.name) {
        query = { name: new RegExp(req.query.name, 'i') }
    }
    restaurantModelFindAndCountExec(query)
        .then(totalRestaurants => response.data = totalRestaurants)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
        .finally(() => _sendReponse(res, response));
}

module.exports = { getAllRestaurant, getRestaurantById, createRestaurant, updateRestaurantPartial, updateRestaurantFull, deleteRestaurant, getTotalRestaurants }