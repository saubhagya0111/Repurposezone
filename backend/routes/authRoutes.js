require('dotenv').config;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User schema
const validator = require('validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Load secret from .env

const authenticateToken = require('../middleware/authenticateToken'); // Middleware for secured access
const authorizeRole = require('../middleware/authorizeRole');


// Register route
router.post('/api/register', async (req, res) => {
    const { name, email, password, role='user' } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email format is invalid' });
        }
        if (password.length < 10) {
            return res.status(400).json({ message: 'Password must be at least 10 charecters' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log('Request Body->', req.body);        
        console.error('Error during registration',error);
        console.error('Error->',error);        
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login route
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });
        
        // console.error('JWT_Secret=', process.env.JWT_SECRET);
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET.trim(), { expiresIn: '1h' });
        
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
