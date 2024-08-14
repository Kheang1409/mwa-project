const mongoose = require('mongoose');
const userModel = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    }
});
mongoose.model(process.env.USER_MODEL, userModel, process.env.USER_COLLECTION);