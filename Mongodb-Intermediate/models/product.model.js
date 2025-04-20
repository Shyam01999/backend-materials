const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price:Number,
    inStock:Boolean,
    tags:Array

});

module.exports = mongoose.model("Product", productSchema);