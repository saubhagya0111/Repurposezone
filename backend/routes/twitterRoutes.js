const express = require('express');
const { fetchTweetsFromUser } = require('../services/twitterService'); // Import the service

const router = express.Router();

/**
 * GET /api/twitter/:username
 * Fetch tweets from a specific user
 */
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const tweets = await fetchTweetsFromUser(username);
        res.status(200).json({ success: true, tweets });
    } catch (error) {
        console.error("Error in /api/twitter/:username route:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
