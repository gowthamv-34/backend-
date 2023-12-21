const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: Number,
    gender: String,
    dob: String,
    mobile: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;