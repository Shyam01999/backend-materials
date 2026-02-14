const express = require("express");
const { createAuthor, createBook, getBookWithAuthor } = require("../controllers/book.controller");

const bookRoutes = express.Router();

bookRoutes.post("/author", createAuthor);
bookRoutes.post("/book", createBook);
bookRoutes.get("/book/:id", getBookWithAuthor);

module.exports = bookRoutes;