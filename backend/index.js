require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const connectDB = require('./db');
const healthCheckRoutes = require('./routes/healthCheck');
const scrapeRoutes = require('./routes/scrapeRoutes');
const passport = require('./config/passport');
const session = require('express-session');
const fetchTweetRoutes = require('./routes/fetchTweetRoutes'); const contentRoutes = require("./routes/contentRoutes");
const testRoutes = require('./routes/testRoutes');
const twitterRoutes = require('./routes/twitterRoutes');



const app = express();
connectDB()
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Add session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Load from .env
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);
app.use(protectedRoutes);
app.use("/api/content", contentRoutes);
app.use('/api', testRoutes);
app.use(fetchTweetRoutes);
app.use('/api', healthCheckRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/twitter', twitterRoutes);
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
