const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Load from .env

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // Attach user to request
        next();
    });
};

module.exports = authenticateToken;
