const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.iqtrw0t.mongodb.net/`);
        console.log(`MongoDb database connected successfully`);

    }
    catch (error) {
        console.error(`MongDb connection failed`, error);
        process.exit(1);
    }
}

module.exports = connectToDb;