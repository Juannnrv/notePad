const express = require('express');
const { createAccount, logIn, updateUser, deleteUser } = require('../controllers/userController');
const userValidator = require('../validators/userValidator');
const { versioning } = require('../middleware/versioning');
const user = express.Router();

user.post('/create', versioning('1.0.0'), userValidator.createAccount, createAccount);
user.post('/login', versioning('1.0.0'), userValidator.logIn, logIn);
user.put('/:id', versioning('1.0.0'), userValidator.update, updateUser);
user.delete('/:id', versioning('1.0.0'), deleteUser);

module.exports = user;