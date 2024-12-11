const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

// Log file for monitoring
const trafficLog = 'traffic.log';
const cacheFile = 'tweetCache.json'; // Cache file for tweets

// Initialize cache
let tweetCache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile)) : {};

// Random delay to mimic human behavior
function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Append logs to file
function logTraffic(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(trafficLog, `[${timestamp}] ${message}\n`);
}

// Save cache to file
function saveCache() {
    fs.writeFileSync(cacheFile, JSON.stringify(tweetCache, null, 2));
}

// Initialize Selenium driver
let driver;
async function initDriver() {
    if (!driver) {
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    }
    return driver;
}

// Scrape tweet data
async function scrapeTweet(tweetUrl) {
    try {
        // Check cache first
        if (tweetCache[tweetUrl]) {
            logTraffic(`Cache hit for: ${tweetUrl}`);
            return tweetCache[tweetUrl];
        }

        const browser = await initDriver();

        logTraffic(`Requesting: ${tweetUrl}`);
        await browser.get(tweetUrl);

        // Simulate human-like scrolling
        await browser.executeScript('window.scrollTo(0, document.body.scrollHeight);');
        await randomDelay(2000, 3000);

        // Check for common issues before locating elements
        const pageSource = await browser.getPageSource();
        if (pageSource.includes('Something went wrong')) {
            throw new Error(
                'Tweet is not accessible. Possible reasons: 1. The tweet has been deleted. 2. The tweet is private or restricted.'
            );
        }

        // Locate tweet text dynamically
        const tweetTextElement = await browser.wait(
            until.elementLocated(By.css('[data-testid="tweetText"]')),
            10000
        );
        const tweetText = await tweetTextElement.getText();

        // Locate media links
        const mediaElements = await browser.findElements(By.css('[data-testid="tweetPhoto"] img'));
        const mediaLinks = [];
        for (const media of mediaElements) {
            mediaLinks.push(await media.getAttribute('src'));
        }

        // Locate author's handle
        const authorElement = await browser.findElement(By.css('a[href^="/"][href*="/status/"] span'));
        const authorHandle = await authorElement.getText();

        // Locate timestamp
        const timestampElement = await browser.findElement(By.css('time'));
        const timestamp = await timestampElement.getAttribute('datetime');

        // Success log
        logTraffic(`Success: Scraped tweet from ${tweetUrl}`);

        // Cache the result
        const result = {
            text: tweetText.trim(),
            media: mediaLinks,
            timestamp: timestamp || null,
        };
        tweetCache[tweetUrl] = result;
        saveCache();

        return result;
    } catch (error) {
        logTraffic(`Error: Failed to scrape ${tweetUrl}. Reason: ${error.message}`);
        throw new Error(error.message);
    }
}

// Close driver
async function closeDriver() {
    if (driver) {
        await driver.quit();
        driver = null;
        logTraffic('Browser session closed.');
    }
}

module.exports = {
    scrapeTweet,
    closeDriver,
};
