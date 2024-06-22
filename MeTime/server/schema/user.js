const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema
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
    },
    otp: { 
        type: String,
        default: ''
    },
    otpExpiresAt: { 
        type: Number,
        default: ''
      }

}, {
    collection: 'user_info'
});

// create user model
const User = mongoose.model('User', UserSchema);

module.exports = User;
