const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const tokenJwt = require('../middleware/tokenJwt');

class UserController {
    /**
     * Creates a new user account.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the user account is created.
     */
    static async createAccount(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const { username, password, email } = req.body;
        try {
            const user = await User.create({ username, password, email });
            res.status(201).json({ status: 201, message: 'User account created successfully', user });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error creating user account', error: error.message });
        }
    }

    /**
     * Logs in a user generating a authetication token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the user is logged in.
     */
    static async logIn(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email, password });
            if (!user) {
                return res.status(404).json({ status: 404, message: 'Invalid email or password, please check and try again' });
            }

            const token = tokenJwt.generateToken({ _id: user._id });

            res.status(200).json({ status: 200, message: 'User logged in successfully', token });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error logging in user', error: error.message });
        }
    }

    /**
     * Updates a user account.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the user account is updated.
     */
    static async updateUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const { id } = req.params;
        const { username, password, email } = req.body;
        try {
            const user = await User.findByIdAndUpdate(id, { username, password, email }, { new: true });
            if (!user) {
                return res.status(404).json({ status: 404, message: 'User not found' });
            }
            res.status(200).json({ status: 200, message: 'User account updated successfully', user });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error updating user account', error: error.message });
        }
    }

    /**
     * Deletes a user account.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the user account is deleted.
     */
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ status: 404, message: 'User not found' });
            }
            res.status(200).json({ status: 200, message: 'User account deleted successfully', user });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error deleting user account', error: error.message });
        }
    }
}

module.exports = UserController;