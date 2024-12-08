const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
connectDB()
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
