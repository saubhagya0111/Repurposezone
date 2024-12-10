const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const UserAgent = require('user-agents');
const fs = require('fs');

// Traffic monitoring log file
const trafficLog = 'traffic.log';

// Random delay function to mimic human behavior
function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Append logs to traffic.log
function logTraffic(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(trafficLog, `[${timestamp}] ${message}\n`);
}

// Initialize Selenium driver
let driver;
async function initDriver(proxy = null) {
    if (!driver) {
        const userAgent = new UserAgent();
        const options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--disable-gpu'); // Disable GPU for performance
        options.addArguments('--no-sandbox'); // Bypass OS-level sandboxing
        options.addArguments(`--user-agent=${userAgent.toString()}`); // Random User-Agent

        // Add proxy if provided
        if (proxy) {
            options.addArguments(`--proxy-server=${proxy}`);
        }

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }
    return driver;
}

// Scrape tweet data
async function scrapeTweet(tweetUrl) {
    try {
        const browser = await initDriver();

        // Log request
        logTraffic(`Requesting: ${tweetUrl}`);

        // Open the tweet URL
        await browser.get(tweetUrl);

        // Simulate human-like scrolling behavior
        await browser.executeScript('window.scrollTo(0, document.body.scrollHeight);');
        await randomDelay(3000, 5000); // Wait between 2-5 seconds randomly

        // Wait for the tweet text to load
        const tweetTextElement = await browser.wait(
            until.elementLocated(By.css('[data-testid="tweetText"]')),
            10000 // Wait up to 10 seconds
        );
        const tweetText = await tweetTextElement.getText();

        // Extract media links (if any)
        const mediaElements = await browser.findElements(By.css('[data-testid="tweetPhoto"] img'));
        const mediaLinks = [];
        for (let media of mediaElements) {
            mediaLinks.push(await media.getAttribute('src'));
        }

        // Extract the timestamp of the tweet
        const timestampElement = await browser.findElement(By.css('time'));
        const timestamp = await timestampElement.getAttribute('datetime');

        // Log success
        logTraffic(`Success: Scraped tweet from ${tweetUrl}`);

        // Return the extracted data
        return {
            text: tweetText.trim(),
            media: mediaLinks,
            timestamp: timestamp || null, // UTC timestamp (if available)
        };
    } catch (error) {
        // Log error
        logTraffic(`Error: Failed to scrape ${tweetUrl}. Reason: ${error.message}`);

        // Retry logic for temporary issues
        if (error.message.includes('CAPTCHA') || error.message.includes('network error')) {
            console.warn('Temporary error detected. Retrying...');
            await randomDelay(10000, 15000); // Wait 10-15 seconds before retrying
            return scrapeTweet(tweetUrl);
        }

        throw new Error(`Failed to scrape tweet. ${error.message}`);
    }
}


// Close the driver when finished
async function closeDriver() {
    if (driver) {
        await driver.quit();
        driver = null;
        logTraffic('Browser session closed.');
    }
}

// Export the scraper and cleanup function
module.exports = {
    scrapeTweet,
    closeDriver,
};
