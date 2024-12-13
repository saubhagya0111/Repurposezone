require('dotenv').config();
const OpenAI = require("openai");

// Create an OpenAI instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key
});

module.exports = openai;
