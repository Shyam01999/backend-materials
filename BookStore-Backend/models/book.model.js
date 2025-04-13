const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxLength: [100, "Book title can not be more than 100 characters"]

    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true
    },
    year: {
        type: Number,
        required: [true, "Publication year is required"],
        min:[1000, "Year must be at least 1000"],
        max:[new Date().getFullYear(),  "Year can not be in future"]
    },
    // createdBy: {
    //     type: Date,
    //     default: Date.now,
    // }

}, { timestamps: true })

module.exports = mongoose.model("Book", BookSchema);