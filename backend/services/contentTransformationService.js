const openai = require("../config/openai");

const transformContent = async (prompt) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 100,
        });
        return response.data.choices[0].text;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { transformContent };
