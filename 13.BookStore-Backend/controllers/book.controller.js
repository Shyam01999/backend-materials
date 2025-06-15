// const express = require("express")
const Book = require("../models/book.model");


const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find();

        if (allBooks) {
            res.status(200).json({ success: true, allBooks });
        } else {
            res.status(404).json({ success: false, message: "No books found" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong please try again" })
    }
}

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        const findBook = await Book.findOne({ _id: id })

        if (findBook) {
            res.status(200).json({ success: true, findBook });
        } else {
            res.status(404).json({ success: false, message: `No books found with id ${id}` })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong please try again" })
    }
}

const addBook = async (req, res) => {
    try {
        const { title, author, year } = req.body;

        const createBook = await Book.create({
            title,
            author,
            year
        });

        if (createBook) {
            res.status(201).json({ success: true, message: "Book added successfully", createBook });
        } else {
            res.status(404).json({ success: false, message: "No books found" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong please try again" })
    }
}

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, year } = req.body;

        const updateBook = await Book.findByIdAndUpdate(id, { title, author, year }, {new:true});
        
        if (updateBook) {
            res.status(200).json({ success: true, message: "Book updated successfully", updateBook });
        } else {
            res.status(404).json({ success: false, message: "No books found" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong please try again" })
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteBook = await Book.findByIdAndDelete(id);

        if (deleteBook) {
            res.status(200).json({ success: true, deleteBook });
        } else {
            res.status(404).json({ success: false, message: `No books found with provided id ${id}` })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Something went wrong please try again" })
    }
}

module.exports = {
    getAllBooks,
    getSingleBook,
    addBook,
    updateBook,
    deleteBook,
}