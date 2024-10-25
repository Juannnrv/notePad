const express = require('express');
const { createAccount, logIn, updateUser, deleteUser } = require('../controllers/userController');
const userValidator = require('../validators/userValidator');
const { versioning } = require('../middleware/versioning');
const { limit } = require('../middleware/requestLimit');
const user = express.Router();

user.post('/create', limit('post', '/create'), versioning('1.0.0'), userValidator.createAccount, createAccount);
user.post('/login', versioning('1.0.0'), userValidator.logIn, logIn);
user.put('/:id', limit('put', '/:id'), versioning('1.0.0'), userValidator.update, updateUser);
user.delete('/:id', limit('delete', '/:id'), versioning('1.0.0'), deleteUser);

module.exports = user;