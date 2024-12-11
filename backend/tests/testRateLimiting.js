const axios = require('axios');

const endpoint = 'http://localhost:5000/api/scrape/fetch-tweet'; // Replace with your actual endpoint
const tweetUrl = 'https://x.com/TellYourSonThis/status/1861593349637251148';

async function testRateLimiting() {
    let successCount = 0;
    let rateLimitErrors = 0;

    for (let i = 1; i <= 50; i++) {
        try {
            const response = await axios.post(endpoint, { tweetUrl });
            console.log(`Request ${i}: Success`);
            successCount++;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log(`Request ${i}: Rate limited`);
                rateLimitErrors++;
            } else {
                console.error(`Request ${i}: Unexpected error`, error.message);
            }
        }
    }

    console.log(`\nSummary:`);
    console.log(`- Successful requests: ${successCount}`);
    console.log(`- Rate-limited requests: ${rateLimitErrors}`);
}

testRateLimiting();
