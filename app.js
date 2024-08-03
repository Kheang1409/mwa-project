const express = require('express');
const app = express();

require('./api/data/db');
require('dotenv').config();

const PORT = process.env.PORT;

const router = require('./api/routes');
const listenCallBack = function () {
    console.log(`Listen on PORT: ${PORT}`);
    console.log(`${process.env.SERVER_START}`);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(process.env.UR_SUBSET_ROUTE, router);

app.listen(PORT, listenCallBack);