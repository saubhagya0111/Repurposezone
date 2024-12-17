const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();

router.post("/generate-video", (req, res) => {
    const { tweetText } = req.body;

    if (!tweetText) {
        return res.status(400).json({ error: "Tweet text is required" });
    }

    const env = { ...process.env, TWEET_TEXT: tweetText };

    const manimProcess = spawn("manim", ["-pql", "tweet_video.py", "TweetVideo"], { env });

    manimProcess.stdout.on("data", (data) => console.log(`Manim: ${data}`));
    manimProcess.stderr.on("data", (data) => console.error(`Manim Error: ${data}`));

    manimProcess.on("close", (code) => {
        if (code === 0) {
            const videoPath = "/videos/tweet_video/480p15/TweetVideo.mp4";
            res.json({ success: true, videoPath });
        } else {
            res.status(500).json({ error: "Video generation failed" });
        }
    });
});

module.exports = router;
