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
            return res.status(500).json({
                success: false,
                message: "Author creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Author created successfully"
        });

    } catch (error) {
        console.log("Error in add author controller", error);
        res.status(500).json({
            success: false,
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
                success: false,
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
            success: false,
            message: "Something went wrong ! Please try again"
        })
    }
}

const getBookWithAuthor = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "List of all books",
            data: book
        });

    } catch (error) {
        console.log("Error in book with author controller", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong ! Please try again"
        })
    }
}

module.exports = {
    createAuthor,
    createBook,
    getBookWithAuthor,
}