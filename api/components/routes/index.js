const express = require('express');
const router = express.Router({ mergeParams: true });
const restaurantsRouter = require('./../restaurants/restaurants-routes')

require('dotenv').config();

router.use(process.env.URL_RESTAURANTS, restaurantsRouter)

module.exports = router;