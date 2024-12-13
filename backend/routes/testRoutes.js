const express = require("express");
const openai = require("../config/openai");

const router = express.Router();

router.post("/test-openai", async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4", // Use "gpt-3.5-turbo" if GPT-4 is not available
            messages: [
                {
                    role: "user",
                    content: "Say hello in a creative way.",
                },
            ],
        });

        res.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
