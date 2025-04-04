require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

console.log( MONGO_URL);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
