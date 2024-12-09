require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const connectDB = require('./db');
const healthCheckRoutes = require('./routes/healthCheck');

const app = express();
connectDB()
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(protectedRoutes);
app.use('/api', healthCheckRoutes);
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
