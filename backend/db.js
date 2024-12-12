const mongoose = require('mongoose');

// Replace <connection-string> with your MongoDB Atlas URI or local MongoDB URI
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useUnifiedTopology: true, 
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

