const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Route: Generate TikTok-style Video
router.post("/generate-video", (req, res) => {
    const { tweet_text, user_name, user_handle, profile_url } = req.body;

    if (!tweet_text || !user_name || !user_handle || !profile_url) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Pass inputs as environment variables
    process.env.TWEET_TEXT = tweet_text;
    process.env.USER_NAME = user_name;
    process.env.USER_HANDLE = user_handle;
    process.env.PROFILE_URL = profile_url;

    const scriptPath = path.join(__dirname, "../scripts/generate_tiktok_video.py");

    // Run the Python script
    const pythonProcess = spawn("python", [scriptPath]);

    pythonProcess.stdout.on("data", (data) => console.log(`Python: ${data}`));
    pythonProcess.stderr.on("data", (data) => console.error(`Error: ${data}`));

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            const baseDir = path.resolve(__dirname, "../"); // Correct base directory
            const safeUsername = user_name.replace(/[^a-zA-Z0-9]/g, "_");
            console.log("Scanning directory:", baseDir);

            // Find the video file matching the username
            const videoFile = fs.readdirSync(baseDir).find(file =>
                file.startsWith(safeUsername) && file.endsWith(".mp4")
            );

            if (videoFile) {
                return res.status(200).json({
                    message: "Video generated successfully",
                    video_url: `/videos/${videoFile}`
                });
            } else {
                return res.status(500).json({ error: "Video file not found" });
            }
        } else {
            return res.status(500).json({ error: "Video generation failed" });
        }
    });
});

module.exports = router;
