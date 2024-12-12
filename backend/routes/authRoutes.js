require('dotenv').config;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User schema
const validator = require('validator');
const passport = require('../config/passport');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Load secret from .env

const authenticateToken = require('../middleware/authenticateToken'); // Middleware for secured access
const authorizeRole = require('../middleware/authorizeRole');

const rateLimit = require('express-rate-limit');

// Rate limiter for login and registration
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many attempts, please try again after 15 minutes',
});


// Register route
router.post('/api/register', authRateLimiter, async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Registration failed',
                error: 'Email already registered',
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Registration failed',
                error: 'Invalid email format',
            });
        }

        // Validate password strength
        if (password.length < 10) {
            return res.status(400).json({
                message: 'Registration failed',
                error: 'Password must be at least 10 characters long',
            });
        }

        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle unexpected errors
        console.error('Error during registration:', error);
        res.status(500).json({
            message: 'Registration failed',
            error: 'An unexpected error occurred. Please try again later.',
        });
    }
});

// Login route
router.post('/api/login',authRateLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });
        
        // console.error('JWT_Secret=', process.env.JWT_SECRET);
        const token = jwt.sign({ id: user._id, email: user.email, role:user.role }, JWT_SECRET.trim(), { expiresIn: '1h' });
        
        // console.log('JWT token=',token);
        
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error', error);
        
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Fetch all users route
router.get('/api/users', authenticateToken,authorizeRole('admin'), async (req, res) => {
    try {
        // Retrieve all users except passwords
        const users = await User.find({}, '-password'); // Exclude the password field
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});
module.exports = router;

// Delete user (admin-only)
router.delete('/api/users/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const userId = req.params.id;

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Redirect user to Twitter login
router.get('/auth/twitter', passport.authenticate('twitter'));

// Handle Twitter OAuth callback
router.get(
    '/auth/twitter/callback', authRateLimiter,
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: 'Twitter authentication failed' });
            }

            res.json({ message: 'Logged in successfully!', user });
        } catch (error) {
            console.error('Error during Twitter OAuth:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);