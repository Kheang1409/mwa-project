const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const userModel = mongoose.model(process.env.USER_MODEL);


const _sendResponse = function (res, response) {
    res.status(Number(response.status)).json(response.data)
}

const _ifFoundAUser = function (user) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (user)
            resolve(user);
        else
            reject(error);
    })
}


const userModelFindByUsernameWith = function (username) {
    return userModel.findOne({ username: username }).exec();
}


const _setDefaultResponse = function (statusCode, data) {
    return response = {
        status: statusCode,
        data: data
    }
}

const _ifPasswordMatch = function (isMatch) {
    const error = {
        status: process.env.INVALID_AUTHERIZED_CODE,
        message: process.env.INVALID_AUTHERIZED_MESSAGE
    }
    return new Promise((resovle, reject) => {
        if (isMatch)
            resovle()
        else
            reject(error)
    })
}

const _setErrorResponse = function (response, status, error) {
    response.status = status;
    response.data = { message: error };
}

const _createToken = function (user) {
    return new Promise((resovle, reject) => {
        try {
            const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET); //, { expiresIn: '1h' }
            resovle(token)
        }
        catch (error) {
            reject(error)
        }
    })
}

const _jwtVerifyWithPromisify = promisify(jwt.verify);



const login = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let response = _setDefaultResponse(process.env.POST_CODE, {});
    userModelFindByUsernameWith(username)
        .then(user => _ifFoundAUser(user))
        .then(user => bcrypt.compare(password, user.password))
        .then(isMatch => _ifPasswordMatch(isMatch))
        .then(() => userModelFindByUsernameWith(username))
        .then(user => _createToken(user))
        .then(token => response.data = { token: token })
        .catch(error => { _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message) })
        .finally(() => _sendResponse(res, response))
}

const isTokenProvided = function (token) {
    const error = {
        status: process.env.NOT_PROVIDE_TOKEN_CODE,
        message: process.env.NOT_PROVIDE_TOKEN_MESSAGE
    }

    return new Promise((resovle, reject) => {
        if (token) {
            resovle(token);
        }
        else {
            reject(error);
        }
    })
}

const isValidToken = function (req, res, next) {
    const token = req.headers[process.env.AUTHORIZATION];
    let response = _setDefaultResponse(process.env.NOT_PROVIDE_TOKEN_CODE, {});
    let isTokenValid = true;
    isTokenProvided(token)
        .then(token => _jwtVerifyWithPromisify(token, process.env.JWT_SECRET))
        .then(data => next())
        .catch(error => { isTokenValid = false; _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message) })
        .finally(() => { if (!isTokenValid) _sendResponse(res, response) })
}

module.exports = {
    login,
    isValidToken,
}