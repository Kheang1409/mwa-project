const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = mongoose.model(process.env.USER_MODEL);

const userModelFind = function (offset, count) {
    return userModel.find().skip(offset).limit(count);
}

const userModelCreate = function (userObject) {
    return userModel.create(userObject)
}

const _ifFoundAnyUsers = function (users) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (users.length > 0)
            resolve(users);
        else
            reject(error);
    })
}


const userModelFindByFieldWith = function (searchCriteriaObject) {
    return userModel.findOne(searchCriteriaObject).exec();
}

const _createHashBcrypt = function (password, saltSeed) {
    return new Promise((resolve, rejects) => {
        resolve(bcrypt.hash(password, saltSeed));
    })
}

const _createUserObject = function (req, password) {
    return new Promise((resolve, rejects) => {
        const newUser = {
            name: req.body.name,
            username: req.body.username,
            password: password
        }
        console.log(newUser);
        resolve(newUser);
    })
}

const _setDefaultResponse = function (statusCode, data) {
    return response = {
        status: statusCode,
        data: data
    }
}

const _sendResponse = function (res, response) {
    res.status(Number(response.status)).json(response.data)
}

const _setErrorResponse = function (response, status, error) {
    response.status = status;
    response.data = { message: error };
}

const getUsers = function (req, res) {
    let count = process.env.OFFSET;
    let offset = process.env.OFFSET;
    let limit = process.env.LIMIT;;

    let response = _setDefaultResponse(process.env.GET_CODE, {})

    if (req.query && req.query.offset) {
        if (isNaN(req.query.offset) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            offset = parseInt(req.query.offset);
        }
    }

    if (req.query && req.query.limit) {
        if (isNaN(req.query.limit) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            limit = parseInt(req.query.limit);
            if (count > limit) {
                _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OVER_LIMIT_MESSAGE)
            }
        }
    }
    if (response.status != process.env.GET_CODE) {
        _sendResponse(res, response)
    }
    userModelFind(offset, count)
        .then(users => _ifFoundAnyUsers(users))
        .then(users => response.data = users)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message))
        .finally(() => _sendResponse(res, response));
}

const _ifUsernameTaken = function (username) {
    const error = {
        status: process.env.USER_EXISTED,
        message: process.env.ALREADY_EXISTED_MESSAGE
    }
    return new Promise((resovle, reject) => {
        console.log(username)
        if (username != null) {
            reject(error)
        } else {
            resovle()
        }
    })
}

const createUser = function (req, res) {
    let response = _setDefaultResponse(process.env.POST_CODE, {})
    if ((req.body.username == null && req.body.username == '') || (req.body.password == null && req.body.username == '')) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.BAD_REQUEST_MESSAGE)
    }
    if (response.status != process.env.POST_CODE) {
        _sendResponse(res, response)
    }
    userModelFindByFieldWith({ username: req.body.username })
        .then(user => _ifUsernameTaken(user))
        .then(() => bcrypt.genSalt(process.env.SALT_SET))
        .then(saltSeed => _createHashBcrypt(req.body.password, saltSeed))
        .then(hashedPassword => _createUserObject(req, hashedPassword))
        .then(createdUserObject => userModelCreate(createdUserObject))
        .then(createdUser => response.data = createdUser)
        .catch(error => { _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message) })
        .finally(() => _sendResponse(res, response));

}

module.exports = {
    createUser,
    getUsers
}