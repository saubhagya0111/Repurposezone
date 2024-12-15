const mongoose = require('mongoose');

// Define the schema for tweets
const tweetSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Ensure id is unique and required
    text: { type: String, required: true },
    created_at: { type: Date, required: true },
    public_metrics: {
        retweet_count: { type: Number, default: 0 },
        reply_count: { type: Number, default: 0 },
        like_count: { type: Number, default: 0 },
        quote_count: { type: Number, default: 0 },
    },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
console.log('Inside the tweet schema');


module.exports = Tweet;
