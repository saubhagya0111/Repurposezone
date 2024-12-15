const Tweet = require('../models/Tweet'); // Import the Tweet model

const saveTweetsToDB = async (tweets) => {
    try {
        // Filter out invalid tweets with null or missing IDs
        const validTweets = tweets.filter((tweet) => tweet.id);

        if (validTweets.length === 0) {
            console.log("No valid tweets to save.");
            return;
        }

        console.log("Saving valid tweets to database:", validTweets);

        const operations = validTweets.map((tweet) => ({
            updateOne: {
                filter: { id: tweet.id },
                update: tweet,
                upsert: true, // Insert if not already present
            },
        }));

        const result = await Tweet.bulkWrite(operations); // Use bulkWrite for efficiency
        console.log("Database save result:", result);
    } catch (error) {
        console.error("Error saving tweets to the database:", error.message);
        throw new Error("Failed to save tweets to the database.");
    }
};

module.exports = { saveTweetsToDB };


module.exports = { saveTweetsToDB };
