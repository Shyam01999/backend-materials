require('dotenv').config();
const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.e6yfvdy.mongodb.net/`)
        
        console.log("Mongodb database connected successfully");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectToDb;
