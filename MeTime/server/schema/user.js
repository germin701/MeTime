const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User schema
const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'user_info'
});

// Create User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
