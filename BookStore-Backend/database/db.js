const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.anu2ypa.mongodb.net/`)
        // await mongoose.connect(`mongodb+srv://shyamsundarsahoo98:il69FQWCy87h8duL@cluster0.ceqjjvy.mongodb.net/`)
        console.log("Mongodb database connected successfully");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectToDb;
