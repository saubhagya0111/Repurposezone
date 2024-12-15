const express = require('express');
const { saveTweetsToDB } = require('../services/saveTweetsToDB'); // DB service function
const mockTweets = require('../mockData/tweets.json'); // Import mock data

const router = express.Router();

/**
 * GET /api/twitter/save-tweets
 * Save mock tweets to the database
 */
router.get('/save-tweets', async (req, res) => {
    try {
        console.log('Mock Tweets Loaded:', mockTweets); // Log to ensure data loads
        await saveTweetsToDB(mockTweets.data); // Save tweets to the database
        res.status(200).json({ success: true, message: 'Mock tweets saved successfully.' });
    } catch (error) {
        console.error('Error in /api/twitter/save-tweets route:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * GET /api/twitter/mock-tweets
 * Fetch mock tweets (for testing)
 */
router.get('/mock-tweets', (req, res) => {
    try {
        res.status(200).json({ success: true, tweets: mockTweets });
    } catch (error) {
        console.error('Error in /api/twitter/mock-tweets route:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
