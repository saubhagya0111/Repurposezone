require('dotenv').config(); // Load environment variables
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User'); // Import the updated User schema

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL,
        },
        async (token, tokenSecret, profile, done) => {
            try {
                // Check if a user exists with the given twitterId
                let user = await User.findOne({ twitterId: profile.id });

                if (!user) {
                    // Check if there's an existing user with the same email (if available from Twitter)
                    const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });
                    if (existingUser) {
                        // Link the Twitter account to the existing user
                        existingUser.twitterId = profile.id;
                        existingUser.username = profile.username;
                        existingUser.displayName = profile.displayName;
                        existingUser.photo = profile.photos[0]?.value || null;
                        existingUser.token = token;
                        existingUser.tokenSecret = tokenSecret;
                        await existingUser.save();
                        return done(null, existingUser);
                    }

                    // Create a new user for Twitter login
                    user = await User.create({
                        name: profile.displayName || 'Twitter User',
                        email: profile.emails?.[0]?.value || `${profile.id}@twitter.com`, // Fallback for email
                        password: '', // No password for Twitter OAuth users
                        twitterId: profile.id,
                        username: profile.username,
                        displayName: profile.displayName,
                        photo: profile.photos[0]?.value || null,
                        token,
                        tokenSecret,
                    });
                } else {
                    // Update the user's tokens
                    user.token = token;
                    user.tokenSecret = tokenSecret;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                console.error('Error saving user:', err);
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
