const express = require('express');
const {
    register,
    login,
    getProfile
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new user account.
router.post('/register', register);
// Log in and return a JWT token.
router.post('/login', login);
// Return the logged-in user's profile.
router.get('/profile', authMiddleware, getProfile);

module.exports = router;