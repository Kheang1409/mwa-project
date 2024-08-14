const express = require('express');
const router = express.Router({ mergeParams: true });
const restaurantsRouter = require('./../components/restaurants/restaurants-routes')
const usersRouter = require('./../components/users/users-routes')

router.use(process.env.URL_RESTAURANTS, restaurantsRouter)
router.use(process.env.URL_USERS, usersRouter)

module.exports = router;