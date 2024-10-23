const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
},
{
    collection: 'user'
})

const User = mongoose.model('User', userSchema);

module.exports = User;

