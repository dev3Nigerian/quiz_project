const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Create a signed token that the client can use on protected routes.
function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        }
    );
}

// Send back safe user data without the password hash.
function buildUserResponse(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
    };
}

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // Stop early if the basic fields are missing.
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Clean the email so login and register use the same format.
        const normalizedEmail = email.trim().toLowerCase();
        const existingUsers = await query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Store a hashed password, not the plain password.
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name.trim(), normalizedEmail, passwordHash, 'user']
        );

        // Read the new user back from the database.
        const users = await query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        const user = users[0];
        const token = createToken(user);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: buildUserResponse(user)
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Login also needs both fields.
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Use the same email format used during registration.
        const normalizedEmail = email.trim().toLowerCase();
        const users = await query(
            'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];
        // Compare the plain password with the saved hashed password.
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = createToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: buildUserResponse(user)
        });
    } catch (error) {
        next(error);
    }
}

async function getProfile(req, res, next) {
    try {
        // req.user comes from the JWT after authMiddleware verifies it.
        const users = await query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: buildUserResponse(users[0])
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getProfile
};