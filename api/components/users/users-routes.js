const express = require('express');
const router = express.Router();
const controller = require('./users-controller');
const auth_controller = require('./../authentication/authentication-controller')

router.route(process.env.URL_EMPTY)
    .get(controller.getUsers)
    .post(controller.createUser)

router.route(process.env.URL_USERS_LOGIN)
    .post(auth_controller.login)

module.exports = router;