const { body, param } = require('express-validator');

const noteValidator = {
    createNote: [
        body('title')
            .notEmpty().withMessage('Title is required')
            .isString().withMessage('Title must be a string')
            .trim(),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isString().withMessage('Description must be a string')
            .trim(),
        body('user_id')
            .notEmpty().withMessage('User ID is required')
            .isMongoId().withMessage('User ID must be a valid MongoDB Object ID'),
        body('changes.*.title')
            .optional()
            .isString().withMessage('Change title must be a string'),
        body('changes.*.description')
            .optional()
            .isString().withMessage('Change description must be a string'),
        body('changes.*.date')
            .optional()
            .isISO8601().withMessage('Change date must be a valid ISO 8601 date format'),
    ],

    updateNote: [
        param('id')
            .notEmpty().withMessage('Note ID is required')
            .isMongoId().withMessage('Note ID must be a valid MongoDB Object ID'),
        body('title')
            .optional()
            .isString().withMessage('Title must be a string')
            .trim(),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string')
            .trim(),
        body('user_id')
            .optional()
            .isMongoId().withMessage('User ID must be a valid MongoDB Object ID'),
        body('status')
            .optional()
            .isIn(['visible', 'hidden']).withMessage('Status must be either "visible" or "hidden"'),
        body('changes.*.title')
            .optional()
            .isString().withMessage('Change title must be a string'),
        body('changes.*.description')
            .optional()
            .isString().withMessage('Change description must be a string'),
        body('changes.*.date')
            .optional()
            .isISO8601().withMessage('Change date must be a valid ISO 8601 date format'),
    ],
};

module.exports = noteValidator;
