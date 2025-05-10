const express = require("express");
const { createAuthor, createBook } = require("../controllers/book.controller");

const bookRoutes = express.Router();

bookRoutes.post("/author", createAuthor);
bookRoutes.post("/book", createBook);

module.exports = bookRoutes;