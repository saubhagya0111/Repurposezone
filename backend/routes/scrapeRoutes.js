const express = require('express');
const { scrapeTweet, closeDriver } = require('../services/scrapeTweet');
const rateLimit = require('express-rate-limit');


const router = express.Router();
const scrapeRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8, // Limit each IP to 10 requests per windowMs
    message: 'Too many attempts, please try again after 15 minutes',
});

// Route: Fetch tweet details
router.post('/fetch-tweet', scrapeRateLimiter, async (req, res) => {
    const { tweetUrl } = req.body;

    if (!tweetUrl) {
        return res.status(400).json({ error: 'Tweet URL is required.' });
    }

    try {
        const tweetData = await scrapeTweet(tweetUrl);
        res.status(200).json(tweetData);
    } catch (error) {
        console.error('Error scraping tweet:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
