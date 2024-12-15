const express = require('express');
const Tweet = require('../models/Tweet'); // Import Tweet schema
const { scrapeTweet, closeDriver } = require('../services/scrapeTweet'); // Import scraper utility
const rateLimit = require('express-rate-limit');
const router = express.Router();

// In-memory cache (Map)
const tweetCache = new Map();
const CACHE_TTL = 3600 * 1000; // Cache Time-to-Live: 1 hour

// Middleware to clean up expired cache entries
setInterval(() => {
    const now = Date.now();
    for (const [key, { timestamp }] of tweetCache) {
        if (now - timestamp > CACHE_TTL) {
            tweetCache.delete(key);
        }
    }
}, 60000); // Clean every 60 seconds

// router.post('/api/fetch-tweet', async (req, res) => {
//     try {
//         const { tweetUrl } = req.body;

//         if (!tweetUrl) {
//             return res.status(400).json({ error: 'Tweet URL is required' });
//         }

//         // Extract Tweet ID
//         const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
//         if (!tweetIdMatch) {
//             return res.status(400).json({ error: 'Invalid Tweet URL format' });
//         }
//         const tweetId = tweetIdMatch[1];

//         // Check the in-memory cache
//         if (tweetCache.has(tweetId)) {
//             console.log('Cache hit for tweet:', tweetId);
//             return res.status(200).json({
//                 message: 'Tweet fetched from cache',
//                 tweet: tweetCache.get(tweetId).data,
//             });
//         }

//         console.log('Cache miss for tweet:', tweetId);

//         // Check MongoDB
//         const existingTweet = await Tweet.findOne({ tweetId });
//         if (existingTweet) {
//             // Store in cache and return
//             tweetCache.set(tweetId, { data: existingTweet, timestamp: Date.now() });
//             return res.status(200).json({ message: 'Tweet already saved', tweet: existingTweet });
//         }

//         // Fetch from scraper
//         const scrapedTweet = await scrapeTweet(tweetUrl);
//         if (!scrapedTweet || !scrapedTweet.text) {
//             return res.status(404).json({ error: 'Scraper failed to fetch the tweet' });
//         }

//         // Save to MongoDB
//         const newTweet = new Tweet({
//             tweetId,
//             text: scrapedTweet.text,
//             media: scrapedTweet.media || [],
//             // author: scrapedTweet.author || '@unknown',
//             createdAt: scrapedTweet.timestamp,
//         });

//         await newTweet.save();

//         // Save to cache
//         tweetCache.set(tweetId, { data: newTweet, timestamp: Date.now() });

//         res.status(201).json({ message: 'Tweet scraped and saved successfully', tweet: newTweet });
//     } catch (error) {
//         console.error('Error in /fetch-tweet:', error.stack || error.message);
//         res.status(500).json({
//             error: 'Internal server error',
//             details: error.message,
//         });
//     }
// });

module.exports = router;
