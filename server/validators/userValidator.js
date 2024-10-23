const { body, param } = require('express-validator');

const userValidator = {
    createAccount: [
        body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').isString().withMessage('Password must be a string'),
        body('email').isEmail().withMessage('Email must be valid').isString().withMessage('Email must be a string')
    ],
    logIn: [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a string'),
        body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
    ],
    update: [
        param('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('ID must be a valid MongoID'),
        body('username').optional().notEmpty().withMessage('Username cannot be empty').isString().withMessage('Username must be a string'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').isString().withMessage('Password must be a string'),
        body('email').optional().isEmail().withMessage('Email must be valid').isString().withMessage('Email must be a string')
    ]
};

module.exports = userValidator;