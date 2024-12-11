require('dotenv').config(); // Load environment variables
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Twitter strategy
passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL,
        },
        (token, tokenSecret, profile, done) => {
            // Simulate saving user to database
            const user = {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                photo: profile.photos[0]?.value || null,
                token,
                tokenSecret,
            };
            return done(null, user);
        }
    )
);

module.exports = passport;
