require('dotenv').config();

const express = require('express');
const app = express();

require('./api/data/db');

const PORT = process.env.PORT;

const router = require('./api/routes');


const listenCallBack = function () {
    console.log(`Listen on PORT: ${PORT}`);
    console.log(`${process.env.SERVER_START}`);
}


app.use(process.env.API_SUBSET_ROUTE, function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Allow requests from this origin
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); // Allow these methods
    res.header('Access-Control-Allow-Headers', 'Authorization,Origin,X-Requested-With,Content-Type,Accept'); // Allow these headers
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(process.env.API_SUBSET_ROUTE, router);

app.listen(PORT, listenCallBack);