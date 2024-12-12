const express = require('express');
const Tweet = require('../models/Tweet'); // Import Tweet schema
const { scrapeTweet,closeDriver } = require('../services/scrapeTweet'); // Import scraper utility
const router = express.Router();

/// Utility function to validate URLs
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

router.post('/api/fetch-tweet', async (req, res) => {
    try {
        const { tweetUrl } = req.body;

        // Validate the tweetUrl
        if (!tweetUrl) {
            return res.status(400).json({ error: 'Tweet URL is required' });
        }

        console.log(`Fetching tweet from URL: ${tweetUrl}`);

        // Scrape the tweet
        const scrapedTweet = await scrapeTweet(tweetUrl);

        if (!scrapedTweet || !scrapedTweet.text || !scrapedTweet.timestamp) {
            return res.status(404).json({ error: 'Scraper returned incomplete data' });
        }

        console.log('Scraped tweet data:', scrapedTweet);

        // Regex to extract tweetId and author from both twitter.com and x.com
        const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
        const authorMatch = tweetUrl.match(/(?:twitter\.com|x\.com)\/([^/]+)\//);

        if (!tweetIdMatch || !authorMatch) {
            return res.status(400).json({ error: 'Invalid Tweet URL format' });
        }

        const tweetId = tweetIdMatch[1];
        const author = `@${authorMatch[1]}`;

        // Check if the tweet already exists in the database
        const existingTweet = await Tweet.findOne({ tweetId });
        if (existingTweet) {
            return res.status(200).json({ message: 'Tweet already saved', tweet: existingTweet });
        }

        // Save the new tweet
        const newTweet = new Tweet({
            tweetId,
            text: scrapedTweet.text,
            media: scrapedTweet.media || [],
            author,
            createdAt: scrapedTweet.timestamp,
        });

        console.log('Saving new tweet to the database:', newTweet);

        await newTweet.save();

        res.status(201).json({ message: 'Tweet scraped and saved successfully', tweet: newTweet });
    } catch (error) {
        console.error('Error in /api/fetch-tweet:', error.stack || error.message);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
});

module.exports = router;