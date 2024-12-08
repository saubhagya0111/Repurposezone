const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/api/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected route', user: req.user });
});

module.exports = router;
