const { body } = require('express-validator');

const noteValidator = {
    createNote: [
        body('title')
            .notEmpty().withMessage('Title is required')
            .isString().withMessage('Title must be a string')
            .trim(),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isString().withMessage('Description must be a string')
            .trim()
    ],

    updateNote: [
        body('title')
            .optional()
            .isString().withMessage('Title must be a string')
            .trim(),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string')
    ],
};

module.exports = noteValidator;
