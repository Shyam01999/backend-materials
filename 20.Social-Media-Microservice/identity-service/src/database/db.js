const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectToDB = async () => {
    try {
        const dburl = process.env.MONGO_URI
        await mongoose.connect(dburl);
        logger.info("MongoDB connected Successfully");
    }
    catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
    }

}

module.exports = connectToDB;