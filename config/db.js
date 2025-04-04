require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

console.log('MongoDB Connection URL:', MONGO_URL);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            family: 4, // Use IPv4
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Error Details:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
