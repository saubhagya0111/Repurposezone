const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema(
    {
        tweetId: {
            type: String,
            required: true,
            unique: true, // Prevent duplicate tweets
        },
        text: {
            type: String,
            required: true,
        },
        media: [String], // Array of media URLs (if any)
        author: {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Tweet', TweetSchema);
    