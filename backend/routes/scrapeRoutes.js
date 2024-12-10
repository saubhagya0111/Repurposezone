const express = require('express');
const { scrapeTweet, closeDriver } = require('../services/scrapeTweet');


const router = express.Router();

// Route: Fetch tweet details
router.post('/fetch-tweet', async (req, res) => {
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
