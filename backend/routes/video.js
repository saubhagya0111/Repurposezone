const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

router.post("/generate-video", (req, res) => {
    const { tweetText } = req.body;

    if (!tweetText) {
        return res.status(400).json({ error: "Tweet text is required" });
    }

    const command = `manim -pql tweet_video.py TweetVideo "${tweetText}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Error generating video:", error);
            return res.status(500).json({ error: "Failed to generate video" });
        }

        const videoPath = path.join(
            __dirname,
            "../media/videos/tweet_video/480p15/TweetVideo.mp4"
        );

        res.json({ success: true, videoPath });
    });
});

module.exports = router;
