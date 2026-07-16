const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'workshop16',
        });
        console.log('MongoDB Connected:', mongoose.connection.name);
    } catch (err) {
        console.error('Connection Failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;