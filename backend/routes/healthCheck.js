const express = require('express');
const router = express.Router();

// Health-check route
router.get('/health-check', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is running smoothly!',
        environment: process.env.NODE_ENV || 'development', // To verify environment
    });
});

module.exports = router;
