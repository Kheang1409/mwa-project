require('dotenv').config();

const express = require('express');
const app = express();

require('./api/data/db');

const PORT = process.env.PORT;

const router = require('./api/routes');


const listenCallBack = function () {
    console.log(`${process.env.LISTEN_ON_PORT} ${PORT}`);
    console.log(`${process.env.SERVER_START}`);
}


app.use(process.env.API_SUBSET_ROUTE, function (req, res, next) {
    res.header(process.env.ACCESS_CONTROL_ALLOW_ORIGIN, process.env.APPLICATION);
    res.header(process.env.CONTROL_ALLOW_METHODS, process.env.METHODS);
    res.header(process.env.ACCESS_CONTROL_ALLOW_HEADERS, process.env.HEADERS);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(process.env.API_SUBSET_ROUTE, router);

app.listen(PORT, listenCallBack);