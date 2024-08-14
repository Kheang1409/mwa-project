const mongoose = require('mongoose');
const callBackify = require('util').callbackify;
require('../components/restaurants/restaurant-model')
require('../components/users/user-model')

const disconnectedCallback = callBackify(mongoose.disconnect);

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

mongoose.connection.on(process.env.DB_CONNECTED_METHOD, function () {
    console.log(process.env.DB_CONNECTED);
})

mongoose.connection.on(process.env.DB_DICONNECTED_METHOD, function () {
    console.log(process.env.DB_DISCONNECTED);
})

mongoose.connection.on(process.env.DB_EORROR_METHOD, function () {
    console.log(process.env.DB_CONNECTED_ERROR);
})

mongoose.connection.on(process.env.DB_ON_SIGINT_METHOD, function () {
    console.log(process.env.DB_CONNECTION_PROBLEM);
    disconnectedCallback(function () {
        process.exit(0);
    });
})

mongoose.connection.on(process.env.DB_ON_SIGTERM_METHOD, function () {
    console.log(process.env.DB_CONNECTION_PROBLEM);
    disconnectedCallback(function () {
        process.exit(0);
    });
})

mongoose.connection.on(process.env.DB_ON_SIGURS2_METHOD, function () {
    console.log(process.env.DB_CONNECTION_PROBLEM);
    disconnectedCallback(function () {
        process.exit(0);
    });
})