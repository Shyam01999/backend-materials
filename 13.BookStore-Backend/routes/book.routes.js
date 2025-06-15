const express = require("express");
const { getAllBooks, getSingleBook, addBook, updateBook, deleteBook } = require("../controllers/book.controller");

const bookRoute = express.Router();

bookRoute.get("/getall", getAllBooks);
bookRoute.get("/get/:id", getSingleBook);
bookRoute.post("/add", addBook);
bookRoute.put("/update/:id", updateBook);
bookRoute.delete("/delete/:id", deleteBook);

module.exports = bookRoute;

