const express = require("express");

const router = express.Router();

router.post("/transform-content", (req, res) => {
    const { tweet } = req.body;

    if (!tweet) {
        return res.status(400).json({ error: "Tweet text is required" });
    }

    try {
        // Use the tweet text as the caption and video script
        const videoCaption = tweet; // Directly use the tweet as the video text
        const socialMediaCaption = tweet; // Use the same for social media platforms

        // Return the repurposed content
        res.json({
            videoCaption,
            socialMediaCaption,
        });
    } catch (error) {
        console.error("Error in content repurposing:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
