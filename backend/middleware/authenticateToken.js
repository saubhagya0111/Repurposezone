const jwt = require('jsonwebtoken');
const User=require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET; // Load from .env

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = {
            id: user._id,
            email: user.email,  
            role: user.role,
        }
        next();
    } catch (error) {
        if (error.name == 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired', expiredAt: error.expiredAt });         
        }
        console.error('Token Verification Error', error);
        res.status(403).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticateToken;
