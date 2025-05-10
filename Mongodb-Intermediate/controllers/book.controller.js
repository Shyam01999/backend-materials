const Author = require("../models/author.model");
const Book = require("../models/book.model");

const createAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body;

        const newAuthor = new Author({
            name,
            bio,
        });

        await newAuthor.save();

        if (!newAuthor) {
            res.status(500).json({
                success: true,
                message: "Author creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Author created successfully"
        });

    } catch (error) {
        console.log("Error in add book controller", error);
        res.status(500).json({
            success: true,
            message: "Something went wrong ! Please try again"
        })
    }
}

const createBook = async (req, res) => {
    try {
        const { title, author } = req.body;

        const newBook = new Book({
            title,
            author,
        });

        await newBook.save();

        if (!newBook) {
            return res.status(500).json({
                success: true,
                message: "Book creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Book created successfully"
        });

    } catch (error) {
        console.log("Error in add book controller", error);
        res.status(500).json({
            success: true,
            message: "Something went wrong ! Please try again"
        })
    }
}

module.exports = {
    createAuthor,
    createBook
}