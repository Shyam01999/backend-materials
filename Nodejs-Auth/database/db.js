const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.udztxij.mongodb.net/`);
        console.log(`MongoDb database connected successfully`)
    }
    catch (error) {
        console.errro(`MongDb connection failed`, error);
        process.exit(1);
    }
}

module.exports = connectToDb;