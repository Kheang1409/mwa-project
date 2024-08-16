const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    picture: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const locationSchema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

const restaurantSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: locationSchema,
        required: true
    },
    dishes: {
        type: [dishSchema],
        required: true
    },
    logo: {
        type: String,
        required: true

    },
    about: {
        type: String,
        required: true
    }
})

const RESTAURANT_MODEL = process.env.RESTAURANT_MODEL;
const RESTAURANT_COLLECTION = process.env.RESTAURANT_COLLECTION;
mongoose.model(RESTAURANT_MODEL, restaurantSchema, RESTAURANT_COLLECTION);