const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
        console.log('--------------------------------------------------');
        console.log('SERVER UPDATED: The server is now running in PREVIEW mode.');
        console.log('You can still view the Frontend, but Login/Submit will fail.');
        console.log('To fix this, please provide a valid MONGO_URI in .env');
        console.log('--------------------------------------------------');
    }
};

module.exports = connectDB;
