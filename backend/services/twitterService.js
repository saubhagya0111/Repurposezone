const axios = require('axios');

/**
 * Fetch tweets from a specific user using Twitter API v2
 * @param {string} username - The Twitter username to fetch tweets from
 * @returns {Promise<Object>} - List of tweets with metadata
 */
const fetchTweetsFromUser = async (username) => {
    try {
        const url = `https://api.twitter.com/2/tweets/search/recent`;

        // Query parameters for the Twitter API
        const params = {
            query: `from:${username}`, // Filter tweets from the specific user
            max_results: 10, // Fetch up to 10 recent tweets
            "tweet.fields": "created_at,public_metrics,text", // Include additional fields
        };

        // API headers
        const headers = {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`, // Load token from .env
        };

        console.log('Authorisation Header', headers);
        

        // Make API call
        const response = await axios.get(url, { headers, params });

        return response.data; // Return tweets data
    } catch (error) {
        console.error("Error fetching tweets:", error.response?.data || error.message);
        throw new Error("Failed to fetch tweets");
    }
};

module.exports = { fetchTweetsFromUser };
