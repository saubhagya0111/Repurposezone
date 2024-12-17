const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();

router.post("/generate-video", (req, res) => {
    const { tweetText, userName, userHandle, template } = req.body;

    if (!tweetText || !template) {
        return res.status(400).json({ error: "Tweet text and template are required." });
    }

    // Set environment variables for Manim
    const env = {
        ...process.env,
        TWEET_TEXT: tweetText,
        USER_NAME: userName || "Unknown User",
        USER_HANDLE: userHandle || "@unknown",
    };

    // Define path to template files
    const templateDir = path.join(__dirname, "../templates");
    const templateFile = template === "detailed" ? "detailed_template.py" : "simple_template.py";

    // Run Manim command with full path to template
    const manimProcess = spawn("manim", ["-pql", path.join(templateDir, templateFile), "TweetVideo"], { env });

    manimProcess.stdout.on("data", (data) => console.log(`Manim: ${data}`));
    manimProcess.stderr.on("data", (data) => console.error(`Manim Error: ${data}`));

    manimProcess.on("close", (code) => {
        if (code === 0) {
            const videoPath = "/videos/TweetVideo.mp4";
            res.json({ success: true, videoPath });
        } else {
            res.status(500).json({ error: "Video generation failed." });
        }
    });
});

module.exports = router;
